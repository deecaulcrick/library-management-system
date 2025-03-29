"use client";

import { BookOpen, Check, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useWishlist } from "@/hooks/wishlist/useWishlist";

const Book = ({ image, title, author, id, status, availableCopies, onClick }) => {
  // Determine if the book is available
  const isAvailable = availableCopies > 0 || status === "available";
  const [imageError, setImageError] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isMounted, setIsMounted] = useState(false);

  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle wishlist toggle
  const handleWishlistToggle = (e) => {
    e.stopPropagation(); // Prevent triggering parent onClick
    const bookData = { id, title, author, image, status, availableCopies };
    toggleWishlist(bookData);
  };

  return (
    <div className="w-52 flex-none cursor-pointer group transition-transform hover:scale-105 duration-200" onClick={onClick}>
      <div className="relative rounded-md overflow-hidden shadow-md mb-3">
        {/* Book cover image container */}
        <div className="pb-[140%] relative bg-gray-100">
          {/* Main image layer */}
          {!imageError ? (
            <img
              src={image || "/assets/bookimg.png"}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100">
              <BookOpen size={48} className="text-gray-400" />
              <span className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-500 px-2">
                No image
              </span>
            </div>
          )}

          {/* Button overlay - only shows the button with backdrop filter on hover */}
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[0px] group-hover:backdrop-blur-[2px] transition-all duration-300">
            <div className="transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <button className="bg-white bg-opacity-80 text-gray-900 px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                View Details
              </button>
            </div>
          </div>

          {/* Wishlist button */}
          {isMounted && (
            <button 
              onClick={handleWishlistToggle}
              className={`absolute top-2 left-2 p-1.5 rounded-full ${
                isInWishlist(id) 
                ? "bg-red-100 text-red-600" 
                : "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500"
              } transition-colors duration-200 z-10`}
              aria-label={isInWishlist(id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart 
                size={16} 
                className={isInWishlist(id) ? "fill-current" : ""} 
              />
            </button>
          )}

          {/* Availability badge */}
          <div
            className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
              isAvailable
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isAvailable ? "Available" : "Unavailable"}
          </div>
        </div>
      </div>

      {/* Book details */}
      <div className="px-1">
        <h3 className="text-gray-900 font-medium text-sm line-clamp-2 h-10">
          {title || "Untitled Book"}
        </h3>
        <p className="text-gray-600 text-xs mt-1">
          by <span className="italic">{author || "Unknown Author"}</span>
        </p>
      </div>
    </div>
  );
};

export default Book;
