import { apiInstance } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Auth token constants
export const AUTH_TOKEN_KEY = "library_auth_token";
export const AUTH_USER_KEY = "library_user";
export const AUTH_QUERY_KEY = ["auth", "user"];

// Set auth token in cookies and API headers
export const setAuthToken = (token) => {
  if (token) {
    // Set token in cookie (expires in 7 days)
    Cookies.set(AUTH_TOKEN_KEY, token, { expires: 7 });
    // Set token in API headers for all subsequent requests
    apiInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    // Remove token from cookies and API headers
    Cookies.remove(AUTH_TOKEN_KEY);
    delete apiInstance.defaults.headers.common["Authorization"];
  }
};

// Set user data in cookies
export const setUserData = (userData) => {
  if (userData) {
    Cookies.set(AUTH_USER_KEY, JSON.stringify(userData), { expires: 7 });
  } else {
    Cookies.remove(AUTH_USER_KEY);
  }
};

// Get user data from cookies
export const getUserData = () => {
  const userData = Cookies.get(AUTH_USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Initialize auth state from cookies
export const initializeAuth = () => {
  const token = Cookies.get(AUTH_TOKEN_KEY);
  if (token) {
    apiInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return true;
  }
  return false;
};

// Login hook
export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await apiInstance.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Set auth token and user data
      setAuthToken(data.token);
      setUserData(data.user);
      
      // Invalidate auth query to update isAuthenticated status
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      
      toast.success("Login successful!");
      
      // Redirect to dashboard
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Login failed:", error.message);
      toast.error(error.response?.data?.message || "Invalid credentials");
    },
  });
};

// Register hook
export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (userData) => {
      const response = await apiInstance.post("/auth/register", userData);
      return response.data;
    },
    onSuccess: (data) => {
      // Set auth token and user data
      setAuthToken(data.token);
      setUserData(data.user);
      
      // Invalidate auth query to update isAuthenticated status
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      
      toast.success("Registration successful!");
      
      // Redirect to dashboard
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Registration failed:", error.message);
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });
};

// Logout hook
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return () => {
    // Clear auth token and user data
    setAuthToken(null);
    setUserData(null);
    
    // Invalidate auth query to update isAuthenticated status
    queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    
    toast.success("Logged out successfully");
    
    // Redirect to login page
    router.push("/login");
  };
};

// Check if user is authenticated
export const useIsAuthenticated = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Initialize auth state from cookies
    const authInitialized = initializeAuth();
    setIsAuthenticated(authInitialized);
    setIsInitialized(true);
  }, []);

  return { isAuthenticated, isInitialized };
};

// Get current user profile
export const useGetProfile = () => {
  const { isAuthenticated } = useIsAuthenticated();
  
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const response = await apiInstance.get("/auth/profile");
      return response.data.user;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: (data) => {
      // Update user data in cookies
      setUserData(data);
    },
    onError: (error) => {
      console.error("Failed to fetch user profile:", error);
      // If unauthorized, clear auth data
      if (error.response?.status === 401) {
        setAuthToken(null);
        setUserData(null);
      }
    },
  });
};
