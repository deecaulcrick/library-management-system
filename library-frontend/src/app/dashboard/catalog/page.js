"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Book from "@/components/Book";
import { Search, BookOpen } from "lucide-react";
import BookDetailsModal from "@/components/BookDetailsModal";
import { useGetAllBooks } from "@/hooks/books/useBooks";

const Catalog = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Fetch books using the hook
  const { data: booksData, isLoading, isError } = useGetAllBooks(debouncedSearchTerm);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Client-side mounting effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Search debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleViewBook = (book) => {
    setSelectedBook(book);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    // Optionally delay clearing the book data
    setTimeout(() => setSelectedBook(null), 300); // After animation completes
  };

  // Prevent hydration issues
  if (!isMounted) {
    return <div className="p-4">Loading catalog...</div>;
  }

  return (
    <section>
      <div>
        <div>
          <h1 className="h1 gradient-text">Browse Books.</h1>
          <p className="mt-2">
            Explore our extensive collection of books across various genres. Find your next great read!
          </p>

          {/* Search bar */}
          <div className="relative mt-5">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="text-gray-900 text-sm rounded-lg block pl-10 p-2.5 focus:outline-none focus:ring-2 border-[0.5px] border-black focus:ring-orange focus:border-orange w-full"
              placeholder="Search by title, author, category or ISBN..."
            />
          </div>
        </div>

        {/* Book list display */}
        {isLoading ? (
          <div className="flex justify-center items-center mt-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange mx-auto mb-4"></div>
              <p className="text-gray-600">Loading books...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="text-center mt-16">
            <p className="text-red-600">Error loading books. Please try again later.</p>
          </div>
        ) : booksData?.books?.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm mt-8">
            <div className="flex flex-col items-center">
              <BookOpen size={48} className="text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">
                {debouncedSearchTerm 
                  ? "No books match your search criteria." 
                  : "No books available in the catalog."}
              </p>
              {debouncedSearchTerm && (
                <p className="text-gray-500 text-sm">Try searching with different keywords.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap mt-10 gap-6">
            {booksData.books.map((book) => (
              <div key={book.id}>
                <Book
                  title={book.title}
                  author={book.author}
                  image={book.image}
                  id={book.id}
                  status={book.status}
                  availableCopies={book.availableCopies}
                  onClick={() => handleViewBook(book)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination (if available) */}
        {booksData?.pagination && booksData.pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow-sm -space-x-px">
              <div className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                Page {booksData.pagination.currentPage} of {booksData.pagination.totalPages}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Book details modal */}
      {isViewModalOpen && selectedBook && (
        <BookDetailsModal
          isOpen={isViewModalOpen}
          onClose={closeModal}
          book={selectedBook}
        />
      )}
    </section>
  );
};

export default Catalog;
