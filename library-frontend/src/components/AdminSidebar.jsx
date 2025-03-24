"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  LibraryBig,
  BookOpen,
  User,
  HelpCircle,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import Logo from "@/icons/Logo";
import LogoText from "@/icons/LogoText";

const AdminSidebar = ({ className = "", onToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Notify parent component when collapsed state changes
    if (onToggle) {
      onToggle(collapsed);
    }
  }, [collapsed, onToggle]);

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Books", href: "/admin/dashboard/books", icon: LibraryBig },
    { name: "Loans", href: "/admin/dashboard/loans", icon: BookOpen },
    {
      name: "Students",
      href: "/admin/dashboard/students",
      icon: User,
    },
    { name: "Help", href: "/dashboard/help", icon: HelpCircle },
  ];

  const isActive = (path) => {
    return router.pathname === path;
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span className="sr-only">Open sidebar</span>
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col 
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
          ${collapsed ? "w-20" : "w-64"} 
          transform transition-all duration-300 ease-in-out
          bg-[#030303] text-white md:translate-x-0
          ${className}
        `}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-700">
          <div
            className={`flex items-center ${
              collapsed ? "justify-center w-full" : ""
            }`}
          >
            <div className=" flex items-center justify-center">
              <Logo className="h-10 w-10" />
            </div>

            {!collapsed && (
              <span className="ml-3 text-xl font-semibold">
                <LogoText className="h-40 w-40" />
              </span>
            )}
          </div>
          <button
            className="hidden md:block text-gray-400 hover:text-white"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronRight
              size={20}
              className={`transform transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-3 py-3 text-sm font-medium rounded-full transition duration-300 ease-in-out
                  ${
                    isActive(item.href)
                      ? "bg-gray-900 text-white"
                      : "text-white hover:border"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <item.icon
                  size={16}
                  strokeWidth={1}
                  className={`
                    flex-shrink-0 h-6 w-6
                    ${isActive(item.href) ? "text-indigo-400" : "text-white"}
                  `}
                  aria-hidden="true"
                />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className=" p-4">
          <nav className="space-y-1 px-5"></nav>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
