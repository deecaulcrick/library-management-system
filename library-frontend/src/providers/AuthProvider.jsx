"use client";

import { initializeAuth, AUTH_QUERY_KEY } from "@/hooks/auth/useAuth";
import { useEffect, createContext, useContext, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Create auth context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Initialize auth state from cookies on component mount
    const isAuthenticated = initializeAuth();
    
    // Set initialized flag
    setIsInitialized(true);
    
    // If authenticated, invalidate auth query to fetch fresh user data
    if (isAuthenticated) {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    }
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
