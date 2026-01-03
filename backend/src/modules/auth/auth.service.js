import bcrypt from "bcryptjs";
import User from "../user/user.model.js"
import ApiError from "../../helpers/apiError.js";
import { sendResetPasswordEmail, sendVerificationEmail } from "../../email/intents/sendVerificationEmail.js";
import { generateEmailToken, generateForgotPasswordToken, hashResetToken, hashToken} from "../../helpers/crypto.js";
import { generateAccessToken, generateRefreshToken } from "../../helpers/jwt.js";
import jwt from "jsonwebtoken"
import { JWT_REFRESH_SECRET } from "../../config/env.js";

//// service, object receive karti hai, services db se talk karti hai, means business logic 
export const signupService = async({ username, email, password })  => {  
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if(existingUser) {
        throw new ApiError(409, "User already exist!", "USER_ALREADY_EXISTS");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        passwordHash,
    });

    const {emailToken, hash} = generateEmailToken();

    user.emailVerifyHash = hash;
    user.emailVerifyExpires = Date.now() + 10 * 60 * 1000; //10 minutes
    await user.save();
    
    try {
        await sendVerificationEmail({
            username: user.username,
            email: user.email,
            token: emailToken,
            type: "signup"
        })
        
    } catch (error) {
        console.info('email failed', error);
    }

    return {
        id: user._id,
        username: user.username,
        email: user.email
    };
};

export const verifyEmailService = async({ token }) => {
    const incomingHashToken = hashToken(token);

    const user = await User.findOne({
        emailVerifyHash: incomingHashToken,
    });

    if (!user) throw new ApiError(400, "This link is invalid or has already been used. Request new ones from login page", "TOKEN_EXPIRED");
    
    if (user.emailVerifyExpires < Date.now()) {
        throw new ApiError(401, "Token expired please request a new one.", "TOKEN_EXPIRED");
    }

    user.isEmailVerified = true;
    user.emailVerifyExpires = undefined;
    user.emailVerifyHash = undefined;

    await user.save();

    return { user };
};

export const resendVerificationEmailService = async({ email }) => {
    const user = await User.findOne({ email })
    
    if (!user) return;

    if (user.isEmailVerified) {
        throw new ApiError(400, "Email is already verified, you can log in now", "EMAIL_ALREADY_VERIFIED ")
    }

    const { emailToken, hash } = generateEmailToken();
    user.emailVerifyHash = hash;
    user.emailVerifyExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    try {
        await sendVerificationEmail({
            username: user.username,
            email: user.email,
            token: emailToken,
            type: "resend"
        })
    } catch (error) {
        console.log("Email sent failed", error);
        throw new ApiError(500, "Failed to sent email, Try again later");
    }

    return { username : user.username, email: user.email};
}

export const loginService = async({ email, password }) => {
    const user = await User.findOne({ email });
    
    //User exist or not
    if(!user) {
        throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }

    //checking user email is verified or not
    if (!user.isEmailVerified) {
        throw new ApiError(403, "Please verify your account first", "EMAIL_NOT_VERIFIED")
    }
    
    //checking account status
    if (user.accountStatus === "blocked") {
        throw new ApiError(403, "Your account is permanently banned", "USER_BANNED")
    }

    //check for suspend
    let wasSuspended = false;
    if (user.accountStatus === "suspended") {
        const now = new Date();
        
        //suspension time hasn't not passed yet
        if (user.suspendedUntil && user.suspendedUntil > now) {
            const istTime = user.suspendedUntil.toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                dateStyle: "medium",
                timeStyle: "short",
            });
            throw new ApiError(403, "Your account is temporarily suspended", "USER_SUSPENDED", {suspendedUntil: istTime, reason: user.statusReason });
        }

        // if time has passed then 
        user.accountStatus ="active";
        user.suspendedUntil = null;
        user.statusReason = "";
        await user.save();
        wasSuspended = true;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect){
        throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }

    //generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    //saving refreshtoken to db
    user.refreshToken.push({ token: refreshToken });
    await user.save();


    return { wasSuspended, accessToken, refreshToken };
}

