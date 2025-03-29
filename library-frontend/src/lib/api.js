import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { extractErrorMessage } from "@/utils/errorHandler";

// Auth token constant from auth hook
const AUTH_TOKEN_KEY = "library_auth_token";

export const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to all requests
apiInstance.interceptors.request.use(
  (config) => {
    // Get token from cookies
    const token = Cookies.get(AUTH_TOKEN_KEY);
    
    // If token exists, add it to the request header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and authentication issues
apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Mark request as retried to prevent infinite loops
      originalRequest._retry = true;
      
      // Clear auth token if it exists
      if (Cookies.get(AUTH_TOKEN_KEY)) {
        Cookies.remove(AUTH_TOKEN_KEY);
        
        // Show authentication error toast
        toast.error("Your session has expired. Please log in again.", {
          id: "auth-error",
          duration: 5000,
        });
        
        // Redirect to login page
        if (typeof window !== "undefined") {
          // Store the current path for redirect after login
          const currentPath = window.location.pathname;
          if (!currentPath.includes("/login")) {
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          } else {
            window.location.href = "/login";
          }
        }
      }
    }
    
    // Extract and display meaningful error message
    const errorMessage = extractErrorMessage(error);
    
    // Handle network errors
    if (!error.response) {
      toast.error("Network error. Please check your connection.", {
        id: "network-error",
      });
    }
    
    // Handle server errors (500)
    else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.", {
        id: "server-error",
      });
    }
    
    // Handle validation and other client errors
    else if (error.response?.status >= 400 && error.response?.status < 500) {
      toast.error(errorMessage, {
        id: `error-${Date.now()}`,
      });
    }
    
    return Promise.reject(error);
  }
);
