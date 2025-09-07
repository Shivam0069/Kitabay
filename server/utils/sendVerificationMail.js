import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js";
import { sendEmail } from "./sendEmail.js";

export const sendVerificationMail = (code, email, res) => {
  try {
    const message = generateVerificationOtpEmailTemplate(code);
    sendEmail({
      email,
      subject: "Kitabay Otp Verification - Do Not Share",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Verification code sent successfully.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send verification email.",
    });
  }
};
