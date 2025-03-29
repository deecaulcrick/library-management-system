import { apiInstance } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Query keys
export const ADMIN_LOANS_QUERY_KEY = ["adminLoans"];

// Get all loans with advanced filtering for admin
export const useGetAdminLoans = (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  // Add any filters to the query params
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/loans?${queryString}` : "/loans";

  return useQuery({
    queryKey: [...ADMIN_LOANS_QUERY_KEY, filters],
    queryFn: async () => {
      const response = await apiInstance.get(endpoint);
      return response.data;
    },
  });
};

// Admin: Update loan status (approve, reject, mark as returned, mark as overdue)
export const useUpdateLoanStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ loanId, status, fineAmount = 0 }) => {
      const response = await apiInstance.put(`/loans/${loanId}/status`, {
        status,
        fineAmount,
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all loan-related queries
      queryClient.invalidateQueries({ queryKey: ADMIN_LOANS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      toast.success("Loan status updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update loan status:", error);
      toast.error(error.response?.data?.message || "Failed to update loan status");
    },
  });
};

// Admin: Record fine payment
export const useRecordFinePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ loanId, amount }) => {
      const response = await apiInstance.put(`/loans/${loanId}/pay-fine`, {
        amount,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_LOANS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      toast.success("Fine payment recorded successfully");
    },
    onError: (error) => {
      console.error("Failed to record fine payment:", error);
      toast.error(error.response?.data?.message || "Failed to record payment");
    },
  });
};

// Admin: Get loan statistics
export const useLoanStats = () => {
  return useQuery({
    queryKey: ["loanStats"],
    queryFn: async () => {
      const response = await apiInstance.get("/loans/stats");
      return response.data;
    },
  });
};
