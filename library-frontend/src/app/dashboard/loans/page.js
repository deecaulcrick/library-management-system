"use client";
import { useState } from "react";

const loans = () => {
  const [books, setBooks] = useState([
    {
      id: "B12345",
      title: "Principles of Web Design",
      author: "Sarah Johnson",
      status: "Borrowed",
      dueDate: "October 10, 2023",
      image: "/assets/bookimg.png",
    },
    {
      id: "B12346",
      title: "Concurrent Programming",
      author: "Sarah Johnson",
      status: "Overdue",
      dueDate: "March 10, 2025",
      image: "/assets/bookimg.png",
    },
    {
      id: "B12345",
      title: "Principles of Web Design",
      author: "Sarah Johnson",
      status: "Returned",
      dueDate: "October 10, 2023",
      image: "/assets/bookimg.png",
    },
    {
      id: "B12345",
      title: "Principles of Web Design",
      author: "Sarah Johnson",
      status: "Borrowed",
      dueDate: "October 10, 2023",
      image: "/assets/bookimg.png",
    },
  ]);

  return (
    <section>
      <div>
        <h1 className="h1 gradient-text">My Loans</h1>
        <p className="mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.{" "}
        </p>
      </div>
      <div className="overflow-x-auto mt-10">
        <table className="min-w-full">
          <thead>
            <tr className="border border-gray-200">
              <th className="py-3 px-4 text-left text-gray-500 font-medium">
                Book ID
              </th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">
                Title
              </th>

              <th className="py-3 px-4 text-left text-gray-500 font-medium">
                Author
              </th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">
                Status
              </th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">
                Due Date
              </th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr
                key={book.id}
                className="border border-gray-200 hover:bg-gray-100/30 transiton duration-300 ease-in-out"
              >
                <td className="py-4 px-4">{book.id}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <img
                      src={book.image}
                      className="h-8 w-8 rounded-full mr-3"
                    />

                    {book.title}
                  </div>
                </td>

                <td className="py-4 px-4">{book.author}</td>
                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      book.status === "Borrowed"
                        ? "purple text-white"
                        : book.status === "Overdue"
                        ? "orange text-white"
                        : book.status === "Returned"
                        ? "yellow text-white"
                        : ""
                    }`}
                  >
                    {book.status}
                  </span>
                </td>
                <td className="py-4 px-4">{book.dueDate}</td>
                <td className="py-4 px-4">
                  <button className="text-gray-900 font-medium hover:text-gray-600">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default loans;

const bookLoans = [
  {
    id: 1,
    title: "Principles of Web Design",
    author: "Dee Caulcrick",
    status: "Borrowed",
    dueDate: "30th March 2025",
  },
];
