import React from "react";
import { useSelector } from "react-redux";
import Header from "../layout/Header";

const Users = () => {
  const { users } = useSelector((state) => state.user);
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
  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center ">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            Registered Users
          </h2>
        </header>

        <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-center">ID</th>
                <th className="px-4 py-2 text-center">Name</th>
                <th className="px-4 py-2 text-center">Email</th>
                <th className="px-4 py-2 text-center">Role</th>
                <th className="px-4 py-2 text-center">No. of Books Borrowed</th>
                <th className="px-4 py-2 text-center">Registered On</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((u) => u.role === "User")
                .map((i, idx) => {
                  return (
                    <tr
                      key={idx}
                      className={(idx + 1) % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="px-4 py-2 text-center">{idx + 1}</td>
                      <td className="px-4 py-2 text-center">{i.name}</td>
                      <td className="px-4 py-2 text-center">{i.email}</td>
                      <td className="px-4 py-2 text-center">{i.role}</td>
                      <td className="px-4 py-2 text-center">
                        {i.borrowedBooks.length}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {formatDate(i.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              {users?.filter((u) => u.role === "User").length === 0 && (
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
    </>
  );
};

export default Users;
