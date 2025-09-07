export function generateVerificationOtpEmailTemplate(otpCode) {
  return `
    
  <div style="max-width:600px;margin:0 auto;padding:20px;font-family:Arial,sans-serif;background:#f4f6f8;">
    <div style="text-align:center;margin-bottom:20px;">
      <h2 style="color:#0f172a;margin:0;">KITABAY</h2>
    </div>

    <div style="background:#fff;padding:24px;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.06);">
      <h3 style="margin-top:0;color:#0f172a;">Verify your email address</h3>
      <p style="color:#475569;line-height:1.5;">
        You (or someone using your email) requested to register an account on <b>Kitabay</b>.
        Use the code below to complete your registration.
      </p>

      <div style="text-align:center;margin:24px 0;">
        <span style="display:inline-block;padding:12px 18px;background:#0ea5a1;color:#fff;
        font-weight:bold;font-size:24px;letter-spacing:6px;border-radius:6px;font-family:monospace;">
          ${otpCode}
        </span>
      </div>

      <p style="color:#475569;line-height:1.5;">
        This code will expire in <b>10 minutes</b>.
        If you did not request this code, please ignore this email — no further action is required.
      </p>
    </div>

    <div style="margin-top:20px;text-align:center;font-size:12px;color:#94a3b8;">
      <p>This is an automatically generated email — please do not reply.</p>
      <p>© ${new Date().getFullYear()} Kitabay. All rights reserved.</p>
    </div>
  </div>
  `;
}

export function generateForgotPasswordEmailTemplate(resetUrl) {
  return `
  <div style="max-width:600px;margin:0 auto;padding:20px;font-family:Arial,sans-serif;background:#f4f6f8;">
    <div style="text-align:center;margin-bottom:20px;">
      <h2 style="color:#0f172a;margin:0;">KITABAY</h2>
    </div>

    <div style="background:#fff;padding:24px;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.06);">
      <h3 style="margin-top:0;color:#0f172a;">Reset Your Password</h3>
      <p style="color:#475569;line-height:1.5;">
        You (or someone using your email) requested to reset your password for your <b>Kitabay</b> account.
        Click the button below to set a new password.
      </p>

      <div style="text-align:center;margin:24px 0;">
        <a href="${resetUrl}" target="_blank" 
           style="display:inline-block;padding:12px 24px;background:#0ea5a1;color:#fff;
                  font-weight:bold;font-size:16px;text-decoration:none;border-radius:6px;">
          Reset Password
        </a>
      </div>

      <p style="color:#475569;line-height:1.5;">
        This link will expire in <b>10 minutes</b>.
        If you did not request a password reset, you can safely ignore this email — no further action is required.
      </p>
    </div>

    <div style="margin-top:20px;text-align:center;font-size:12px;color:#94a3b8;">
      <p>This is an automatically generated email — please do not reply.</p>
      <p>© ${new Date().getFullYear()} Kitabay. All rights reserved.</p>
    </div>
  </div>
  `;
}
