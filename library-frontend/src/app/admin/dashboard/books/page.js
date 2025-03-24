"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, X, Pencil } from "lucide-react";
import BookDetailsModal from "@/components/BookDetailsModal";
import allBooks from "@/data/books";

const loans = () => {
  const [books, setBooks] = useState(allBooks);

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

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    author: "",
    publishDate: "",
    genre: "",
    status: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate a new ID
    const newId = `B${parseInt(allBooks[allBooks.length - 1].id.slice(1)) + 1}`;

    // Add new book to the array
    const bookToAdd = {
      ...newBook,
      id: newId,
      lastBorrowed: "N/A",
    };

    setBooks([...allBooks, bookToAdd]);

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

  const openEditModal = (book) => {
    setEditingBook(book);
    setEditFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      image: book.image,
      status: book.status,
      description: book.description,
      availableCopies: book.availableCopies,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    // Update the book in the array
    const updatedBooks = allBooks.map((book) => {
      if (book.id === editingBook.id) {
        return {
          ...book,
          title: editFormData.title,
          author: editFormData.author,
          category: editFormData.category,
          image: editFormData.image,
          status: editFormData.status,
          description: editFormData.description,
          availableCopies: editFormData.availableCopies,
        };
      }
      return book;
    });

    setBooks(updatedBooks);

    // Close modal and reset form
    setIsEditModalOpen(false);
    setEditingBook(null);
  };

  const [selectedBook, setSelectedBook] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleViewBook = (book) => {
    setSelectedBook(book);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    // Optionally delay clearing the book data
    setTimeout(() => setSelectedBook(null), 300); // After animation completes
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
            <option value="">All Books</option>
            <option value="">Available</option>
            <option value="">Borrowed</option>
            <option value="">Resrved </option>
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
            {allBooks.map((book) => (
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
                  <div className="flex space-x-3">
                    <button
                      className="text-gray-900 font-medium hover:text-gray-600"
                      onClick={() => handleViewBook(book)}
                    >
                      View
                    </button>
                    <button
                      className="text-orange font-medium hover:text-blue-800 flex items-center"
                      onClick={() => openEditModal(book)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                  </div>
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
                  <option value="FiArtificial Intelligencction">
                    Artificial Intelligence
                  </option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Programming Language">
                    Programming Language
                  </option>
                  <option value="Web & Mobile Development">
                    Web & Mobile Development
                  </option>
                  <option value="Networking">Networking</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Theoretical Computer Science">
                    Theoretical Computer Science
                  </option>
                  <option value="Project Management">Project Management</option>
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

      {/* Edit Book Modal */}
      {isEditModalOpen && editingBook && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold tracking-tighter">Edit Book</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
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
                  value={editFormData.title}
                  onChange={handleEditInputChange}
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
                  value={editFormData.author}
                  onChange={handleEditInputChange}
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
                  value={editFormData.description}
                  onChange={handleEditInputChange}
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
                  value={editFormData.category}
                  onChange={handleEditInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Artificial Intelligence">
                    Artificial Intelligence
                  </option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Programming Language">
                    Programming Language
                  </option>
                  <option value="Web & Mobile Development">
                    Web & Mobile Development
                  </option>
                  <option value="Networking">Networking</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Theoretical Computer Science">
                    Theoretical Computer Science
                  </option>
                  <option value="Project Management">Project Management</option>
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
                  value={editFormData.status}
                  onChange={handleEditInputChange}
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
                  value={editFormData.availableCopies}
                  onChange={handleEditInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  Update Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* View book */}
      {isViewModalOpen && (
        <BookDetailsModal
          isOpen={isViewModalOpen}
          onClose={closeModal}
          book={selectedBook}
        />
      )}
    </section>
  );
};

export default loans;
