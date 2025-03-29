"use client";

import { useState, useEffect } from 'react';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const storedWishlist = localStorage.getItem('bookWishlist');
    if (storedWishlist) {
      try {
        setWishlist(JSON.parse(storedWishlist));
      } catch (error) {
        console.error('Error parsing wishlist from localStorage:', error);
        setWishlist([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('bookWishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  // Add book to wishlist
  const addToWishlist = (book) => {
    setWishlist((prevWishlist) => {
      // Check if book already exists in wishlist
      const exists = prevWishlist.some((item) => item.id === book.id);
      if (exists) return prevWishlist;
      
      // Add book to wishlist
      return [...prevWishlist, book];
    });
  };

  // Remove book from wishlist
  const removeFromWishlist = (bookId) => {
    setWishlist((prevWishlist) => 
      prevWishlist.filter((book) => book.id !== bookId)
    );
  };

  // Check if a book is in the wishlist
  const isInWishlist = (bookId) => {
    return wishlist.some((book) => book.id === bookId);
  };

  // Toggle book in wishlist (add if not present, remove if present)
  const toggleWishlist = (book) => {
    if (isInWishlist(book.id)) {
      removeFromWishlist(book.id);
      return false; // Indicate book was removed
    } else {
      addToWishlist(book);
      return true; // Indicate book was added
    }
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist
  };
};
