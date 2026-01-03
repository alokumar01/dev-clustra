import { sendEmail } from "../../config/resend.js";
import { verifyEmailTemplate } from "../templates/verifyEmail.template.js";
import { FRONTEND_URL } from "../../config/env.js";
import { resetPasswordEmailTemplate } from "../templates/resetPassword.template.js";

export async function sendVerificationEmail({username, email, token, type = "signup" }) {
    const verifyUrl = `${FRONTEND_URL}/verify-email?token=${token}`;

    const html = verifyEmailTemplate ({
        username: username,
        verifyUrl,
        type
    });

    const subject = type === "signup" ? "Verify your email" : "New Verification Link"

    await sendEmail({
        to: email,
        subject: subject,
        html
    });
}

// reset password 
export async function sendResetPasswordEmail({ username, email, token }) {
    const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;

    const html = resetPasswordEmailTemplate ({
        username: username,
        resetUrl,
    });

    await sendEmail({
        to: email,
        subject: "Reset Password Link",
        html
    })
}