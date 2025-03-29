"use client";

import { useState, useEffect } from "react";
import { useGetUserActiveLoans, useReturnBook } from "@/hooks/loans/useLoans";
import { useGetProfile } from "@/hooks/auth/useAuth";
import {
  Calendar,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { formatDistance, parseISO } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";

const Loans = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [returningLoanId, setReturningLoanId] = useState(null);

  // Fetch the current user profile
  const { data: userData, isLoading: isLoadingProfile } = useGetProfile();
  const userId = userData?.id;

  // Fetch user's active loans with the user ID
  const {
    data: loansData,
    isLoading,
    isError,
    error,
  } = useGetUserActiveLoans(userId);

  
  console.log("userData", userData);
  console.log("loansData", loansData);
  
  // Log first loan object for debugging
  if (loansData?.activeLoans?.length > 0) {
    console.log("First loan object structure:", loansData.activeLoans[0]);
  }

  // Mutation for returning books
  const { mutate: returnBook, isPending: isReturning } = useReturnBook();

  // Handle hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle returning a book
  const handleReturnBook = (loan) => {
    const loanId = loan.id || loan.loanId;
    console.log("Attempting to return loan with ID:", loanId);
    setReturningLoanId(loanId);
    
    returnBook(loanId, {
      onSuccess: () => {
        setReturningLoanId(null);
        toast.success("Book returned successfully!");
        
        // Optimistic UI update - update the loan status locally for immediate feedback
        if (loansData && loansData.activeLoans) {
          const updatedLoans = loansData.activeLoans.map(l => {
            if ((l.id || l.loanId) === loanId) {
              return { ...l, status: "returned" };
            }
            return l;
          });
          
          // Update the local state with modified loans
          loansData.activeLoans = updatedLoans;
        }
      },
      onError: (error) => {
        setReturningLoanId(null);
        toast.error(error.response?.data?.message || "Failed to return book");
      },
    });
  };

  // Get status badge styling based on loan status
  const getStatusBadge = (status, dueDate) => {
    let badgeClasses =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    let statusText = status;

    // Check if overdue based on due date
    const isOverdue =
      dueDate &&
      new Date(dueDate) < new Date() &&
      status.toLowerCase() === "borrowed";

    if (isOverdue) {
      badgeClasses += " bg-red-100 text-red-800";
      statusText = "Overdue";
    } else if (status.toLowerCase() === "borrowed") {
      badgeClasses += " bg-yellow-100 text-yellow-800";
    } else if (status.toLowerCase() === "returned") {
      badgeClasses += " bg-green-100 text-green-800";
    } else {
      badgeClasses += " bg-gray-100 text-gray-800";
    }

    return (
      <span className={badgeClasses}>
        {isOverdue && <AlertTriangle size={12} className="mr-1" />}
        {status.toLowerCase() === "returned" && (
          <CheckCircle size={12} className="mr-1" />
        )}
        {statusText}
      </span>
    );
  };

  // Format the due date in a readable way
  const formatDueDate = (dueDate) => {
    if (!dueDate) return "N/A";

    const date = parseISO(dueDate);
    const now = new Date();
    const isPast = date < now;

    return (
      <span className={isPast ? "text-red-600 font-medium" : ""}>
        {formatDistance(date, now, { addSuffix: true })}
      </span>
    );
  };

  // If component hasn't mounted yet, return loading state to prevent hydration errors
  if (!isMounted) {
    return <div className="p-4">Loading loans...</div>;
  }

  return (
    <section>
      <div>
        <h1 className="h1 gradient-text">My Loans</h1>
        <p className="mt-2">
          View and manage your borrowed books. You can see due dates and return
          books when you&apos;re done with them.
        </p>
      </div>

      {/* Show loading state when fetching profile or loans */}
      {isLoadingProfile || isLoading ? (
        <div className="flex justify-center items-center mt-16">
          <div className="text-center">
            <Loader2
              size={36}
              className="animate-spin mx-auto mb-4 text-gray-500"
            />
            <p className="text-gray-600">Loading your loans...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="text-center mt-16 p-8 bg-red-50 rounded-lg">
          <AlertTriangle size={36} className="mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Error loading loans
          </h3>
          <p className="text-red-600">
            {error?.message ||
              "Failed to load your loans. Please try again later."}
          </p>
        </div>
      ) : !userId ? (
        <div className="text-center mt-16 p-8 bg-yellow-50 rounded-lg">
          <AlertTriangle size={36} className="mx-auto mb-4 text-yellow-500" />
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            User profile not available
          </h3>
          <p className="text-yellow-700">
            Could not retrieve your user profile. Please try refreshing the
            page.
          </p>
        </div>
      ) : loansData?.activeLoans?.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
          <div className="h-24 w-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
            <BookOpen size={48} className="text-indigo-500" />
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            No books borrowed yet
          </h3>

          <p className="text-gray-600 text-center mb-6 max-w-md">
            You haven&apos;t borrowed any books yet. Visit our catalog to
            discover amazing books and start your reading journey.
          </p>

          <Link
            href="/dashboard/catalog"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200"
          >
            <BookOpen size={16} className="mr-2" />
            Browse Catalog
          </Link>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <div className="bg-indigo-100 h-8 w-8 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-indigo-700 font-medium">1</span>
                </div>
                <h4 className="font-medium text-gray-800 mb-1">Find a Book</h4>
                <p className="text-gray-600 text-sm">
                  Browse our extensive collection
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <div className="bg-indigo-100 h-8 w-8 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-indigo-700 font-medium">2</span>
                </div>
                <h4 className="font-medium text-gray-800 mb-1">Borrow It</h4>
                <p className="text-gray-600 text-sm">
                  Request to borrow for 14 days
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <div className="bg-indigo-100 h-8 w-8 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-indigo-700 font-medium">3</span>
                </div>
                <h4 className="font-medium text-gray-800 mb-1">Return It</h4>
                <p className="text-gray-600 text-sm">
                  Return when you&apos;re finished
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto mt-10">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-left text-sm text-gray-600 font-medium">
                  Book ID
                </th>
                <th className="py-3 px-4 text-left text-sm text-gray-600 font-medium">
                  Title
                </th>
                <th className="py-3 px-4 text-left text-sm text-gray-600 font-medium">
                  Author
                </th>
                <th className="py-3 px-4 text-left text-sm text-gray-600 font-medium">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-sm text-gray-600 font-medium">
                  Due Date
                </th>
                <th className="py-3 px-4 text-left text-sm text-gray-600 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loansData?.activeLoans?.map((loan) => (
                <tr
                  key={loan.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-gray-800">
                    {loan.bookId || "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div
                        className="w-10 h-14 rounded-sm mr-3 bg-cover bg-center flex-shrink-0"
                        style={{
                          backgroundImage: `url(${
                            loan.Book?.image || "/assets/bookimg.png"
                          })`,
                        }}
                      ></div>
                      <span className="text-gray-800 font-medium">
                        {loan.Book?.title || "Unknown Book"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-800">
                    {loan.Book?.author || "Unknown Author"}
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(loan.status, loan.dueDate)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-gray-800">
                      <Calendar size={14} className="mr-1 text-gray-500" />
                      {formatDueDate(loan.dueDate)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {loan.status.toLowerCase() === "borrowed" && (
                      <button
                        onClick={() => handleReturnBook(loan)}
                        disabled={isReturning && returningLoanId === (loan.id || loan.loanId)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                      >
                        {isReturning && returningLoanId === (loan.id || loan.loanId) ? (
                          <>
                            <Loader2 size={12} className="animate-spin mr-1" />
                            Returning...
                          </>
                        ) : (
                          "Return Book"
                        )}
                      </button>
                    )}
                    {loan.status.toLowerCase() === "returned" && (
                      <span className="text-gray-500 text-sm">Returned</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default Loans;
