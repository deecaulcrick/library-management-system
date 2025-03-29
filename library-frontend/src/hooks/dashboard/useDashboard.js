import { apiInstance } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// Query keys
export const DASHBOARD_STATS_QUERY_KEY = ["dashboardStats"];
export const BOOK_STATS_QUERY_KEY = ["bookStats"];
export const USER_STATS_QUERY_KEY = ["userStats"];
export const USER_DASHBOARD_STATS_QUERY_KEY = ["userDashboardStats"];

// Get dashboard statistics
export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: DASHBOARD_STATS_QUERY_KEY,
    queryFn: async () => {
      const response = await apiInstance.get("/dashboard/admin/stats");
      return response.data;
    },
  });
};

// Get book statistics
export const useGetBookStats = () => {
  return useQuery({
    queryKey: BOOK_STATS_QUERY_KEY,
    queryFn: async () => {
      const response = await apiInstance.get("/dashboard/admin/books");
      return response.data;
    },
  });
};

// Get user statistics
export const useGetUserStats = () => {
  return useQuery({
    queryKey: USER_STATS_QUERY_KEY,
    queryFn: async () => {
      const response = await apiInstance.get("/dashboard/admin/users");
      return response.data;
    },
  });
};

// Get dashboard statistics for a specific user
export const useGetUserDashboardStats = (userId) => {
  return useQuery({
    queryKey: [...USER_DASHBOARD_STATS_QUERY_KEY, userId],
    queryFn: async () => {
      // If userId is provided, fetch for that specific user, otherwise get current user's stats
      const url = userId ? `/dashboard/user/${userId}` : '/dashboard/user';
      const response = await apiInstance.get(url);
      return response.data;
    },
    enabled: true, // Always fetch stats for authenticated users
  });
};
