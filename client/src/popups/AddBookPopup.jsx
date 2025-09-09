import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleAddBookPopup } from "../store/slices/popUpSlice";
import { addNewBook, fetchAllBooks } from "../store/slices/bookSlice";

const AddBookPopup = () => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const modalRef = useRef();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        dispatch(toggleAddBookPopup());
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  const handleAddBook = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("description", description);

    dispatch(addNewBook(formData));
    dispatch(fetchAllBooks());
  };
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
        <div
          ref={modalRef}
          className="w-full bg-white rounded-lg shadow-lg md:w-1/3"
        >
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Add New Book</h3>
            <form onSubmit={handleAddBook}>
              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  Book Title
                </label>
                <input
                  type="text"
                  value={title}
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Book Title"
                  className="w-full px-4 py-2 border-black rounded-md border-2 "
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  Book Author
                </label>
                <input
                  type="text"
                  value={author}
                  required
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Book's Author"
                  className="w-full px-4 py-2 border-black rounded-md border-2 "
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  required
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Book's Description"
                  className="w-full px-4 py-2 border-black rounded-md border-2 "
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  Book Price (Price for borrowing)
                </label>
                <input
                  type="number"
                  value={price}
                  required
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Book's borrowing Price"
                  className="w-full px-4 py-2 border-black rounded-md border-2 "
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  required
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Book's Quantity"
                  className="w-full px-4 py-2 border-black rounded-md border-2 "
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  type="button"
                  onClick={() => dispatch(toggleAddBookPopup())}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white  rounded-md hover:bg-gray-800"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBookPopup;
