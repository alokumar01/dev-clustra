import { resendVerificationEmailServices, signupService, verifyEmailService } from "./auth.service.js";


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
        const {username, email, isEmailVerified} = result.user;

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

        await resendVerificationEmailServices({ email })

        res.status(200).json({
            success: true,
            message: "If your email exists, you will receive a verification link on your email,",
        });

    } catch (error) {
        next(error);
    }
}