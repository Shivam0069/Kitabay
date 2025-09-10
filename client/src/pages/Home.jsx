import React, { lazy, Suspense, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import SideBar from "../layout/SideBar";
const AdminDashboard = lazy(() => import("../components/AdminDashboard"));
const UserDashboard = lazy(() => import("../components/UserDashboard"));
const BookManagement = lazy(() => import("../components/BookManagement"));
const Catalog = lazy(() => import("../components/Catalog"));
const MyBorrowedBooks = lazy(() => import("../components/MyBorrowedBooks"));
const Users = lazy(() => import("../components/Users"));
import { AnimatePresence, motion } from "framer-motion";
import Loader from "../components/Loader";

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("Dashboard");

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="relative md:pl-64 flex min-h-screen bg-gray-100">
      {/* Mobile Hamburger */}
      <div className="md:hidden z-10 absolute right-6 top-4 sm:top-6 flex justify-center items-center bg-black rounded-md h-9 w-9 text-white">
        <GiHamburgerMenu
          className="text-2xl"
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
        />
      </div>

      {/* Sidebar */}
      <SideBar
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
        setSelectedComponent={setSelectedComponent}
      />

      {/* Main Content */}
      <div className="flex-1  ">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center animate-pulse font-bold text-xl">
              <Loader />
              Loading...
            </div>
          }
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedComponent} // important for re-animation on change
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {(() => {
                switch (selectedComponent) {
                  case "Dashboard":
                    return user?.role === "User" ? (
                      <UserDashboard
                        setSelectedComponent={setSelectedComponent}
                      />
                    ) : (
                      <AdminDashboard />
                    );

                  case "Books":
                    return <BookManagement />;

                  case "Catalog":
                    if (user?.role === "Admin" || user?.role === "Owner")
                      return <Catalog />;
                    return null;

                  case "Users":
                    if (user?.role === "Admin" || user?.role === "Owner")
                      return <Users />;
                    return null;

                  case "My Borrowed Books":
                    return <MyBorrowedBooks />;

                  default:
                    return user?.role === "User" ? (
                      <UserDashboard />
                    ) : (
                      <AdminDashboard />
                    );
                }
              })()}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
