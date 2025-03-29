"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, X, Upload, AlertCircle } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ImageUpload } from "@/components/Upload/ImageUpload";

// No need for dynamic import as we're implementing the drawer directly in this file

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
  const [isMounted, setIsMounted] = useState(false);
  const [enhancedUploadUrl, setEnhancedUploadUrl] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // State for modals and drawers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // Action button classes
  const viewButtonClass = "text-blue-500 hover:text-blue-700";
  const editButtonClass = "text-green-500 hover:text-green-700";
  const deleteButtonClass = "text-red-500 hover:text-red-700";

  // Hooks for API calls
  const { data: booksData, isLoading, isError, error } = useGetAllBooks(debouncedSearchTerm);
  const { mutate: createBook } = useCreateBook();
  const { mutate: updateBook } = useUpdateBook();
  const { mutate: deleteBook } = useDeleteBook();

  // React Hook Form for new book
  const {
    register: registerNew,
    handleSubmit: handleNewSubmit,
    setValue: setNewValue,
    reset: resetNewForm,
    formState: { errors: newErrors },
    control: newControl,
    watch: watchNew,
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
    watch: watchEdit,
  } = useForm({
    resolver: zodResolver(bookSchema),
  });

  // Use this to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Search debounce effect
  useEffect(() => {
    // Debounce search to prevent excessive API calls
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const onSubmitNewBook = (data) => {
    try {
      createBook(
        {
          ...data,
          image: enhancedUploadUrl,
        },
        {
          onSuccess: () => {
            // Close modal and reset form
            setIsModalOpen(false);
            resetNewForm();
            toast.success("Book created successfully");
          },
          onError: (error) => {
            toast.error(
              "Failed to create book: " + (error?.message || "Unknown error")
            );
          },
        }
      );
    } catch (error) {
      console.error("Error creating book:", error);
      toast.error("Failed to create book");
    }
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setEnhancedUploadUrl(book.image || ""); // Set the current image URL

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

    // Manually set the id value to ensure it's available
    setEditValue("id", book.id);

    setIsEditModalOpen(true);
  };

  const onSubmitEditBook = (data) => {
    console.log("Updating book:", data);
    try {
      updateBook(
        {
          id: editingBook.id,
          bookData: {
            ...data,
            image: enhancedUploadUrl || data.image,
          },
        },
        {
          onSuccess: () => {
            // Close modal and reset form
            setIsEditModalOpen(false);
            setEditingBook(null);
            toast.success("Book updated successfully");
          },
          onError: (error) => {
            toast.error(
              "Failed to update book: " + (error?.message || "Unknown error")
            );
          },
        }
      );
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error("Failed to update book");
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      deleteBook(bookId, {
        onSuccess: () => {
          toast.success("Book deleted successfully");
          setIsDeleteAlertOpen(false);
          setBookToDelete(null);
        },
        onError: (error) => {
          toast.error(
            "Failed to delete book: " + (error?.message || "Unknown error")
          );
        },
      });
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete book");
    }
  };

  const openDeleteConfirmation = (book) => {
    setBookToDelete(book);
    setIsDeleteAlertOpen(true);
  };

  const handleViewBook = (book) => {
    setSelectedBook(book);
    setIsViewDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsViewDrawerOpen(false);
    setTimeout(() => setSelectedBook(null), 300); // After animation completes
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // If not mounted yet, return a simple loading state to prevent hydration issues
  if (!isMounted) {
    return <div className="p-8">Loading books...</div>;
  }

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
            placeholder="Search by title, author, ISBN or category..."
            value={searchTerm}
            onChange={handleSearchChange}
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
                    <div className="flex space-x-6">
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
                        onClick={() => openDeleteConfirmation(book)}
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
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new book to the catalog.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleNewSubmit(onSubmitNewBook)}
            className="space-y-4 py-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                type="date"
                label="Published Date"
                register={registerNew}
                errors={newErrors}
              />

              <FormInput
                id="quantity"
                name="quantity"
                type="number"
                label="Quantity*"
                register={registerNew}
                errors={newErrors}
                validation={{ required: "Quantity is required" }}
              />

              <FormInput
                id="shelfLocation"
                name="shelfLocation"
                label="Shelf Location"
                register={registerNew}
                errors={newErrors}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Book Cover Image
              </label>

              <div className="p-6 border rounded-lg shadow-sm">
                <ImageUpload
                  onUpload={(url) => setEnhancedUploadUrl(url)}
                  maxSizeMB={5}
                  allowedFormats={["jpg", "jpeg", "png", "webp"]}
                />
              </div>
            </div>

            <FormTextarea
              id="description"
              name="description"
              label="Description"
              rows={3}
              register={registerNew}
              errors={newErrors}
            />

            <DialogFooter>
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
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Book Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>
              Update the book information below.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleEditSubmit(onSubmitEditBook)}
            className="space-y-4 py-4"
          >
            <input type="hidden" {...registerEdit("id")} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                type="date"
                label="Published Date"
                register={registerEdit}
                errors={editErrors}
              />

              <FormInput
                id="edit-quantity"
                name="quantity"
                type="number"
                label="Quantity*"
                register={registerEdit}
                errors={editErrors}
                validation={{ required: "Quantity is required" }}
              />

              <FormInput
                id="edit-shelfLocation"
                name="shelfLocation"
                label="Shelf Location"
                register={registerEdit}
                errors={editErrors}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Book Cover Image
              </label>

              <div className="p-6 border rounded-lg shadow-sm">
                <ImageUpload
                  onUpload={(url) => setEnhancedUploadUrl(url)}
                  maxSizeMB={5}
                  allowedFormats={["jpg", "jpeg", "png", "webp"]}
                />
              </div>
            </div>

            <FormTextarea
              id="edit-description"
              name="description"
              label="Description"
              rows={3}
              register={registerEdit}
              errors={editErrors}
            />

            <DialogFooter>
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
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the book &quot;{bookToDelete?.title}
              &quot; from the library system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => bookToDelete && handleDeleteBook(bookToDelete.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Book Details Drawer */}
      <Drawer
        open={isViewDrawerOpen}
        onOpenChange={setIsViewDrawerOpen}
        direction="right"
      >
        <DrawerContent className="sm:max-w-md max-h-[100vh] overflow-y-auto">
          {selectedBook && (
            <div className="p-6">
              <DrawerHeader>
                <div className="flex justify-between items-center">
                  <DrawerTitle className="text-2xl font-bold">
                    {selectedBook.title}
                  </DrawerTitle>
                  <DrawerClose className="rounded-full h-8 w-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200">
                    <X className="h-4 w-4" />
                  </DrawerClose>
                </div>
              </DrawerHeader>

              <div className="mt-6">
                <div className="flex flex-col items-center mb-8">
                  <div
                    className="w-48 h-64 rounded-md mb-4 bg-cover bg-center shadow-md"
                    style={{
                      backgroundImage: `url(${
                        selectedBook.image || "/assets/bookimg.png"
                      })`,
                    }}
                  ></div>
                  <span className={getStatusBadgeClass(selectedBook.status)}>
                    {selectedBook.status}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Author
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedBook.author}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Category
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedBook.category || "Uncategorized"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        ISBN
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedBook.isbn}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Publisher
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedBook.publisher || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Published Date
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedBook.publishedDate
                          ? new Date(
                              selectedBook.publishedDate
                            ).toLocaleDateString()
                          : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Shelf Location
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedBook.shelfLocation || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Total Copies
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedBook.totalCopies || 0}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Available Copies
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedBook.availableCopies || 0}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Description
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedBook.description || "No description available."}
                    </p>
                  </div>
                </div>
              </div>

              <DrawerFooter className="mt-8 border-t pt-4 flex flex-row justify-between">
                <button
                  onClick={() => {
                    setIsViewDrawerOpen(false);
                    setTimeout(() => openEditModal(selectedBook), 300);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Edit Book
                </button>
                <button
                  onClick={() => {
                    setIsViewDrawerOpen(false);
                    setTimeout(() => openDeleteConfirmation(selectedBook), 300);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete Book
                </button>
              </DrawerFooter>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </section>
  );
};

export default Books;
