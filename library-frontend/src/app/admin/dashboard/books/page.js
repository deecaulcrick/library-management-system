"use client";
import { useState } from "react";
import { PlusIcon, X } from "lucide-react";

const loans = () => {
  const [books, setBooks] = useState([
    {
      id: "B12345",
      title: "Principles of Web Design",
      author: "Sarah Johnson",
      category: "Borrowed",
      availableCopies: 5,
      status: "Available",
      image: "/assets/bookimg.png",
    },
    {
      id: "B12346",
      title: "Concurrent Programming",
      author: "Sarah Johnson",
      category: "Overdue",
      status: "Borrowed",
      availableCopies: 5,
      image: "/assets/bookimg.png",
    },
    {
      id: "B12347",
      title: "Principles of Web Design",
      author: "Sarah Johnson",
      category: "Returned",
      status: "Reserved",
      availableCopies: 5,
      image: "/assets/bookimg.png",
    },
    {
      id: "B12348",
      title: "Principles of Web Design",
      author: "Sarah Johnson",
      category: "Borrowed",
      status: "Available",
      availableCopies: 1,
      image: "/assets/bookimg.png",
    },
  ]);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    category: "",
    image: "",
    description: "",
    status: "",
    availableCopies: 1,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate a new ID
    const newId = `B${parseInt(books[books.length - 1].id.slice(1)) + 1}`;

    // Add new book to the array
    const bookToAdd = {
      ...newBook,
      id: newId,
      lastBorrowed: "N/A",
    };

    setBooks([...books, bookToAdd]);

    // Close modal and reset form
    setIsModalOpen(false);
    setNewBook({
      title: "",
      author: "",
      category: "",
      image: "",
      status: "",
      description: "",
      availableCopies: 1,
    });
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="h1 gradient-text">All Books.</h1>
          <p className="mt-2">Search and manage books</p>
        </div>
        <button
          className="flex items-center bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Book
        </button>
      </div>
      <div className="flex mb-6 gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
            placeholder="Search by name or ID..."
          />
        </div>
        <div className="w-64">
          <select className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-white">
            <option value="">Select a category</option>
            <option value="Fiction">Artificial Intelligence</option>
            <option value="Non-fiction">Date Science</option>
            <option value="Fantasy">Cybersecurity</option>
            <option value="Science Fiction">Programming languageL</option>
            <option value="Mystery">Web & Mobile Development</option>
            <option value="Romance">Netwroking</option>
            <option value="Biography">Hardware</option>
            <option value="History">Theoretical Computer Science</option>
            <option value="Self-help">Project Management</option>
          </select>
        </div>
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
                Category
              </th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">
                Status
              </th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">
                Copies
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
                  <span className="px-3 py-1 text-sm rounded-full bg-black text-white">
                    {book.category}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      book.status === "Available"
                        ? "purple text-white"
                        : book.status === "Borrowed"
                        ? "orange text-white"
                        : book.status === "Reserved"
                        ? "yellow text-white"
                        : ""
                    }`}
                  >
                    {book.status}
                  </span>
                </td>
                <td className="py-4 px-4">{book.availableCopies}</td>
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

      {/* Add New Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold tracking-tighter">
                Add New Book
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newBook.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="author"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={newBook.author}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  rows="4"
                  value={newBook.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                  placeholder="About the book. . ."
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={newBook.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Fiction">Artificial Intelligence</option>
                  <option value="Non-fiction">Date Science</option>
                  <option value="Fantasy">Cybersecurity</option>
                  <option value="Science Fiction">Programming languageL</option>
                  <option value="Mystery">Web & Mobile Development</option>
                  <option value="Romance">Netwroking</option>
                  <option value="Biography">Hardware</option>
                  <option value="History">Theoretical Computer Science</option>
                  <option value="Self-help">Project Management</option>
                </select>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={newBook.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                  required
                >
                  <option value="Available">Available</option>
                  <option value="Borrowed">Borrowed</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Out of circulation">Out of circulation</option>
                </select>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="copies"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Available Copies
                </label>
                <input
                  type="number"
                  id="copies"
                  name="copies"
                  value={newBook.availableCopies}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default loans;
