import ErrorHandler from "../middlewares/errorMiddlewares.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { sendVerificationMail } from "../utils/sendVerificationMail.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { sendToken } from "../utils/sendToken.js";

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
