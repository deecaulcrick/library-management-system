"use client";

import React from "react";
import { useGetDashboardStats } from "@/hooks/dashboard/useDashboard";
import Image from "next/image";
import Link from "next/link";

const PopularBooks = () => {
  const { data, isLoading, error } = useGetDashboardStats();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Popular Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading popular books</div>;
  }

  // Ensure popularBooks is at least an empty array if undefined
  const popularBooks = data?.popularBooks || [];
  console.log("popularBooks", popularBooks);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Popular Books</h2>

      {popularBooks.length === 0 ? (
        <p className="text-gray-500">No data available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {popularBooks.map((book) => (
            <Link
              href={`/admin/dashboard/books/${book.Book.id}`}
              key={book.Book.id}
              className="group"
            >
              <div className="overflow-hidden rounded-lg transition-all duration-300 group-hover:shadow-lg">
                <div className="relative h-56 bg-gray-100">
                  <Image
                    src={book.Book.image || "/images/book-placeholder.jpg"}
                    alt={book.Book.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "/images/book-placeholder.jpg";
                    }}
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600">
                    {book.Book.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {book.Book.author}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {book.loanCount} loans
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularBooks;
