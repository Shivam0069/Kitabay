import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleRecordBookPopup, toggleReturnBookPopup } from "./popUpSlice";

const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    loading: false,
    error: null,
    message: null,
    userBorrowedBooks: [],
    allBorrowedBooks: [],
  },
  reducers: {
    fetchUserBorrowedBooksRequest(state) {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    fetchUserBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.userBorrowedBooks = action.payload;
    },
    fetchUserBorrowedBooksFailure(state, action) {
      state.loading = false;
      state.error = action.payload.error;
      state.message = null;
    },
    borrowBookRequest(state) {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    borrowBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    borrowBookFailure(state, action) {
      state.loading = false;
      state.message = null;
      state.error = action.payload;
    },
    fetchAllBorrowedBooksRequest(state) {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    fetchAllBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.allBorrowedBooks = action.payload;
    },
    fetchAllBorrowedBooksFailure(state, action) {
      state.loading = false;
      state.error = action.payload.error;
      state.message = null;
    },
    returnBookRequest(state) {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    returnBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    returnBookFailure(state, action) {
      state.loading = false;
      state.message = null;
      state.error = action.payload;
    },
    resetBorrowSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

const {
  fetchAllBorrowedBooksFailure,
  fetchAllBorrowedBooksRequest,
  fetchAllBorrowedBooksSuccess,
  borrowBookFailure,
  borrowBookRequest,
  borrowBookSuccess,
  returnBookFailure,
  returnBookRequest,
  returnBookSuccess,
  fetchUserBorrowedBooksFailure,
  fetchUserBorrowedBooksRequest,
  fetchUserBorrowedBooksSuccess,
  resetBorrowSlice,
} = borrowSlice.actions;

export const fetchUserBorrowedBooks = () => async (dispatch) => {
  dispatch(fetchUserBorrowedBooksRequest());
  try {
    const { data: res } = await axios.get(
      "http://localhost:4000/api/v1/borrow/my-borrowed-books",
      {
        withCredentials: true,
      }
    );
    dispatch(fetchUserBorrowedBooksSuccess(res.borrowedBooks));
  } catch (error) {
    dispatch(
      fetchUserBorrowedBooksFailure(
        error?.response?.data?.message || "Failed fetching data!"
      )
    );
  }
};
export const fetchAllBorrowedBooks = () => async (dispatch) => {
  dispatch(fetchAllBorrowedBooksRequest());
  try {
    const { data: res } = await axios.get(
      "http://localhost:4000/api/v1/borrow/",
      {
        withCredentials: true,
      }
    );
    dispatch(fetchAllBorrowedBooksSuccess(res.borrowedBooks));
  } catch (error) {
    dispatch(
      fetchAllBorrowedBooksFailure(
        error?.response?.data?.message || "Failed fetching data!"
      )
    );
  }
};
export const borrowBook = (id, email) => async (dispatch) => {
  dispatch(borrowBookRequest());
  try {
    const { data: res } = await axios.post(
      `http://localhost:4000/api/v1/borrow/${id}`,
      { email },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch(borrowBookSuccess(res.message));
    dispatch(toggleRecordBookPopup());
  } catch (error) {
    dispatch(
      borrowBookFailure(
        error?.response?.data?.message || "Failed fetching data!"
      )
    );
  }
};
export const returnBook = (id, email) => async (dispatch) => {
  dispatch(returnBookRequest());
  try {
    const { data: res } = await axios.put(
      `http://localhost:4000/api/v1/borrow/return/${id}`,
      { email },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch(returnBookSuccess(res.message));
    dispatch(toggleReturnBookPopup());
  } catch (error) {
    dispatch(
      returnBookFailure(
        error?.response?.data?.message || "Failed fetching data!"
      )
    );
  }
};
export const resetBorrowSliceData = () => (dispatch) => {
  dispatch(resetBorrowSlice());
};

export default borrowSlice.reducer;