export const logoutService = async({ refreshToken }) => {
    await User.updateOne(
        { "refreshToken.token": refreshToken},
        { 
            $pull: {
                refreshToken: { token: refreshToken } 
            }
        }
    )
}

export const refreshAccessTokenService = async({ oldRfToken }) => {
    //verify the token, throws error if expired or anything else
    const decode = jwt.verify(oldRfToken, JWT_REFRESH_SECRET)
    
    //find the user and check the specfic token
    const user = await User.findOne({
        _id: decode.sub,
        "refreshToken.token": oldRfToken // checking this token exisits in array or not
    });

    if (!user) {
        throw new ApiError(401, "Invalid refresh token", "INVALID_REFRESH_TOKEN");
    }

    //ROTATION LOGIC, remove old token 
    user.refreshToken = user.refreshToken.filter(
        rt => rt.token != oldRfToken
    );

    //sab sahi hai, then me generate dono token generate kar raha hu
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    //saving refreshtoken to db
    user.refreshToken.push({ token: refreshToken });
    await user.save();

    return { accessToken, refreshToken };
}

//updat profile service
export const updateProfileService = async({ userId, newUsername, newBio }) => {
    const user = await User.findById(userId);
    //user exist or not
    if (!user)  throw new ApiError(404, "User not found", "USER_NOT_FOUND");

    //doing interval check 
    if (newUsername && newUsername !== user.username) {
        const fourteenInMs = 14 * 24 * 60 * 60 * 1000;
        const lastChanged = Date.now() - (user.lastUsernameChange || 0);

        if( lastChanged < fourteenInMs) {
            throw new ApiError(403, "You can only change your username once every 14 days", "USERNAME_NOT_CHANGED");
        }
        
        //searching the new username in our db;
        const isTaken = await User.findOne({ username: newUsername, _id: { $ne: user._id} });
        if (isTaken) throw new ApiError(409, "This username is already taken", "USERNAME_ALREADY_TAKEN");
        
        //update the user name
        user.username = newUsername;
        user.lastUsernameChange = Date.now();
    }

    //bio ko always
    if (newBio !== undefined) {
        user.bio = newBio;
    }

    await user.save();
    return user;
}

//change password
export const changePasswordService = async({ userId, oldPassword, newPassword }) => {
    const user = await User.findById(userId).select("+passwordHash");
    
    if (!user) throw new ApiError(404, "User not found", "USER_NOT_FOUND");

    //comparing old password
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Old password is invalid", "INVALID_CREDENTIALS");
    }

    if (oldPassword === newPassword) {
        throw new ApiError(400, "New password cannot be the same as the old one", "");   
    }

    //hash the new password
    // const newPass = await bcrypt.hash(newPassword, 10);
    user.passwordHash = await bcrypt.hash(newPassword, 10);

    // invlaidate all other session, good and best;
    user.refreshToken = [];

    await user.save();
}

// forgot password
export const forgotPasswordService = async ({ email }) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, "Invalid or wrong email entered", "USER_NOT_FOUND");
    }

    const { resetToken, hash } = generateForgotPasswordToken();
    user.forgotPasswordHash = hash;
    user.forgotPasswordExpires = Date.now() + 10 * 60 * 1000 
    await user.save();

    try {     
        await sendResetPasswordEmail({
            username: user.username,
            email: email,
            token: resetToken
        });
        
    } catch (error) {
        throw new ApiError(500, "Failed to sent reset link")
    }
}

export const resetPasswordService = async ({ token, newPassword }) => {
    const hashedToken = hashResetToken(token);

    //find the user with that hash token
    const user = await User.findOne({
        forgotPasswordHash: hashedToken,
        forgotPasswordExpires: { $gt: Date.now() }
    });

    if (!user) throw new ApiError(400, "Token is invalid or expired.", "RESET_TOKEN_EXPIRED");

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    
    user.forgotPasswordExpires = undefined;
    user.forgotPasswordHash = undefined;
    user.refreshToken = []; //force logout on all devices

    await user.save();
}