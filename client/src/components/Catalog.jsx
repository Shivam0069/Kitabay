import React, { useEffect, useState } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import Header from "../layout/Header";
import { useDispatch, useSelector } from "react-redux";
import { formatDate, formatDateAndTime } from "../utils/formatDateTime";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSliceData } from "../store/slices/bookSlice";
import {
  fetchAllBorrowedBooks,
  resetBorrowSliceData,
} from "../store/slices/borrowSlice";
import ReturnBookPopup from "../popups/ReturnBookPopup";
const Catalog = () => {
  const dispatch = useDispatch();
  const { returnBookPopup } = useSelector((state) => state.popup);
  const { loading, error, message, allBorrowedBooks } = useSelector(
    (state) => state.borrow
  );
  const [filter, setFilter] = useState("borrowed");
  const currentDate = new Date();
  const borrowedBooks = allBorrowedBooks?.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return dueDate > currentDate;
  });
  const overDueBooks = allBorrowedBooks?.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return book.returnDate === null && dueDate <= currentDate;
  });
  const booksToDisplay = filter === "borrowed" ? borrowedBooks : overDueBooks;
  const [email, setEmail] = useState("");
  const [borrowedBookId, setBorrowedBookId] = useState("");
  const openReturnBookPopup = (bookId, email) => {
    setBorrowedBookId(bookId);
    setEmail(email);
    dispatch(toggleReturnBookPopup());
  };
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSliceData());
      dispatch(resetBorrowSliceData());
    }
    if (error) {
      toast.error(error);
      dispatch(resetBorrowSliceData());
    }
  }, [dispatch, error, loading]);
  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        {/* <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center ">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            Borrowed Books
          </h2>
        </header> */}
        <header className="flex flex-col  sm:flex-row md:items-center">
          <button
            className={`relative rounded sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg sm:rounded-bl-lg text-center border-2 font-semibold py-2 w-full sm:w-72 ${
              filter == "borrowed"
                ? "bg-black text-white border-black"
                : "text-black bg-gray-200 border-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("borrowed")}
          >
            Borrowed Books
          </button>
          <button
            className={`relative rounded sm:rounded-tl-none sm:rounded-bl-none sm:rounded-tr-lg sm:rounded-br-lg text-center border-2 font-semibold py-2 w-full sm:w-72 ${
              filter === "overdue"
                ? "bg-black text-white border-black"
                : "text-black bg-gray-200 border-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("overdue")}
          >
            Overdue Borrowers
          </button>
        </header>

        <div className="mt-6 overflow-auto bg-white shadow-lg rounded-md">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">UserName</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Due Date</th>
                <th className="px-4 py-2 text-left">Date & Time</th>
                <th className="px-4 py-2 text-left">Return</th>
              </tr>
            </thead>
            <tbody>
              {booksToDisplay.map((book, idx) => (
                <tr
                  key={idx}
                  className={(idx + 1) % 2 === 0 ? "bg-gray-50" : ""}
                >
                  <td className="px-4 py-2 text-left">{idx + 1}</td>
                  <td className="px-4 py-2 text-left">{book?.user.name}</td>
                  <td className="px-4 py-2 text-left">{book?.user.email}</td>
                  <td className="px-4 py-2 text-left">
                    {formatDate(book?.price)}
                  </td>
                  <td className="px-4 py-2 text-left">
                    {formatDate(book?.dueDate)}
                  </td>
                  <td className="px-4 py-2 text-left">
                    {formatDateAndTime(book?.borrowDate)}
                  </td>
                  <td className="px-4 py-2 text-left">
                    {book?.returnDate ? (
                      <FaSquareCheck className="w-6 h-6" />
                    ) : (
                      <PiKeyReturnBold
                        onClick={() =>
                          openReturnBookPopup(book.book.id, book?.user.email)
                        }
                        className="w-6 h-6 cursor-pointer"
                      />
                    )}
                  </td>
                </tr>
              ))}
              {booksToDisplay.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-2 text-center text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      {returnBookPopup && <ReturnBookPopup />}
    </>
  );
};

export default Catalog;
