"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, X, Upload } from "lucide-react";
import BookDetailsModal from "@/components/BookDetailsModal";
import { CloudinaryUploadWidget } from "@/lib/cloudinary";
import { toast } from "sonner";
import {
  useGetAllBooks,
  useCreateBook,
  useUpdateBook,
  useDeleteBook,
} from "@/hooks/books";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormInput from "@/components/form/FormInput";
import FormTextarea from "@/components/form/FormTextarea";

// Table style constants
const tableHeaderClass = "py-3 px-4 text-left text-gray-500 font-medium";
const tableCellClass = "py-4 px-4";
const tableRowClass = "border-b border-gray-200";

// Get status badge classes based on status
const getStatusBadgeClass = (status) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs";
  if (status === "Available")
    return `${baseClasses} bg-green-100 text-green-800`;
  if (status === "Borrowed") return `${baseClasses} bg-blue-100 text-blue-800`;
  return `${baseClasses} bg-yellow-100 text-yellow-800`;
};

// Book validation schema
const bookSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  isbn: z.string().min(1, { message: "ISBN is required" }),
  category: z.string().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  status: z.string().default("Available"),
  publishedDate: z.string().optional(),
  publisher: z.string().optional(),
  totalCopies: z
    .number()
    .min(1, { message: "Must have at least 1 copy" })
    .default(1),
  availableCopies: z
    .number()
    .min(1, { message: "Must have at least 1 copy" })
    .default(1),
  shelfLocation: z.string().optional(),
});

