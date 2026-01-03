import { NODE_ENV } from "../../config/env.js";
import ApiError from "../../helpers/apiError.js";
import { resendVerificationEmailService, signupService, verifyEmailService, loginService, logoutService, refreshAccessTokenService, updateProfileService, changePasswordService, forgotPasswordService, resetPasswordService } from "./auth.service.js";


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
            throw new ApiError(400, "Email id is required", "EMAIL_REQUIRED")
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

        const { wasSuspended, accessToken, refreshToken } = await loginService({ email, password });

        //jwt access token only with user._id into cookies, short lived token
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 15 * 60,
            sameSite: "strict"
        } )
        
        // jwt refresh token into cookies, longer time token only used when accessToken expires
        res.cookie("refreshToken", refreshToken, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 7 *  24 * 60 * 60,
            sameSite: "strict"
        })                
        
        let message = "Login Successful!, Happy to see you!";
        
        if (wasSuspended) {
            message = "Welcome back! Your suspension period has ended. Please follow our Code of Conduct.";
        }

        res.status(200).json({
            success: true,
            message: message,
        });
        
    } catch (error) {
        next(error)
    }
}

//logout
export const logoutController = async (req, res, next) => {
    try {
        //get the token 
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            res.sendStatus(204);
            return;
        }

        await logoutService({ refreshToken })

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

// refresh token 
export const refreshAccessTokenController = async (req, res, next) => {
    try {
        const oldRfToken = req.cookies.refreshToken;
        
        if(!oldRfToken) {
            throw new ApiError(401, "Refresh token missing", "REFRESH_TOKEN_MISSING");
        }

        //calling the services
        const {accessToken, refreshToken } = await refreshAccessTokenService({ oldRfToken });
        
        const cookieOption = {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: "strict",
        }

        //setting tokens to browser
        res.cookie("accessToken", accessToken, { ...cookieOption, maxAge: 15 * 60 * 1000 });
        res.cookie("refreshToken", refreshToken, {...cookieOption, maxAge: 7 * 24 * 60 * 60 * 1000 });
        
        res.status(200).json({
            success: true,
            message: "Token refreshed successfuly!"
        })

    } catch (error) {
        next(error)
    }
}

export const updateProfileController = async (req, res, next) => {
    try {
        const { username, bio } = req.body;
        
        const updatedUser = await updateProfileService({
            userId: req.user._id,
            newUsername: username,
            newBio: bio
        });
        
        res.status(200).json({
            success: true,
            message: "Profile updated succesfully",
        });

    } catch (error) {
        next(error);   
    }
}

// change password contoller, when logged in
export const changePasswordController = async(req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const data = await changePasswordService({
            userId: req.user._id,
            oldPassword: oldPassword,
            newPassword: newPassword
        })

        res.status(200).json({
            success: true,
            message: "Password updated successfully!!"
        });

    } catch (error) {
        next(error);
    }
}

//forget password, when not logged in or user forgot the password, in two steps 
export const forgotPasswordController = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw new ApiError(400, "Email Id is required", "EMAIL_REQUIRED");
        }

        await forgotPasswordService({ email });

        res.status(200).json({
            success: true,
            message: "If you account exists, you will receive a reset email",
        })

    } catch (error) {
        next(error);
    }
}

//Reset password after sending token to user
export const resetPasswordController = async (req, res, next) => {
    try {
        const { token } = req.query;
        const { newPassword } = req.body;

        if (!token) {
            throw new ApiError(404, "Token not found", "RESET_TOKEN_NOT_FOUND");
        }

        if (!newPassword) {
            throw new ApiError(404, "New password is required", "PASSWORD_REQUIRED");
        }

        await resetPasswordService({ token, newPassword });

        res.status(200).json({
            success: true,
            message: "Password reset successfully!!!"
        });

    } catch (error) {
        next(error);
    }
}