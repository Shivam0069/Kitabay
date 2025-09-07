import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import Book from "../models/bookModel.js";
import User from "../models/userModel.js";
import Borrow from "../models/borrowModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { calculateFine } from "../utils/fineCalculator.js";

export const getBorrowRecordsByUser = catchAsyncErrors(
  async (req, res, next) => {
    const { borrowedBooks } = req.user;
    return res.status(200).json({
      success: true,
      borrowedBooks,
    });
  }
);

export const getAllBorrowRecords = catchAsyncErrors(async (req, res, next) => {
  const borrowedBooks = await Borrow.find();

  res.status(200).json({
    success: true,
    borrowedBooks,
  });
});

export const borrowBook = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;
  const { email } = req.body;

  if (!email || !bookId) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  const book = await Book.findById(bookId);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (book.quantity < 1) {
    return next(new ErrorHandler("Book is currently unavailable", 400));
  }

  const alreadyBorrowed = user.borrowedBooks.find(
    (b) => b.bookId.toString() === bookId && !b.returned
  );
  if (alreadyBorrowed) {
    return next(new ErrorHandler("This user already borrowed this book", 400));
  }

  const borrowRecord = await Borrow.create({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    price: book.price,
    book: {
      id: book._id,
      title: book.title,
    },
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
  });

  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  user.borrowedBooks.push({
    bookId: book._id,
    returned: false,
    bookTitle: book.title,
    borrowedDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
  });
  await user.save();

  res.status(201).json({
    success: true,
    message: "Book borrowed successfully",
    borrowRecord,
  });
});

export const returnBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;
  const { email } = req.body;
  if (!email || !bookId) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }
  const book = await Book.findById(bookId);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const borrowRecord = await Borrow.findOne({
    "user.email": email,
    "book.id": bookId,
    returnDate: null,
  });
  if (!borrowRecord) {
    return next(new ErrorHandler("No active borrow record found", 404));
  }
  borrowRecord.returnDate = new Date();
  const fine = calculateFine(borrowRecord.dueDate, book.price);
  borrowRecord.fine = fine;
  await borrowRecord.save();
  book.quantity += 1;
  book.availability = true;
  await book.save();
  const userBorrowRecord = user.borrowedBooks.find(
    (b) => b.bookId.toString() === bookId && !b.returned
  );
  if (userBorrowRecord) {
    userBorrowRecord.returned = true;
    await user.save();
  }
  res.status(200).json({
    success: true,
    message:
      fine == 0
        ? `Book returned successfully. Total Charges : ${book.price} rupee`
        : `Book returned with a fine. Total Charges : ${
            book.price + fine
          } rupee`,
    borrowRecord,
  });
});
