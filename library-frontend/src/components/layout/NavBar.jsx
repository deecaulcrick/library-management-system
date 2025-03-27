"use client";

import { useLogout, useGetProfile, useIsAuthenticated, getUserData } from "@/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NavBar = () => {
  const pathname = usePathname();
  const logout = useLogout();
  const { isAuthenticated } = useIsAuthenticated();
  const { data: profile, isLoading } = useGetProfile();
  const [userData, setUserData] = useState(null);

  // Get user data from cookies on client-side
  useEffect(() => {
    if (isAuthenticated) {
      const localUserData = getUserData();
      setUserData(localUserData);
    }
  }, [isAuthenticated]);

  // Update user data when profile is loaded
  useEffect(() => {
    if (profile) {
      setUserData(profile);
    }
  }, [profile]);

  // Don't show navbar on login and register pages
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                Library System
              </Link>
            </div>
            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className={`${
                    pathname === "/dashboard"
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/books"
                  className={`${
                    pathname === "/books" || pathname.startsWith("/books/")
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Books
                </Link>
                <Link
                  href="/loans"
                  className={`${
                    pathname === "/loans" || pathname.startsWith("/loans/")
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Loans
                </Link>
                <Link
                  href="/reservations"
                  className={`${
                    pathname === "/reservations" || pathname.startsWith("/reservations/")
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Reservations
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  {userData ? (
                    <div className="flex items-center">
                      <span className="font-medium">{userData.name}</span>
                      <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {userData.role}
                      </span>
                    </div>
                  ) : (
                    <span>Loading user...</span>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
