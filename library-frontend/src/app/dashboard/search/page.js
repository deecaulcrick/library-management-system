"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useGetAllBooks } from "@/hooks/books/useBooks";
import Link from "next/link";
import { ChevronLeft, BookOpen } from "lucide-react";

// Create a client component that uses searchParams
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

  return (
    <div>
      <div className="mb-6">
        <Link 
          href="/dashboard/catalog"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Catalog
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
      <div className="mt-6">
        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-600">Loading search results...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-10">
            <p className="text-red-600">Error loading search results. Please try again.</p>
          </div>
        ) : booksData?.books?.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm p-8">
            <div className="flex flex-col items-center">
              <BookOpen size={48} className="text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">No books match your search criteria.</p>
              <p className="text-gray-500 text-sm">Try searching with different keywords.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {booksData?.books.map((book) => (
              <div key={book.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="relative pb-[60%] bg-gray-100">
                  <div
                    className="absolute inset-0 bg-center bg-cover"
                    style={{
                      backgroundImage: `url(${book.image || "/assets/bookimg.png"})`,
                    }}
                  ></div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{book.author}</p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      book.availableCopies > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {book.availableCopies > 0 ? "Available" : "Unavailable"}
                    </span>
                    <Link
                      href={`/dashboard/catalog/${book.id}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {booksData?.pagination && booksData.pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {/* Pagination controls would go here */}
            <div className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              Page {booksData.pagination.currentPage} of {booksData.pagination.totalPages}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}

export default function UserSearchPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="p-4">Loading search page...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
