export function verifyEmailTemplate({ username, verifyUrl, type = "signup"}) {
  
  const introText = type === "signup" 
    ? "Thanks for signing up for <strong>Dev Clustra</strong>. Please confirm your email address to complete your registration."
    : "We received a request for a new verification email link for your <strong>Dev Clustra</strong> account."
    
  return `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      
      <h2>Verify your email address</h2>

      <p>Hi <strong> ${username}</strong>,</p>

      <p> ${introText} </p>

      <p style="margin: 24px 0;">
        <a href="${verifyUrl}"
           style="
             display: inline-block;
             padding: 12px 20px;
             background-color: #000;
             color: #ffffff;
             text-decoration: none;
             border-radius: 4px;
           ">
          Verify Email
        </a>
      </p>

      <p>
        This verification link will expire in <strong>10 minutes</strong>.
      </p>

      <p style="font-size: 14px; color: #666;">
        If the button doesn’t work, copy and paste this link into your browser:
        <br />
        <a href="${verifyUrl}">${verifyUrl}</a>
      </p>

      <p style="font-size: 14px; color: #666;">
        If you didn’t create an account with Dev Clustra, you can safely ignore this email.
      </p>

      <p style="margin-top: 32px;">
        — The Dev Clustra Team<br />
        <span style="font-size: 14px; color: #666;">
          Need help? Contact us at
          <a href="mailto:support@mail.whoisalok.tech">support@mail.whoisalok.tech</a>
        </span>
      </p>

    </div>
  `;
}