const Books = () => {
  const router = useRouter();

  // Action button classes
  const viewButtonClass = "text-blue-500 hover:text-blue-700";
  const editButtonClass = "text-green-500 hover:text-green-700";
  const deleteButtonClass = "text-red-500 hover:text-red-700";

  // Hooks for API calls
  const { data: booksData, isLoading, isError, error } = useGetAllBooks();
  const { mutate: createBook } = useCreateBook();
  const { mutate: updateBook } = useUpdateBook();
  const { mutate: deleteBook } = useDeleteBook();

  // State for modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // React Hook Form for new book
  const {
    register: registerNew,
    handleSubmit: handleNewSubmit,
    setValue: setNewValue,
    reset: resetNewForm,
    formState: { errors: newErrors },
    control: newControl,
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      category: "",
      image: "",
      description: "",
      status: "Available",
      isbn: "",
      publishedDate: "",
      publisher: "",
      totalCopies: 1,
      availableCopies: 1,
      shelfLocation: "",
    },
  });

  // React Hook Form for edit book
  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    setValue: setEditValue,
    reset: resetEditForm,
    formState: { errors: editErrors },
    control: editControl,
  } = useForm({
    resolver: zodResolver(bookSchema),
  });

  const handleImageUpload = (url) => {
    setNewValue("image", url);
  };

  const handleEditImageUpload = (url) => {
    setEditValue("image", url);
  };

  const onSubmitNewBook = (data) => {
    try {
      createBook(data, {
        onSuccess: () => {
          // Close modal and reset form
          setIsModalOpen(false);
          resetNewForm();
        },
      });
    } catch (error) {
      console.error("Error creating book:", error);
      toast.error("Failed to create book");
    }
  };

  const openEditModal = (book) => {
    setEditingBook(book);

    // Reset form with book data
    resetEditForm({
      id: book.id,
      title: book.title,
      author: book.author,
      category: book.category || "",
      image: book.image || "",
      description: book.description || "",
      status: book.status || "Available",
      isbn: book.isbn || "",
      publishedDate: book.publishedDate
        ? new Date(book.publishedDate).toISOString().split("T")[0]
        : "",
      publisher: book.publisher || "",
      totalCopies: book.totalCopies || 1,
      availableCopies: book.availableCopies || 1,
      shelfLocation: book.shelfLocation || "",
    });

    setIsEditModalOpen(true);
  };

  const onSubmitEditBook = (data) => {
    try {
      updateBook(data, {
        onSuccess: () => {
          // Close modal and reset form
          setIsEditModalOpen(false);
          setEditingBook(null);
        },
      });
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error("Failed to update book");
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        deleteBook(bookId);
      } catch (error) {
        console.error("Error deleting book:", error);
        toast.error("Failed to delete book");
      }
    }
  };

  const handleViewBook = (book) => {
    setSelectedBook(book);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
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
            <option value="Available">Available</option>
            <option value="Borrowed">Borrowed</option>
            <option value="Reserved">Reserved</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto mt-10">
        {isLoading ? (
          <p>Loading books...</p>
        ) : isError ? (
          <p>Error loading books: {error?.message || "Unknown error"}</p>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="border border-gray-200">
                <th className={tableHeaderClass}>Book ID</th>
                <th className={tableHeaderClass}>Title</th>
                <th className={tableHeaderClass}>Author</th>
                <th className={tableHeaderClass}>Category</th>
                <th className={tableHeaderClass}>Status</th>
                <th className={tableHeaderClass}>Copies</th>
                <th className={tableHeaderClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {booksData?.books?.map((book) => (
                <tr key={book.id} className={tableRowClass}>
                  <td className={tableCellClass}>{book.id}</td>
                  <td className={tableCellClass}>
                    <div className="flex items-center">
                      <div
                        className="w-10 h-10 rounded-md mr-3 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${
                            book.image || "/assets/bookimg.png"
                          })`,
                        }}
                      ></div>
                      <span>{book.title}</span>
                    </div>
                  </td>
                  <td className={tableCellClass}>{book.author}</td>
                  <td className={tableCellClass}>{book.category}</td>
                  <td className={tableCellClass}>
                    <span className={getStatusBadgeClass(book.status)}>
                      {book.status}
                    </span>
                  </td>
                  <td className={tableCellClass}>{book.availableCopies}</td>
                  <td className={tableCellClass}>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewBook(book)}
                        className={viewButtonClass}
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(book)}
                        className={editButtonClass}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className={deleteButtonClass}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* New Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Book</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleNewSubmit(onSubmitNewBook)}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormInput
                  id="title"
                  name="title"
                  label="Title*"
                  register={registerNew}
                  errors={newErrors}
                  validation={{ required: "Title is required" }}
                />

                <FormInput
                  id="author"
                  name="author"
                  label="Author*"
                  register={registerNew}
                  errors={newErrors}
                  validation={{ required: "Author is required" }}
                />

                <FormInput
                  id="isbn"
                  name="isbn"
                  label="ISBN*"
                  register={registerNew}
                  errors={newErrors}
                  validation={{ required: "ISBN is required" }}
                />

                <FormInput
                  id="category"
                  name="category"
                  label="Category"
                  register={registerNew}
                  errors={newErrors}
                />

                <FormInput
                  id="publisher"
                  name="publisher"
                  label="Publisher"
                  register={registerNew}
                  errors={newErrors}
                />

                <FormInput
                  id="publishedDate"
                  name="publishedDate"
                  label="Published Date"
                  type="date"
                  register={registerNew}
                  errors={newErrors}
                />

                <FormInput
                  id="totalCopies"
                  name="totalCopies"
                  label="Total Copies"
                  type="number"
                  register={registerNew}
                  errors={newErrors}
                  validation={{
                    min: { value: 1, message: "Must have at least 1 copy" },
                  }}
                />

                <FormInput
                  id="shelfLocation"
                  name="shelfLocation"
                  label="Shelf Location"
                  register={registerNew}
                  errors={newErrors}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Book Cover Image
                </label>
                <div className="flex items-center space-x-4">
                  <input type="hidden" {...registerNew("image")} />
                  {/* Display image preview if available */}
                  <div
                    className={`w-24 h-32 bg-cover bg-center border border-gray-300 rounded-md ${
                      !registerNew("image").value && "hidden"
                    }`}
                    style={{
                      backgroundImage: `url(${registerNew("image").value})`,
                    }}
                  ></div>
                  <CloudinaryUploadWidget onUpload={handleImageUpload}>
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={open}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {registerNew("image").value
                          ? "Change Image"
                          : "Upload Image"}
                      </button>
                    )}
                  </CloudinaryUploadWidget>
                </div>
              </div>

              <FormTextarea
                id="description"
                name="description"
                label="Description"
                rows={3}
                register={registerNew}
                errors={newErrors}
                className="mb-4"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md mr-2 hover:bg-gray-50"
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
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Book</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit(onSubmitEditBook)}>
              <input type="hidden" {...registerEdit("id")} />
              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormInput
                  id="edit-title"
                  name="title"
                  label="Title*"
                  register={registerEdit}
                  errors={editErrors}
                  validation={{ required: "Title is required" }}
                />

                <FormInput
                  id="edit-author"
                  name="author"
                  label="Author*"
                  register={registerEdit}
                  errors={editErrors}
                  validation={{ required: "Author is required" }}
                />

                <FormInput
                  id="edit-isbn"
                  name="isbn"
                  label="ISBN*"
                  register={registerEdit}
                  errors={editErrors}
                  validation={{ required: "ISBN is required" }}
                />

                <FormInput
                  id="edit-category"
                  name="category"
                  label="Category"
                  register={registerEdit}
                  errors={editErrors}
                />

                <FormInput
                  id="edit-publisher"
                  name="publisher"
                  label="Publisher"
                  register={registerEdit}
                  errors={editErrors}
                />

                <FormInput
                  id="edit-publishedDate"
                  name="publishedDate"
                  label="Published Date"
                  type="date"
                  register={registerEdit}
                  errors={editErrors}
                />

                <FormInput
                  id="edit-totalCopies"
                  name="totalCopies"
                  label="Total Copies"
                  type="number"
                  register={registerEdit}
                  errors={editErrors}
                  validation={{
                    min: { value: 1, message: "Must have at least 1 copy" },
                  }}
                />

                <FormInput
                  id="edit-shelfLocation"
                  name="shelfLocation"
                  label="Shelf Location"
                  register={registerEdit}
                  errors={editErrors}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Book Cover Image
                </label>
                <div className="flex items-center space-x-4">
                  <input type="hidden" {...registerEdit("image")} />
                  {/* Display image preview if available */}
                  {registerEdit("image").value && (
                    <div
                      className="w-24 h-32 bg-cover bg-center border border-gray-300 rounded-md"
                      style={{
                        backgroundImage: `url(${registerEdit("image").value})`,
                      }}
                    ></div>
                  )}
                  <CloudinaryUploadWidget onUpload={handleEditImageUpload}>
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={open}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {registerEdit("image").value
                          ? "Change Image"
                          : "Upload Image"}
                      </button>
                    )}
                  </CloudinaryUploadWidget>
                </div>
              </div>

              <FormTextarea
                id="edit-description"
                name="description"
                label="Description"
                rows={3}
                register={registerEdit}
                errors={editErrors}
                className="mb-4"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md mr-2 hover:bg-gray-50"
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

      {isViewModalOpen && selectedBook && (
        <BookDetailsModal book={selectedBook} onClose={closeModal} />
      )}
    </section>
  );
};

export default Books;
