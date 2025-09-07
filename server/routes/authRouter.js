import express from "express";
import {
  forgotPassword,
  getUserDetail,
  login,
  logout,
  register,
  resetPasswordHandler,
  updatePassword,
  verifyOTP,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/profile", isAuthenticated, getUserDetail);
router.post("/password/forgot", forgotPassword);
router.post("/password/reset/:token", resetPasswordHandler);
router.put("/password/update", isAuthenticated, updatePassword);

export default router;
