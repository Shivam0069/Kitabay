import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import OTP from "./pages/OTP";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/slices/authSlice";
import { fetchAllUsers } from "./store/slices/userSlice";
import { fetchAllBooks } from "./store/slices/bookSlice";
import {
  fetchAllBorrowedBooks,
  fetchUserBorrowedBooks,
} from "./store/slices/borrowSlice";
import { AnimatePresence, motion } from "framer-motion";
import PageWrapper from "./components/PageWrapper";
import Loader from "./components/Loader";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Home />{" "}
            </PageWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <PageWrapper>
              <Register />
            </PageWrapper>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PageWrapper>
              <ForgotPassword />
            </PageWrapper>
          }
        />
        <Route
          path="/otp-verification/:email"
          element={
            <PageWrapper>
              <OTP />
            </PageWrapper>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PageWrapper>
              <ResetPassword />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};
const App = () => {
  const { loading, user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUser());
  }, []);
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAllBooks());
      if (user?.role !== "User") {
        dispatch(fetchAllUsers());
        dispatch(fetchAllBorrowedBooks());
      } else {
        dispatch(fetchUserBorrowedBooks());
      }
    }
  }, [isAuthenticated]);
  return (
    <Router>
      {loading && <Loader />}
      <AnimatedRoutes />
      <ToastContainer theme="dark" />
    </Router>
  );
};

export default App;
