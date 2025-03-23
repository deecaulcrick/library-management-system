import React, { useState } from "react";
import { Search } from "lucide-react";

const DashboardHeader = ({ fName, lName, role = "Student" }) => {
  const [notificationCount, setNotificationCount] = useState(3);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="border-b border-b-[#CACACA]/50 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Welcome message */}
        <div>
          <h3 className="text-2xl font-semibold tracking-tighter">
            Welcome back, {fName}
          </h3>
          <p className="text-sm font-semibold text-gray-500 tracking-tighter">
            Here's what's up
          </p>
        </div>

        {/* Right side elements */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="text-gray-900 text-sm rounded-lg block w-64 pl-10 p-2.5 focus:outline-none focus:ring-2  border-[1px] focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search books..."
            />
          </div>

          {/* Notification Bell */}
          {/* <div className="relative">
            <button className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full">
              <Bell size={22} />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {notificationCount}
                </span>
              )}
            </button>
          </div> */}

          {/* Profile Picture */}
          <div className="relative">
            <button
              className="flex items-center space-x-3 focus:outline-none"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="h-10 w-10 rounded-full purple bg-purple overflow-hidden flex items-center justify-center">
                {fName.charAt(0)}
                {lName.charAt(0)}

                {/* <img
                  src="/api/placeholder/40/40"
                  alt="Profile"
                  className="h-full w-full object-cover"
                /> */}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">
                  {fName} {lName}
                </p>
                <p className="text-xs text-gray-500">{role}</p>
              </div>
              {/* <ChevronDown
                size={16}
                className="hidden md:block text-gray-500"
              /> */}
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <a
                  href="#profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </a>
                <a
                  href="#settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
                <a
                  href="#logout"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
