"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Book,
  BookOpen,
  Library,
  PenTool,
  Search,
  Shield,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useIsAuthenticated } from "@/hooks";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, isInitialized } = useIsAuthenticated();
  const [userData, setUserData] = useState(null);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get user data if authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      try {
        const storedUserData = localStorage.getItem("library_user");
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [isInitialized, isAuthenticated]);

  // Get the appropriate dashboard URL
  const getDashboardUrl = () => {
    if (!userData) return "/login";
    return userData.role === "admin" ? "/admin/dashboard" : "/dashboard";
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <main className="min-h-screen  bg-gray-900">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-gray-800 shadow-md py-2" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image
              src="/assets/logo.svg"
              alt="Library Logo"
              width={48}
              height={48}
              className="h-10 w-auto"
            />
            <Image
              src="/assets/logotext.svg"
              alt="Library Text Logo"
              width={150}
              height={40}
              className="h-8 w-auto hidden sm:block"
            />
          </div>

          <div className="flex items-center space-x-3 md:space-x-6">
            {isInitialized && isAuthenticated ? (
              <Link
                href={getDashboardUrl()}
                className="px-5 py-2 font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-medium text-gray-600 hover:text-blue-600 transition-colors duration-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2 font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:pt-48 md:pb-32 relative overflow-hidden bg-gray-900 text-white">
        <div className="container mx-auto relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Modern Library Management System
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Streamline your library operations with our comprehensive digital
              solution. Manage books, users, and loans with ease.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              variants={itemVariants}
            >
              <Link
                href="/signup"
                className="px-8 py-4 font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              >
                Existing Users
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Modern Libraries
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our system provides comprehensive tools for managing all aspects
              of library operations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <motion.div
              className="bg-blue-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={itemVariants}
            >
              <div className="bg-blue-100 rounded-xl p-3 w-14 h-14 flex items-center justify-center mb-6">
                <Book className="text-blue-600 h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Catalog Management</h3>
              <p className="text-gray-600">
                Easily manage your book inventory with comprehensive cataloging
                features. Add, update, and track books with detailed
                information.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="bg-purple-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={itemVariants}
            >
              <div className="bg-purple-100 rounded-xl p-3 w-14 h-14 flex items-center justify-center mb-6">
                <Users className="text-purple-600 h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">User Management</h3>
              <p className="text-gray-600">
                Keep track of patrons, staff, and admin users with different
                access levels and permissions. Monitor activity and manage
                accounts.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="bg-indigo-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={itemVariants}
            >
              <div className="bg-indigo-100 rounded-xl p-3 w-14 h-14 flex items-center justify-center mb-6">
                <BookOpen className="text-indigo-600 h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Loan Management</h3>
              <p className="text-gray-600">
                Streamline the borrowing process with automated loan tracking,
                due date reminders, and overdue notifications.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              className="bg-orange-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={itemVariants}
            >
              <div className="bg-orange-100 rounded-xl p-3 w-14 h-14 flex items-center justify-center mb-6">
                <Search className="text-orange-600 h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Advanced Search</h3>
              <p className="text-gray-600">
                Find any book in seconds with our powerful search capabilities.
                Filter by title, author, genre, and availability.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              className="bg-teal-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={itemVariants}
            >
              <div className="bg-teal-100 rounded-xl p-3 w-14 h-14 flex items-center justify-center mb-6">
                <PenTool className="text-teal-600 h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Wishlist & Bookmarking
              </h3>
              <p className="text-gray-600">
                Allow users to create personal wishlists of books they want to
                read next, making it easier to keep track of interests.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              className="bg-red-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={itemVariants}
            >
              <div className="bg-red-100 rounded-xl p-3 w-14 h-14 flex items-center justify-center mb-6">
                <Shield className="text-red-600 h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Role-Based Access</h3>
              <p className="text-gray-600">
                Secure access control with different permissions for students,
                staff, and administrators. Protect sensitive information.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Library at a Glance
            </h2>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              Our comprehensive system helps libraries of all sizes manage their
              operations effectively.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {/* Stat 1 */}
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center"
              variants={itemVariants}
            >
              <h3 className="text-5xl font-bold mb-2">10K+</h3>
              <p className="text-blue-100">Books Cataloged</p>
            </motion.div>

            {/* Stat 2 */}
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center"
              variants={itemVariants}
            >
              <h3 className="text-5xl font-bold mb-2">5K+</h3>
              <p className="text-blue-100">Active Users</p>
            </motion.div>

            {/* Stat 3 */}
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center"
              variants={itemVariants}
            >
              <h3 className="text-5xl font-bold mb-2">500+</h3>
              <p className="text-blue-100">Daily Loans</p>
            </motion.div>

            {/* Stat 4 */}
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center"
              variants={itemVariants}
            >
              <h3 className="text-5xl font-bold mb-2">99%</h3>
              <p className="text-blue-100">User Satisfaction</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzBhNiA2IDAgMSAxLTEyIDAgNiA2IDAgMCAxIDEyIDB6TTYwIDMwYTYgNiAwIDEgMS0xMiAwIDYgNiAwIDAgMSAxMiAwek0xMiAzMGE2IDYgMCAxIDEtMTIgMCA2IDYgMCAwIDEgMTIgMHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-6"
              variants={itemVariants}
            >
              Ready to Transform Your Library?
            </motion.h2>
            <motion.p
              className="text-xl mb-10 text-indigo-100"
              variants={itemVariants}
            >
              Join thousands of libraries that have modernized their operations
              with our system.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link
                href="/signup"
                className="px-10 py-5 font-medium bg-white text-indigo-600 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300 inline-flex items-center text-lg"
              >
                Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Image
                  src="/assets/logo.svg"
                  alt="Library Logo"
                  width={40}
                  height={40}
                  className="h-8 w-auto invert"
                />
                <span className="font-bold text-lg">Library MS</span>
              </div>
              <p className="text-gray-400 text-sm">
                A comprehensive library management system designed for modern
                institutions.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/login"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/login"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Admin Portal
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                <li>
                  <span className="text-gray-400">Catalog Management</span>
                </li>
                <li>
                  <span className="text-gray-400">User Management</span>
                </li>
                <li>
                  <span className="text-gray-400">Loan Tracking</span>
                </li>
                <li>
                  <span className="text-gray-400">Analytics & Reports</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>
                  <span className="text-gray-400">support@libraryms.com</span>
                </li>
                <li>
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </li>
                <li>
                  <span className="text-gray-400">
                    123 Library Street, Booktown
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
            <p> 2025 Library Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Add styles for blob animation */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: scale(1) translate(0px, 0px);
          }
          33% {
            transform: scale(1.1) translate(30px, -50px);
          }
          66% {
            transform: scale(0.9) translate(-20px, 20px);
          }
          100% {
            transform: scale(1) translate(0px, 0px);
          }
        }
        .animate-blob {
          animation: blob 8s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}
