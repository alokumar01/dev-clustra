import bcrypt from "bcryptjs";
import User from "../user/user.model.js"
import ApiError from "../../helpers/apiError.js";
import { sendVerificationEmail } from "../../email/intents/sendVerificationEmail.js";
import { generateEmailToken, hashToken} from "../../helpers/crypto.js";

//// service, object receive karti hai, services db se talk karti hai,
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

export const resendVerificationEmailServices = async({ email }) => {
    const user = await User.findOne({ email });
    
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
