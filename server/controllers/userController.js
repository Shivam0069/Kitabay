import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import Book from "../models/bookModel.js";
import User from "../models/userModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ accountVerified: true });
  res.status(200).json({
    success: true,
    users,
  });
});

export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Please upload a profile picture", 400));
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  const existingUser = await User.findOne({ email, accountVerified: true });
  if (existingUser) {
    existingUser.role = "Admin";
    await existingUser.save();
    return res.status(200).json({
      success: true,
      message: "User promoted to admin successfully",
      user: existingUser,
    });
  }

  if (password.length < 8 || password.length > 16) {
    return next(
      new ErrorHandler("Password must be between 8 and 16 characters", 400)
    );
  }

  const { avatar } = req.files;
  const allowedFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(
      new ErrorHandler(
        "Invalid file format. Only JPEG, PNG, JPG, and WEBP are allowed.",
        400
      )
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const cloudinaryResponse = await cloudinary.uploader.upload(
    avatar.tempFilePath,
    {
      folder: "kitabay_admin_avatars",
    }
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    return next(new ErrorHandler("Image upload failed", 500));
  }
  if (!cloudinaryResponse.secure_url) {
    return next(new ErrorHandler("Image upload failed", 500));
  }

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "Admin",
    accountVerified: true,
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
    user,
  });
});
