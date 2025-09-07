import express from "express";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";
import {
  borrowBook,
  getAllBorrowRecords,
  getBorrowRecordsByUser,
  returnBorrowedBook,
} from "../controllers/borrowController.js";

const router = express.Router();

// POST /api/v1/borrow/:bookId → Borrow a book
router.post("/:bookId", isAuthenticated, borrowBook);

// GET /api/v1/borrow → Admin gets all borrow records
router.get("/", isAuthenticated, isAuthorized("Admin"), getAllBorrowRecords);

// GET /api/v1/borrow/mine → User gets borrow records of itself
router.get("/my-borrowed-books", isAuthenticated, getBorrowRecordsByUser);

// PUT /api/v1/borrow/return/:borrowId → Admin marks book as returned
router.put(
  "/return/:bookId",
  isAuthenticated,
  isAuthorized("Admin"),
  returnBorrowedBook
);

export default router;
