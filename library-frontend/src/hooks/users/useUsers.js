import { apiInstance } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Query keys
export const USERS_QUERY_KEY = ["users"];

// Get all users
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: async () => {
      const response = await apiInstance.get("/users");
      return response.data;
    },
  });
};

// Get user by ID
export const useGetUserById = (userId) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await apiInstance.get(`/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
};

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, userData }) => {
      const response = await apiInstance.put(`/users/${id}`, userData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate the users query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
      toast.success("User updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update user:", error.message);
      toast.error(error.response?.data?.message || "Failed to update user");
    },
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const response = await apiInstance.delete(`/users/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the users query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success("User deleted successfully!");
    },
    onError: (error) => {
      console.error("Failed to delete user:", error.message);
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });
};

// Get user loan history
export const useGetUserLoanHistory = (userId) => {
  return useQuery({
    queryKey: ["userLoanHistory", userId],
    queryFn: async () => {
      const response = await apiInstance.get(`/users/${userId}/loans`);
      return response.data;
    },
    enabled: !!userId,
  });
};
