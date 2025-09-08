import ErrorHandler from "../middlewares/errorMiddlewares.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { sendVerificationMail } from "../utils/sendVerificationMail.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { sendToken } from "../utils/sendToken.js";
import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplates.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(new ErrorHandler("Please enter all fields.", 400));
    }

    const existingUser = await User.findOne({ email, accountVerified: true });
    if (existingUser) {
      return next(new ErrorHandler("User already exists.", 400));
    }

    const registrationAttemptsByUser = await User.find({
      email,
      accountVerified: false,
    });

    // If user tried too many times
    if (registrationAttemptsByUser.length >= 5) {
      return next(
        new ErrorHandler(
          "You have exceeded the number of registration attempts. Please contact support.",
          400
        )
      );
    }
    if (password.length < 8 || password.length > 16) {
      return next(
        new ErrorHandler("Password must be 8 to 16 characters long.", 400)
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const verificationCode = await user.generateVerificationCode();
    await user.save();
    sendVerificationMail(verificationCode, email, res);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  // 1. Validate input
  if (!email || !otp) {
    return next(new ErrorHandler("Email or OTP is missing", 400));
  }

  try {
    // 2. Get all unverified entries for this email, sorted by newest first
    const userEntries = await User.find({
      email,
      accountVerified: false,
    }).sort({ createdAt: -1 });

    if (!userEntries || userEntries.length === 0) {
      return next(new ErrorHandler("User not found or already verified", 404));
    }

    // 3. Pick the latest entry (top one)
    const userEntry = userEntries[0];

    // 4. Delete all older entries except the latest one
    if (userEntries.length > 1) {
      const idsToDelete = userEntries.slice(1).map((u) => u._id);
      await User.deleteMany({ _id: { $in: idsToDelete } });
    }

    // 5. Check OTP validity
    if (
      userEntry.verificationCode !== Number(otp) ||
      userEntry.verificationCodeExpire < Date.now()
    ) {
      return next(new ErrorHandler("Invalid or expired OTP", 400));
    }

    // 6. Mark user as verified
    userEntry.accountVerified = true;
    userEntry.verificationCode = undefined;
    userEntry.verificationCodeExpire = undefined;
    await userEntry.save({ validateModifiedOnly: false });

    sendToken(userEntry, 200, "Account verified successfully.", res);
  } catch (error) {
    return next(new ErrorHandler("Internal server error", 500));
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password) {
    return next(new ErrorHandler("Please enter all fields.", 400));
  }

  // 2. Find verified user
  const user = await User.findOne({
    email,
    accountVerified: true,
  }).select("+password"); // explicitly select password since schema has select: false

  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }

  // 3. Match password
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }

  // 4. Send JWT token
  sendToken(user, 200, "User login successfully", res);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()), // expire immediately
      httpOnly: true, // security
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

export const getUserDetail = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  if (!req.body.email) {
    return next(new ErrorHandler("Please provide your email.", 400));
  }
  const user = await User.findOne({
    email: req.body.email,
    accountVerified: true,
  });

  if (!user) {
    return next(new ErrorHandler("Invalid email.", 400));
  }

  // Generate reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Reset password URL
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // Email message
  const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "Kitabay Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new ErrorHandler("Failed to send email, please try again.", 500)
    );
  }
});

export const resetPasswordHandler = catchAsyncErrors(async (req, res, next) => {
  // 1. Get token from request params
  const { token } = req.params;

  // 2. Hash the token to match the one stored in DB
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // 3. Find user with matching token and token not expired
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }, // Token not expired
  });

  if (!user) {
    return next(
      new ErrorHandler("Reset password token is invalid or has expired", 400)
    );
  }
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword) {
    return next(new ErrorHandler("Please provide all fields.", 400));
  }

  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password & confirm password do not match.", 400)
    );
  }

  // Check password length
  if (password.length < 8 || password.length > 16) {
    return next(
      new ErrorHandler("Password must be between 8 and 16 characters.", 400)
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.send({
    success: true,
    message:
      "Password reset successful. You can now log in with your new password.",
  });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("Please provide all fields.", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler("New password and confirm password do not match.", 400)
    );
  }

  if (newPassword.length < 8 || newPassword.length > 16) {
    return next(
      new ErrorHandler("Password must be between 8 and 16 characters.", 400)
    );
  }

  const user = await User.findById(userId).select("+password");
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  const isOldPasswordMatched = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect.", 400));
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedNewPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully.",
  });
});
