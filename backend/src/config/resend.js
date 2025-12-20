import { Resend } from "resend";
import { RESEND_API_KEY } from "./env.js";

const resendClient = new Resend(RESEND_API_KEY);

export async function sendEmail({ to, subject, html }) {
    return resendClient.emails.send({
        from: 'Dev Clustra <support@mail.whoisalok.tech>',
        replyTo: 'mailtestingalok@gmail.com',
        to,
        subject,
        html,
    });
}