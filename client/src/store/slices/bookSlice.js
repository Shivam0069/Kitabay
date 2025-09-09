import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleAddBookPopup } from "./popUpSlice";

const bookSlice = createSlice({
  name: "book",
  initialState: {
    books: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    fetchBooksRequest(state) {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    fetchBooksSuccess(state, action) {
      state.loading = false;
      state.books = action.payload;
    },
    fetchBooksFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    addBookRequest(state) {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    addBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    addBookFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    deleteBookRequest(state) {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    deleteBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.books = state.books.filter(
        (book) => book._id !== action.payload.bookId
      );
    },
    deleteBookFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    resetBookSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

const {
  fetchBooksFailure,
  fetchBooksRequest,
  fetchBooksSuccess,
  addBookFailure,
  addBookSuccess,
  addBookRequest,
  deleteBookFailure,
  deleteBookRequest,
  deleteBookSuccess,
  resetBookSlice,
} = bookSlice.actions;

export const fetchAllBooks = () => async (dispatch) => {
  dispatch(fetchBooksRequest());
  try {
    const { data: response } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/v1/book/all`,
      {
        withCredentials: true,
      }
    );
    dispatch(fetchBooksSuccess(response.books));
  } catch (error) {
    dispatch(
      fetchBooksFailure(
        error?.response?.data?.message || "Can not get Books. Try Again!!"
      )
    );
  }
};

export const addNewBook = (data) => async (dispatch) => {
  dispatch(addBookRequest());
  try {
    const { data: res } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/book/add`,
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch(addBookSuccess(res));
    dispatch(toggleAddBookPopup());
  } catch (error) {
    dispatch(
      addBookFailure(
        error?.response?.data?.message || "Failed to add Book. Try Again!!"
      )
    );
  }
};

export const deleteBook = (data) => async (dispatch) => {
  dispatch(deleteBookRequest());
  try {
    const { data: response } = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/v1/book/delete/${data}`,
      {
        withCredentials: true,
      }
    );
    dispatch(deleteBookSuccess(response));
  } catch (error) {
    dispatch(
      deleteBookFailure(
        error?.response?.data?.message || "Failed to delete book."
      )
    );
  }
};

export const resetBookSliceData = () => (dispatch) => {
  dispatch(resetBookSlice());
};

export default bookSlice.reducer;
