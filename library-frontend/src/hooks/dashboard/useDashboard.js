import { apiInstance } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// Query keys
export const DASHBOARD_STATS_QUERY_KEY = ["dashboardStats"];
export const BOOK_STATS_QUERY_KEY = ["bookStats"];
export const USER_STATS_QUERY_KEY = ["userStats"];

// Get dashboard statistics
export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: DASHBOARD_STATS_QUERY_KEY,
    queryFn: async () => {
      const response = await apiInstance.get("/dashboard/stats");
      return response.data;
    },
  });
};

// Get book statistics
export const useGetBookStats = () => {
  return useQuery({
    queryKey: BOOK_STATS_QUERY_KEY,
    queryFn: async () => {
      const response = await apiInstance.get("/dashboard/books");
      return response.data;
    },
  });
};

// Get user statistics
export const useGetUserStats = () => {
  return useQuery({
    queryKey: USER_STATS_QUERY_KEY,
    queryFn: async () => {
      const response = await apiInstance.get("/dashboard/users");
      return response.data;
    },
  });
};
