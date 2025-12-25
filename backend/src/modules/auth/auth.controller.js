import { NODE_ENV } from "../../config/env.js";
import ApiError from "../../helpers/apiError.js";
import { generateAccessToken } from "../../helpers/jwt.js";
import { resendVerificationEmailService, signupService, verifyEmailService, loginService } from "./auth.service.js";


export const signupController = async (req, res, next) => { // Controller ka kaam hai HTTP data extract karna
    try {
        const {username, email, password}  = req.body;
        
        const user = await signupService({ username, email, password });
        
        res.status(201).json({
            success: true,
            message: "Signup successful. Please check your email to verify your account.",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

export const verifyEmailController = async (req, res, next) => {
    try {
        const { token } = req.query;
        
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Verification token is required"
            });
        }

        const result = await verifyEmailService({ token });
        // const {username, email, isEmailVerified} = result.user;

        res.status(200).json({
            success: true,
            message: "Your email is verified now. You can start log in.",
        });

    } catch (error) {
        next(error);
    }
}

//Resend Verification mail to user
export const resendVerificationEmailController = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email Id is required"
            });
        }

        await resendVerificationEmailService({ email })

        res.status(200).json({
            success: true,
            message: "If your email exists, you will receive a verification link on your email,",
        });

    } catch (error) {
        next(error);
    }
}

//login controller
export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ApiError(400, "Email and Password are required");
        }

        const { user, wasSuspended } = await loginService({ email, password });

        //generating jwt access token only with id 
        const token = generateAccessToken( user._id );
        
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 15 * 60,
            sameSite: "strict"
        } )

        let message = "Login Successful!, Happy to see you!";
        
        if (wasSuspended) {
            message = "Welcome back! Your suspension period has ended. Please follow our Code of Conduct.";
        }

        res.status(200).json({
            success: true,
            message: message,
            // data: { username: user.username }
        });
        
    } catch (error) {
        next(error)
    }
}

//logout
export const logoutController = async (req, res, next) => {
    try {
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: "strict"
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully. See you soon!"
        });
    } catch (error) {
        next(error);
    }
}