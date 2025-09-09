import React, { useState } from "react";
import { BookA } from "lucide-react";
import Header from "../layout/Header";
import { useDispatch, useSelector } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import ReadBookPopup from "../popups/ReadBookPopup";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();
  const { books } = useSelector((state) => state.book);
  const { userBorrowedBooks } = useSelector((state) => state.borrow);
  const { readBookPopup } = useSelector((state) => state.popup);
  const [readBook, setReadBook] = useState({});
  const openReadPopup = (id) => {
    const book = books.find((book) => book._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };
  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    const result = `${formattedDate} ${formattedTime}`;
    return result;
  };
  const [filter, setFilter] = useState("returned");
  const returnedBooks = userBorrowedBooks.filter((book) => book.returned);
  const nonReturnedBooks = userBorrowedBooks.filter((book) => !book.returned);
  const booksToDisplay =
    filter === "returned" ? returnedBooks : nonReturnedBooks;
  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center ">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            Borrowed Books
          </h2>
        </header>
        <header className="flex flex-col  sm:flex-row md:items-center">
          <button
            className={`relative rounded sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg sm:rounded-bl-lg text-center border-2 font-semibold py-2 w-full sm:w-72 ${
              filter == "returned"
                ? "bg-black text-white border-black"
                : "text-black bg-gray-200 border-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("returned")}
          >
            Returned Books
          </button>
          <button
            className={`relative rounded sm:rounded-tl-none sm:rounded-bl-none sm:rounded-tr-lg sm:rounded-br-lg text-center border-2 font-semibold py-2 w-full sm:w-72 ${
              filter !== "returned"
                ? "bg-black text-white border-black"
                : "text-black bg-gray-200 border-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("non-returned")}
          >
            Non-Returned Books
          </button>
        </header>

        <div className="mt-6 overflow-auto bg-white shadow-lg rounded-md">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Book Title</th>
                <th className="px-4 py-2 text-left">Date & Time</th>
                <th className="px-4 py-2 text-left">Due Date</th>
                <th className="px-4 py-2 text-left">Returned</th>
                <th className="px-4 py-2 text-left">View</th>
              </tr>
            </thead>
            <tbody>
              {booksToDisplay.map((book, idx) => (
                <tr
                  key={idx}
                  className={(idx + 1) % 2 === 0 ? "bg-gray-50" : ""}
                >
                  <td className="px-4 py-2 text-left">{idx + 1}</td>
                  <td className="px-4 py-2 text-left">{book.bookTitle}</td>
                  <td className="px-4 py-2 text-left">
                    {formatDate(book.borrowedDate)}
                  </td>
                  <td className="px-4 py-2 text-left">
                    {formatDate(book.dueDate)}
                  </td>
                  <td className="px-4 py-2 text-left">
                    {book.returned ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2 text-left">
                    <BookA
                      className="cursor-pointer"
                      onClick={() => openReadPopup(book._id)}
                    />
                  </td>
                </tr>
              ))}
              {booksToDisplay.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
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
      {readBookPopup && <ReadBookPopup book={readBook} />}
    </>
  );
};

export default MyBorrowedBooks;
