"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LibraryBig,
  BookOpen,
  BookmarkCheck,
  HelpCircle,
  Menu,
  X,
  ChevronRight,
  User,
} from "lucide-react";
import Logo from "@/icons/Logo";
import LogoText from "@/icons/LogoText";

// Default navigation items for regular users
const defaultUserNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Catalog", href: "/dashboard/catalog", icon: LibraryBig },
  { name: "My Loans", href: "/dashboard/loans", icon: BookOpen },
  { name: "My WishList", href: "/dashboard/wishlist", icon: BookmarkCheck },
  { name: "Help", href: "/dashboard/help", icon: HelpCircle },
];

// Default navigation items for admin users
const defaultAdminNavigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Books", href: "/admin/dashboard/books", icon: LibraryBig },
  { name: "Loans", href: "/admin/dashboard/loans", icon: BookOpen },
  { name: "Students", href: "/admin/dashboard/students", icon: User },
  { name: "Help", href: "/admin/dashboard/help", icon: HelpCircle },
];

const Sidebar = ({
  className = "",
  onToggle,
  isAdmin = false,
  navigationItems = null,
  logoText = "ReadHub",
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Use provided navigation items or default based on isAdmin
  const navigation =
    navigationItems ||
    (isAdmin ? defaultAdminNavigation : defaultUserNavigation);

  useEffect(() => {
    // Notify parent component when collapsed state changes
    if (onToggle) {
      onToggle(collapsed);
    }
  }, [collapsed, onToggle]);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (path) => {
    return (
      pathname === path ||
      (path !== (isAdmin ? "/admin/dashboard" : "/dashboard") &&
        pathname?.startsWith(path))
    );
  };

  return (
    <>
      {/* Mobile menu button - positioned within header space */}
      <button
        type="button"
        className="fixed top-3.5 left-4 z-20 md:hidden flex items-center justify-center rounded-md p-2 text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 backdrop-blur-sm md:hidden transition-opacity"
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
          bg-[#030303] text-white md:translate-x-0 shadow-xl
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex py-5 h-16 items-center justify-between px-4 border-b border-gray-800">
          <div
            className={`flex items-center ${
              collapsed ? "justify-center w-full" : ""
            }`}
          >
            <div className="flex items-center justify-center">
              <Logo
                className={`${
                  collapsed ? "h-9 w-9" : "h-8 w-8"
                } transition-all duration-300`}
              />
            </div>

            {!collapsed && (
              <div className="ml-3 text-xl font-semibold transition-opacity duration-300 flex items-center">
                <LogoText className="h-8 w-auto" />
              </div>
            )}
          </div>
          <button
            className="hidden md:flex text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 transition-colors"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronRight
              size={20}
              className={`transform transition-transform duration-300 ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1.5 px-3">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out cursor-pointer
                    ${
                      active
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }
                    ${collapsed ? "justify-center" : ""}
                  `}
                >
                  <item.icon
                    size={collapsed ? 20 : 18}
                    strokeWidth={active ? 2 : 1.5}
                    className={`
                      flex-shrink-0 
                      ${
                        active
                          ? "text-white"
                          : "text-gray-400 group-hover:text-white"
                      }
                      transition-all duration-200
                    `}
                    aria-hidden="true"
                  />
                  {!collapsed && (
                    <span
                      className={`ml-3 transition-opacity duration-200 ${
                        active ? "font-semibold" : ""
                      }`}
                    >
                      {item.name}
                    </span>
                  )}

                  {/* Active indicator dot for collapsed mode */}
                  {collapsed && active && (
                    <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white"></span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer area with library info */}
        <div className="p-4 border-t border-gray-800">
          {!collapsed && (
            <div className="px-3 py-2 text-xs text-gray-400">
              <div className="font-medium text-gray-300">Codevault</div>
              <div className="mt-1">Library Management System</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
