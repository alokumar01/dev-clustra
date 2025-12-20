import { sendEmail } from "../../config/resend.js";
import { verifyEmailTemplate } from "../templates/verifyEmail.template.js";
import { FRONTEND_URL } from "../../config/env.js";

export async function sendVerificationEmail({username, email, token }) {
    const verifyUrl = `${FRONTEND_URL}/verify-email?token=${token}`;

    const html = verifyEmailTemplate ({
        username: username,
        verifyUrl,
    });

    await sendEmail({
        to: email,
        subject: "Verify your email",
        html
    });
}
