export function resetPasswordEmailTemplate({ username, resetUrl }) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
      
      <h2 style="color: #000;">Reset your password</h2>

      <p>Hi <strong>${username}</strong>,</p>

      <p>
        We received a request to reset the password for your 
        <strong>Dev Clustra</strong> account.
      </p>

      <p>
        Click the button below to securely reset your password.
      </p>

      <p style="margin: 24px 0;">
        <a href="${resetUrl}"
           style="
             display: inline-block;
             padding: 12px 22px;
             background-color: #000;
             color: #ffffff;
             text-decoration: none;
             border-radius: 4px;
             font-weight: bold;
           ">
          Reset Password
        </a>
      </p>

      <p>
        This password reset link will expire in <strong>10 minutes</strong>.
      </p>

      <p style="font-size: 14px; color: #666;">
        If the button doesn’t work, copy and paste this link into your browser:
        <br />
        <a href="${resetUrl}" style="color: #000;">${resetUrl}</a>
      </p>

      <p style="font-size: 14px; color: #666;">
        If you didn’t request a password reset, you can safely ignore this email.
        Your account will remain secure.
      </p>

      <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />

      <p>
        — The Dev Clustra Team<br />
        <span style="font-size: 14px; color: #666;">
          Need help? Contact us at
          <a href="mailto:support@mail.whoisalok.tech" style="color: #000;">
            support@mail.whoisalok.tech
          </a>
        </span>
      </p>

    </div>
  `;
}
