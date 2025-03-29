"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useGetAllBooks } from "@/hooks/books/useBooks";
import Link from "next/link";
import { ChevronLeft, ExternalLink } from "lucide-react";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [isMounted, setIsMounted] = useState(false);

  const { data: booksData, isLoading, isError } = useGetAllBooks(query);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // If not mounted yet, return a simple loading state to prevent hydration issues
  if (!isMounted) {
    return <div className="p-4">Loading search results...</div>;
  }

  // Styling classes
  const tableCellClass = "px-4 py-3 text-sm text-gray-800";
  const tableRowClass = "border-b border-gray-200 hover:bg-gray-50";
  const tableHeaderClass =
    "px-4 py-3 text-left text-sm font-medium text-gray-600 bg-gray-50";

  // Get status badge color based on book status
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800";
      case "borrowed":
        return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800";
      case "reserved":
        return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800";
      default:
        return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/dashboard/books"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Book Management
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mt-4">
          Search Results: {query}
        </h1>
        <p className="text-gray-500 mt-1">
          {isLoading
            ? "Searching for books..."
            : `Found ${booksData?.books?.length || 0} results`}
        </p>
      </div>

      {/* Search Results */}
      <div className="bg-white shadow-sm rounded-md overflow-hidden">
        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-600">Loading search results...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-10">
            <p className="text-red-600">
              Error loading search results. Please try again.
            </p>
          </div>
        ) : booksData?.books?.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600">
              No books match your search criteria.
            </p>
          </div>
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
                    <Link
                      href={`/admin/dashboard/books?view=${book.id}`}
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      <ExternalLink size={14} className="mr-1" />
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="p-4">Loading search page...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
