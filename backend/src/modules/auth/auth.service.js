import bcrypt from "bcryptjs";
import User from "../user/user.model.js"
import ApiError from "../../helpers/apiError.js";
import { sendVerificationEmail } from "../../email/intents/sendVerificationEmail.js";
import { generateEmailToken, hashToken} from "../../helpers/crypto.js";

export const signupService = async({ username, email, password })  => { // service object receive karti hai 
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
    // console.log(emailToken);
    // console.log(hash);

    user.emailVerifyHash = hash;
    user.emailVerifyExpires = Date.now() + 10 * 60 * 1000; //10 minutes
    await user.save();
    
    try {
        await sendVerificationEmail({
            username,
            email, 
            token: emailToken
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

