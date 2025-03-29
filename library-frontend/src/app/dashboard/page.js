"use client";

import { useState, useEffect } from "react";
import Book from "@/components/Book";
import Link from "next/link";
import { useGetUserActiveLoans } from "@/hooks/loans/useLoans";
import { useGetProfile } from "@/hooks/auth/useAuth";
import { useGetUserDashboardStats } from "@/hooks/dashboard/useDashboard";
import { Loader2, AlertTriangle, BookOpen } from "lucide-react";

const Page = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Fetch the current user profile
  const { data: userData, isLoading: isLoadingProfile } = useGetProfile();
  const userId = userData?.id;

  // Fetch user dashboard statistics from backend
  const {
    data: userStats,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats
  } = useGetUserDashboardStats(userId);

  // Fetch user's active loans
  const {
    data: loansData,
    isLoading: isLoadingLoans,
    isError,
    error,
  } = useGetUserActiveLoans(userId);

  // Handle hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get recent borrowed books from the statistics
  const recentBooks = userStats?.recentLoans || [];

  // If component hasn't mounted yet, return loading state to prevent hydration errors
  if (!isMounted) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  return (
    <section className="">
      <div>
        <div className="">
          <h1 className="h1 gradient-text">Dashboard</h1>

          {/* Loading state */}
          {isLoadingProfile || isLoadingStats || isLoadingLoans ? (
            <div className="flex justify-center items-center mt-8">
              <div className="text-center">
                <Loader2
                  size={36}
                  className="animate-spin mx-auto mb-4 text-gray-500"
                />
                <p className="text-gray-600">Loading your dashboard...</p>
              </div>
            </div>
          ) : statsError || isError ? (
            <div className="text-center mt-8 p-8 bg-red-50 rounded-lg">
              <AlertTriangle size={36} className="mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-medium text-red-800 mb-2">
                Error loading dashboard
              </h3>
              <p className="text-red-600">
                {statsError?.message || error?.message ||
                  "Failed to load your dashboard. Please try again later."}
              </p>
            </div>
          ) : !userId ? (
            <div className="text-center mt-8 p-8 bg-yellow-50 rounded-lg">
              <AlertTriangle
                size={36}
                className="mx-auto mb-4 text-yellow-500"
              />
              <h3 className="text-lg font-medium text-yellow-800 mb-2">
                User profile not available
              </h3>
              <p className="text-yellow-700">
                Could not retrieve your user profile. Please try refreshing the
                page.
              </p>
            </div>
          ) : (
            <div className="">
              {/* Welcome message with user name */}
              <div className="mt-2 mb-6">
                <p className="text-gray-700 text-lg">
                  Welcome back,{" "}
                  <span className="font-semibold">
                    {userData?.name || "Reader"}
                  </span>
                  !
                </p>
              </div>

              {/* Activity stats */}
              <div className="mt-5">
                <h3 className="h3 text-sm">Activity Summary</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  <ActivityCard
                    color="#DBB8FF"
                    number={userStats?.activeBorrows || 0}
                    text="Books borrowed"
                    icon="borrowed"
                  />
                  <ActivityCard
                    color="#FF5B2F"
                    number={userStats?.overdue || 0}
                    text="Books overdue"
                    icon="overdue"
                  />
                  <ActivityCard
                    color="#FF9F05"
                    number={userStats?.returned || 0}
                    text="Books returned"
                    icon="returned"
                  />
                  <ActivityCard
                    color="#3939FF"
                    number={userStats?.totalActivity || 0}
                    text="Total activity"
                    icon="total"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Borrowed books section */}
        {!isLoadingProfile && !isLoadingStats && !isLoadingLoans && userId && (
          <div className="mt-10">
            <div className="flex items-end justify-between">
              <h2 className="h2">Borrowed books</h2>
              <Link
                href="/dashboard/loans"
                className="font-medium text-[#FF5B2F] underline text-sm"
              >
                See all
              </Link>
            </div>

            {recentBooks.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center mt-4">
                <BookOpen size={48} className="text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No books borrowed yet
                </h3>
                <p className="text-gray-600 mb-4">
                  You haven&apos;t borrowed any books yet. Explore our catalog
                  to find your next great read!
                </p>
                <Link
                  href="/dashboard/catalog"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                >
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <div className="flex gap-4 mt-4 overflow-x-auto pb-4">
                {recentBooks.map((loan) => (
                  <div key={loan.id}>
                    <Book
                      id={loan.bookId}
                      title={loan.bookTitle}
                      author={loan.bookAuthor}
                      image={loan.bookImage}
                      status={loan.status}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

// Custom Activity Card component
const ActivityCard = ({ color, number = 0, text = "Books", icon }) => {
  // Choose icon based on type
  const getIcon = () => {
    switch (icon) {
      case "borrowed":
        return <BookOpen size={20} strokeWidth={1.5} />;
      case "overdue":
        return <AlertTriangle size={20} strokeWidth={1.5} />;
      case "returned":
        return <BookOpen size={20} strokeWidth={1.5} />;
      case "total":
      default:
        return <BookOpen size={20} strokeWidth={1.5} />;
    }
  };

  return (
    <div className="border-[0.5px] border-black rounded-[20px] p-7 hover:shadow-lg transition duration-300 ease-in-out">
      <div className="flex justify-between items-start">
        <div className="h1 gradient-text">{number}</div>
        {getIcon()}
      </div>
      <div className="font-semibold gradient-text text-xl tracking-tighter">
        {text}
      </div>
    </div>
  );
};

export default Page;
