import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleSettingPopup } from "./popUpSlice";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    message: null,
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    registerRequest: (state) => {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      //   state.user = action.payload.user;
      state.message = action.payload.message;
      //   state.isAuthenticated = true;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      //   state.isAuthenticated = false;
    },
    otpVerificationRequest: (state) => {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    otpVerificationSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.message = action.payload.message;
      state.isAuthenticated = true;
    },
    otpVerificationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    loginRequest: (state) => {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.message = action.payload.message;
      state.isAuthenticated = true;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logoutRequest: (state) => {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    logoutSuccess: (state, action) => {
      state.loading = false;
      state.user = null;
      state.message = action.payload;
      state.isAuthenticated = false;
    },
    logoutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
      //   state.isAuthenticated = false;
    },
    getUserRequest: (state) => {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    getUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    getUserFailure: (state, action) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    forgotPasswordRequest: (state) => {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    forgotPasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    forgotPasswordFailure: (state, action) => {
      state.loading = false;

      state.error = action.payload;
    },
    resetPasswordRequest: (state) => {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    resetPasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    resetPasswordFailure: (state, action) => {
      state.loading = false;

      state.error = action.payload;
    },
    updatePasswordRequest: (state) => {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    updatePasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    updatePasswordFailure: (state, action) => {
      state.loading = false;

      state.error = action.payload;
    },
    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.user = state.user;
      state.isAuthenticated = state.isAuthenticated;
    },
  },
});

const {
  registerRequest,
  registerSuccess,
  registerFailure,
  otpVerificationRequest,
  otpVerificationSuccess,
  otpVerificationFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  getUserRequest,
  getUserSuccess,
  getUserFailure,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
  updatePasswordRequest,
  updatePasswordSuccess,
  updatePasswordFailure,
  reset,
} = authSlice.actions;

export const resetAuthSlice = () => (dispatch) => {
  dispatch(reset());
};

export const register = (data) => async (dispatch) => {
  try {
    dispatch(registerRequest());

    const { data: response } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/auth/register`,
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(registerSuccess(response));
  } catch (error) {
    dispatch(
      registerFailure(
        error.response?.data?.message || "Registration failed. Try again."
      )
    );
  }
};
export const otpVerification = (email, otp) => async (dispatch) => {
  try {
    dispatch(otpVerificationRequest());

    const { data: response } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/auth/verify-otp`,
      { email, otp },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(otpVerificationSuccess(response));
  } catch (error) {
    dispatch(
      otpVerificationFailure(
        error.response?.data?.message || "Otp Verification failed. Try again."
      )
    );
  }
};
export const login = (data) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const { data: response } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(loginSuccess(response));
  } catch (error) {
    dispatch(
      loginFailure(error.response?.data?.message || "Login failed. Try again.")
    );
  }
};
export const logout = () => async (dispatch) => {
  try {
    console.log("logout action called");
    dispatch(logoutRequest());
    console.log("logout request dispatched");

    const { data: response } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/v1/auth/logout`,

      {
        withCredentials: true,
      }
    );
    console.log("logout response received", response);

    dispatch(logoutSuccess(response.message));
    dispatch(reset());
  } catch (error) {
    console.error("Logout error:", error);
    dispatch(
      logoutFailure(
        error.response?.data?.message || "Logout failed. Try again."
      )
    );
  }
};
export const getUser = () => async (dispatch) => {
  try {
    dispatch(getUserRequest());

    const { data: response } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/v1/auth/profile`,

      {
        withCredentials: true,
      }
    );

    dispatch(getUserSuccess(response));
  } catch (error) {
    dispatch(
      getUserFailure(
        error.response?.data?.message || "Fetching user failed. Try again."
      )
    );
  }
};
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch(forgotPasswordRequest());

    const { data: response } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/auth/password/forgot`,
      { email },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(forgotPasswordSuccess(response.message));
  } catch (error) {
    dispatch(
      forgotPasswordFailure(
        error.response?.data?.message ||
          "Forgot password request failed. Try again."
      )
    );
  }
};
export const resetPassword = (data, token) => async (dispatch) => {
  try {
    dispatch(resetPasswordRequest());

    const { data: response } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/auth/password/reset/${token}`,
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(resetPasswordSuccess(response));
  } catch (error) {
    dispatch(
      resetPasswordFailure(
        error.response?.data?.message ||
          "Reset password request failed. Try again."
      )
    );
  }
};
export const updatePassword = (data) => async (dispatch) => {
  try {
    dispatch(updatePasswordRequest());

    const { data: response } = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/v1/auth/password/update`,
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(updatePasswordSuccess(response.message));
    dispatch(toggleSettingPopup());
  } catch (error) {
    dispatch(
      updatePasswordFailure(
        error.response?.data?.message ||
          "Update password request failed. Try again."
      )
    );
  }
};

export default authSlice.reducer;
