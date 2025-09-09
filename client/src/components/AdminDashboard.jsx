import React, { useEffect, useState } from "react";
import adminIcon from "../assets/pointing.png";
import usersIcon from "../assets/people-black.png";
import userIcon from "../assets/user.png";
import bookIcon from "../assets/book-square.png";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import logo from "../assets/black-logo.png";
import Header from "../layout/Header";
import { useSelector } from "react-redux";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.user);
  const { books } = useSelector((state) => state.book);
  const { allBorrowedBooks } = useSelector((state) => state.borrow);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [totalBooks, setTotalBooks] = useState(books?.length || 0);
  const [totalBorrowed, setTotalBorrowed] = useState(0);
  const [totalReturned, setTotalReturned] = useState(0);
  useEffect(() => {
    let numberOfUsers = users.filter((u) => u.role === "User").length;
    let numberOfAdmin = users.filter((u) => u.role === "Admin").length;
    setTotalUsers(numberOfUsers);
    setTotalAdmin(numberOfAdmin);
    let numberOfBorrowedBooks = allBorrowedBooks.filter(
      (book) => book?.returnDate === null
    ).length;
    let numberOfReturnedBooks = allBorrowedBooks.filter(
      (book) => book?.returnDate !== null
    ).length;
    setTotalBorrowed(numberOfBorrowedBooks);
    setTotalReturned(numberOfReturnedBooks);
    setTotalBooks(books.length);
  }, [users, allBorrowedBooks, books]);

  const data = {
    labels: ["Total Borrowed Books", "Total Returned Books"],
    datasets: [
      {
        data: [totalBorrowed, totalReturned],
        backgroundColor: ["#3D3E3E", "#151619"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <div className="flex flex-col-reverse xl:flex-row ">
          {/* LEFT SIDE  */}
          <div className="flex-[2] flex-col gap-7 lg:flex-row flex lg:items-center xl:flex-col justify-between xl:gap-20 py-5 ">
            <div className="xl:flex-[4]  flex items-end w-full content-center">
              <Pie
                data={data}
                options={{ cutout: 0 }}
                className="mx-auto lg:mx-0 w-full h-auto"
              />
            </div>
            <div className="flex items-center p-8 w-full sm:w-[400px] xl:w-fit mr-5 xl:p-3 2xl:p-6 gap-5 h-fit xl:min-h-[150px] bg-white lg:flex-1 rounded-lg">
              <img
                src={logo}
                alt="logo"
                className="w-auto xl:flex-1 rounded-lg"
              />
              <span className="w-[2px] bg-black h-full"></span>
              <div className="flex  flex-col gap-5">
                <p className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#3D3E3E]"></span>
                  <span>Total Borrowed Books</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#151619]"></span>
                  <span>Total Returned Books</span>
                </p>
              </div>
            </div>
          </div>
          {/* RIGHT SIDE  */}
          <div className="flex flex-[4] flex-col gap-7 lg:gap-7 lg:py-5 justify-between xl:min-h-[85.5vh]">
            <div className="flex flex-col-reverse lg:flex-row gap-7 flex-[4]">
              <div className="flex flex-col gap-7 flex-1">
                <div className="flex items-center gap-3 bg-white p-5 max-h-[120px] overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300 w-full lg:max-w-[360px]">
                  <span className="bg-gray-300 h-20 min-w-20 flex items-center justify-center rounded-lg">
                    <img
                      src={usersIcon}
                      alt="users-icon"
                      className="h-8 w-8 "
                    />
                  </span>
                  <span className="w-[2px] bg-black lg:h-full h-20"></span>
                  <div className="flex flex-col items-center gap-2">
                    <h4 className="font-black  text-3xl">{totalUsers}</h4>
                    <p className="font-light text-gray-700 text-sm">
                      Total User Base
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white p-5 max-h-[120px] overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300 w-full lg:max-w-[360px]">
                  <span className="bg-gray-300 h-20 min-w-20 flex items-center justify-center rounded-lg">
                    <img
                      src={adminIcon}
                      alt="admin-icon"
                      className="h-8 w-8 "
                    />
                  </span>
                  <span className="w-[2px] bg-black lg:h-full h-20"></span>
                  <div className="flex flex-col items-center gap-2">
                    <h4 className="font-black  text-3xl">{totalAdmin}</h4>
                    <p className="font-light text-gray-700 text-sm">
                      Total Admin Count
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white p-5 max-h-[120px] overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300 w-full lg:max-w-[360px]">
                  <span className="bg-gray-300 h-20 min-w-20 flex items-center justify-center rounded-lg">
                    <img src={bookIcon} alt="book-icon" className="h-8 w-8 " />
                  </span>
                  <span className="w-[2px] bg-black lg:h-full h-20"></span>
                  <div className="flex flex-col items-center gap-2">
                    <h4 className="font-black  text-3xl">{totalBooks}</h4>
                    <p className="font-light text-gray-700 text-sm">
                      Total Books Count
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row flex-1">
                <div className="flex flex-col lg:flex-row items-center justify-center flex-1">
                  <div className="bg-white p-5 rounded-lg shadow-lg h-full flex flex-col  justify-center items-center gap-4">
                    <img
                      src={user?.avatar?.url || userIcon}
                      alt="avatar"
                      className="rounded-full w-32 h-32 object-cover"
                    />
                    <h2 className="text-xl 2xl:text-2xl font-semibold text-center">
                      {user?.name}
                    </h2>
                    <p className="text-gray-600 text-sm 2xl:text-base text-center">
                      Welcome to your admin dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden xl:flex  bg-white  p-7 text-lg sm:text-xl xl:text-3xl 2xl:text-4xl min-h-52 font-semibold relative flex-[3 justify-center items-center rounded-2xl] ">
              <h4 className="overflow-y-hidden ">
                "Books are bridges to knowledge, imagination, and growth; every
                page you read takes you closer to wisdom and endless
                possibilities."
              </h4>
              <p className="text-gray-700 text-sm sm:text-lg absolute  right-[35px] sm:right[78px] bottom-[10px]">
                ~ BookWorm Team
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
