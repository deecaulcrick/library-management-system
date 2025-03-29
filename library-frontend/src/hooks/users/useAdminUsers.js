import { apiInstance } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Query keys
export const ADMIN_USERS_QUERY_KEY = ["adminUsers"];

// Get all users with advanced filtering for admin
export const useGetAdminUsers = (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  // Add any filters to the query params
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  });

  return useQuery({
    queryKey: [...ADMIN_USERS_QUERY_KEY, filters],
    queryFn: async () => {
      const { data } = await apiInstance.get(`/api/admin/users?${queryParams.toString()}`, {
        withCredentials: true,
      });
      return data;
    },
  });
};

// Get user by ID (admin endpoint)
export const useGetAdminUserById = (userId) => {
  return useQuery({
    queryKey: ["adminUser", userId],
    queryFn: async () => {
      const { data } = await apiInstance.get(`/api/admin/users/${userId}`, {
        withCredentials: true,
      });
      return data;
    },
    enabled: !!userId,
  });
};

// Update user (admin endpoint)
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, userData }) => {
      const { data } = await apiInstance.put(`/api/admin/users/${id}`, userData, {
        withCredentials: true,
      });
      return data;
    },
    onSuccess: () => {
      // Invalidate the admin users query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
      toast.success("User updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update user:", error);
      toast.error(error.response?.data?.message || "Failed to update user");
    },
  });
};

// Delete user (admin endpoint)
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const { data } = await apiInstance.delete(`/api/admin/users/${userId}`, {
        withCredentials: true,
      });
      return data;
    },
    onSuccess: () => {
      // Invalidate the admin users query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
      toast.success("User deleted successfully!");
    },
    onError: (error) => {
      console.error("Failed to delete user:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });
};

// Toggle user status (admin endpoint)
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await apiInstance.patch(`/api/admin/users/${id}/status`, { status }, {
        withCredentials: true,
      });
      return data;
    },
    onSuccess: () => {
      // Invalidate the admin users query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
      toast.success("User status updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update user status:", error);
      toast.error(error.response?.data?.message || "Failed to update user status");
    },
  });
};
