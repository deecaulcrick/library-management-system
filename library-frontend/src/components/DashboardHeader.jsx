import React, { useState } from "react";
import { Search, ChevronDown, Menu } from "lucide-react";
import { useLogout, useGetProfile, getUserData } from "@/hooks/auth/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DashboardHeader = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const logout = useLogout();

  // Get user data using both methods for reliability
  const { data: profileData, isLoading } = useGetProfile();
  const cookieUserData = getUserData();

  // Use profile data from API if available, otherwise fall back to cookie data
  const userData = profileData || cookieUserData || {};
  const { firstName, lastName, role, email } = userData;

  // Format name for display
  const displayName =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : email?.split("@")[0] || "User";

  // Format initials for avatar
  const getInitials = (firstName, lastName, email) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    } else if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  // Determine role text display
  const roleDisplay = role === "admin" ? "Administrator" : role || "Student";

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Determine the correct route based on user role
    const baseRoute = role === "admin" ? "/admin/dashboard" : "/dashboard";
    const searchRoute = `${baseRoute}/search?q=${encodeURIComponent(
      searchQuery.trim()
    )}`;

    router.push(searchRoute);
  };

  return (
    <header className="sticky top-0 right-0 left-0 md:left-auto z-10 bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 md:px-8 py-3 flex items-center justify-between">
        {/* Welcome message */}
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 capitalize">
            Welcome back, {isLoading ? "..." : displayName}
          </h3>
          <p className="text-xs md:text-sm text-gray-500 capitalize font-medium">
            {roleDisplay}
          </p>
        </div>

        {/* Right side elements */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="relative hidden md:block">
            <form onSubmit={handleSearchSubmit}>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-gray-900 text-sm rounded-lg block w-56 pl-10 p-2 
                  border border-gray-300 focus:outline-none focus:ring-2 
                  focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search books..."
              />
            </form>
          </div>

          <div className="relative">
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div
                className="h-10 w-10 rounded-full bg-indigo-600 text-white 
                flex items-center justify-center font-medium shadow-sm"
              >
                {isLoading ? "..." : getInitials()}
              </div>
              <ChevronDown
                size={16}
                className={`hidden md:block text-gray-500 transition-transform duration-200 ${
                  showProfileMenu ? "transform rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg 
                shadow-lg py-1 z-20 border border-gray-200"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500">{roleDisplay}</p>
                </div>
                <Link
                  href={
                    role === "admin"
                      ? "/admin/dashboard/help"
                      : "/dashboard/help"
                  }
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Help
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-red-600 
                    hover:bg-gray-50 transition-colors border-t border-gray-100 mt-1"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
