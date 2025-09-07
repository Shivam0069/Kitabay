import express from "express";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";
import {
  getAllUsers,
  registerNewAdmin,
} from "../controllers/userController.js";

const router = express.Router();

router.get(
  "/all",
  isAuthenticated,
  isAuthorized("Admin", "Owner"),
  getAllUsers
);
router.post(
  "/add/new-admin",
  isAuthenticated,
  isAuthorized("Owner"),
  registerNewAdmin
);

export default router;
