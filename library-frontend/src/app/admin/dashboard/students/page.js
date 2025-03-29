"use client";
import { useState } from "react";

const page = () => {
  const [students, setStudents] = useState([
    {
      id: "B12345",
      name: "Nifemi Onalaja",
      email: "nifemio@gmail.com",
      status: "Suspended",
      lastActive: "26th March 2025",
      image: "/assets/bookimg.png",
    },
    {
      id: "B12346",
      name: "Dee Caulcrick",
      email: "deecaul@gmail.com",
      status: "Active",
      lastActive: "29th March 2025",
      image: "/assets/bookimg.png",
    },
  ]);

  return (
    <section>
      <div>
        <h1 className="h1 gradient-text">Student Database.</h1>
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
                Student ID
              </th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">
                Name
              </th>

              <th className="py-3 px-4 text-left text-gray-500 font-medium">
                Status
              </th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">
                Last Active
              </th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border border-gray-200 hover:bg-gray-100/30 transiton duration-300 ease-in-out"
              >
                <td className="py-4 px-4">{student.id}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <img
                      src={student.image}
                      className="h-8 w-8 rounded-full mr-3"
                    />

                    {student.name}
                  </div>
                </td>

                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      student.status === "Active"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-black"
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="py-4 px-4">{student.lastActive}</td>
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

export default page;
