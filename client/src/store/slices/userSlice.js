import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { toggleAddNewAdminPopup } from "./popUpSlice";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    loading: false,
  },
  reducers: {
    fetchAllUsersStart: (state) => {
      state.loading = true;
    },
    fetchAllUsersSuccess: (state, action) => {
      state.users = action.payload;
      state.loading = false;
    },
    fetchAllUsersFailure: (state) => {
      state.loading = false;
    },
    addNewAdminStart: (state) => {
      state.loading = true;
    },
    addNewAdminSuccess: (state) => {
      //   state.users.push(action.payload);
      state.loading = false;
    },
    addNewAdminFailure: (state) => {
      state.loading = false;
    },
  },
});

const {
  fetchAllUsersStart,
  fetchAllUsersSuccess,
  fetchAllUsersFailure,
  addNewAdminStart,
  addNewAdminSuccess,
  addNewAdminFailure,
} = userSlice.actions;

export const fetchAllUsers = () => async (dispatch) => {
  dispatch(fetchAllUsersStart());
  try {
    const response = await axios.get("http://localhost:4000/api/v1/user/all", {
      withCredentials: true,
    });
    dispatch(fetchAllUsersSuccess(response.data.users));
  } catch (error) {
    dispatch(fetchAllUsersFailure());
    toast.error(error?.response?.data?.message || "Failed to fetch users");
    console.error("Error fetching users:", error);
  }
};

export const addNewAdmin = (data) => async (dispatch) => {
  dispatch(addNewAdminStart());
  try {
    const { data: response } = await axios.post(
      "http://localhost:4000/api/v1/user/add/new-admin",
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    dispatch(addNewAdminSuccess());
    dispatch(toggleAddNewAdminPopup());
    toast.success(data?.message || "Successfully added new Admin.");
  } catch (error) {
    dispatch(addNewAdminFailure());
    toast.error(error?.response?.data?.message || "Failed to add new Admin");
    console.error("Error while adding new Admin:", error);
  }
};

export default userSlice.reducer;
