import express from "express";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";
import {
  addBook,
  deleteBook,
  getAllBooks,
} from "../controllers/bookController.js";
const router = express.Router();

router.post("/add", isAuthenticated, isAuthorized("Admin", "Owner"), addBook);
router.get("/all", isAuthenticated, getAllBooks);
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Admin", "Owner"),
  deleteBook
);

export default router;
