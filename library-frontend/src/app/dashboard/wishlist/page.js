"use client";

import React, { useState, useEffect } from "react";
import Book from "@/components/Book";
import { Heart, BookMarked, BookOpenCheck, Trash2 } from "lucide-react";
import { useWishlist } from "@/hooks/wishlist/useWishlist";
import BookDetailsModal from "@/components/BookDetailsModal";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleViewBook = (book) => {
    setSelectedBook(book);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    setTimeout(() => setSelectedBook(null), 300);
  };

  const handleRemoveFromWishlist = (bookId, e) => {
    e.stopPropagation();
    removeFromWishlist(bookId);
  };

  // Show loading state while client components are mounting
  if (!isMounted) {
    return <div className="p-4">Loading wishlist...</div>;
  }

  return (
    <section>
      <div>
        <div className="flex items-center">
          <Heart size={24} className="text-red-500 mr-3 fill-current" />
          <h1 className="h1 gradient-text">My Wishlist</h1>
        </div>
        <p className="mt-2">
          Books you&apos;ve saved to revisit later. Click on any book to view its details.
        </p>

        {/* Wishlist content */}
        {wishlist.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm mt-8">
            <div className="flex flex-col items-center">
              <BookMarked size={48} className="text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Your wishlist is empty.</p>
              <p className="text-gray-500 text-sm">
                Browse the catalog and click the heart icon to add books to your wishlist.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-4 mb-6">
              <div className="flex items-center">
                <BookOpenCheck size={18} className="text-gray-500 mr-2" />
                <p className="text-gray-700">
                  {wishlist.length} {wishlist.length === 1 ? "book" : "books"} in your wishlist
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              {wishlist.map((book) => (
                <div key={book.id} className="relative group">
                  <div onClick={() => handleViewBook(book)}>
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
                  <button
                    onClick={(e) => handleRemoveFromWishlist(book.id, e)}
                    className="absolute bottom-12 right-2 p-1.5 rounded-full bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 shadow-md hover:bg-red-200"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </>
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

export default WishlistPage;
