"use client";

import { useIsAuthenticated } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useIsAuthenticated();

  useEffect(() => {
    // Only redirect if auth state is initialized and user is not authenticated
    if (isInitialized && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isInitialized, router]);

  // Show nothing while checking authentication status
  if (!isInitialized) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If authenticated, render children
  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
