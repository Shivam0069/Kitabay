import React, { useEffect, useState } from "react";
import { BookA, NotebookPen } from "lucide-react";
import Header from "../layout/Header";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
} from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSliceData } from "../store/slices/bookSlice";
import {
  fetchAllBorrowedBooks,
  resetBorrowSliceData,
} from "../store/slices/borrowSlice";
import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";

const BookManagement = () => {
  const dispatch = useDispatch();
  const { loading, error, books, message } = useSelector((state) => state.book);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { addBookPopup, readBookPopup, recordBookPopup } = useSelector(
    (state) => state.popup
  );
  const {
    loading: borrowSliceLoading,
    error: borrowSliceError,
    message: borrowSliceMessage,
  } = useSelector((state) => state.borrow);

  const [readBook, setReadBook] = useState({});
  const [borrowBookId, setBorrowBookId] = useState("");
  const openReadPopup = (id) => {
    const book = books.find((book) => book._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };
  const openBorrowBookPopup = (id) => {
    setBorrowBookId(id);
    dispatch(toggleRecordBookPopup());
  };

  useEffect(() => {
    if (borrowSliceMessage || message) {
      toast.success(message || borrowSliceMessage);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBorrowSliceData());
      dispatch(resetBookSliceData());
    }
    if (error || borrowSliceError) {
      toast.error(error || borrowSliceError);
      dispatch(resetBorrowSliceData());
      dispatch(resetBookSliceData());
    }
  }, [
    dispatch,
    error,
    message,
    loading,
    borrowSliceError,
    borrowSliceLoading,
    borrowSliceMessage,
  ]);

  const [keyword, setKeyword] = useState("");

  const handleSearch = (e) => {
    setKeyword(e.target.value.toLowerCase());
  };
  const searchedBooks = books.filter((book) =>
    book.title.toLowerCase().includes(keyword)
  );

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center ">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            {user?.role === "Users" ? "Books" : "Book Management"}
          </h2>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            {isAuthenticated && user?.role !== "User" && (
              <button
                className="relative pl-14  w-full sm:w-52 flex gap-4 justify-center items-center py-2 px-4 bg-black text-white  rounded-md hover:bg-gray-800"
                onClick={() => dispatch(toggleAddBookPopup())}
              >
                <span className="bg-white flex justify-center items-center overflow-hidden rounded-full text-black w-[25px] h-[25px] text-[27px] absolute left-5  ">
                  +
                </span>
                Add New Book
              </button>
            )}
            <input
              type="text"
              placeholder="Search books..."
              className="w-full sm:w-52 border p-2 border-gray-300 rounded-md"
              value={keyword}
              onChange={handleSearch}
            />
          </div>
        </header>

        <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-center">ID</th>
                <th className="px-4 py-2 text-center">Name</th>
                <th className="px-4 py-2 text-center">Author</th>
                {isAuthenticated && user?.role !== "User" && (
                  <th className="px-4 py-2 text-center">Quantity</th>
                )}
                <th className="px-4 py-2 text-center">Price</th>
                <th className="px-4 py-2 text-center">Availability</th>
                {isAuthenticated && user?.role !== "User" && (
                  <th className="px-4 py-2 text-center">Record Book</th>
                )}
              </tr>
            </thead>
            <tbody>
              {searchedBooks.map((book, idx) => (
                <tr
                  key={idx}
                  className={(idx + 1) % 2 === 0 ? "bg-gray-50" : ""}
                >
                  <td className="px-4 py-2 text-center">{idx + 1}</td>
                  <td className="px-4 py-2 text-center">{book.title}</td>
                  <td className="px-4 py-2 text-center">{book.author}</td>
                  {isAuthenticated && user?.role !== "User" && (
                    <td className="px-4 py-2 text-center">{book.quantity}</td>
                  )}
                  <td className="px-4 py-2 text-center">
                    &#8377; {book.price}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {book.availability ? "Available" : "Out of stock"}
                  </td>
                  {isAuthenticated && user?.role !== "User" && (
                    <td className="px-4 py-2 flex space-x-2 my-3 justify-center">
                      <BookA
                        className="cursor-pointer"
                        onClick={() => openReadPopup(book._id)}
                      />
                      <NotebookPen
                        className="cursor-pointer"
                        onClick={() => openBorrowBookPopup(book._id)}
                      />
                    </td>
                  )}
                </tr>
              ))}
              {searchedBooks.length === 0 && (
                <tr>
                  <td
                    colSpan={isAuthenticated && user?.role === "User" ? 5 : 7}
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

      {addBookPopup && <AddBookPopup />}

      {readBookPopup && <ReadBookPopup book={readBook} />}
      {recordBookPopup && <RecordBookPopup bookId={borrowBookId} />}
    </>
  );
};

export default BookManagement;
