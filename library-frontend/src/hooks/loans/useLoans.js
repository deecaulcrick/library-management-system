import { apiInstance } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Query keys
export const LOANS_QUERY_KEY = ["loans"];

// Get all loans
export const useGetAllLoans = () => {
  return useQuery({
    queryKey: LOANS_QUERY_KEY,
    queryFn: async () => {
      const response = await apiInstance.get("/loans");
      return response.data;
    },
  });
};

// Get loan by ID
export const useGetLoanById = (loanId) => {
  return useQuery({
    queryKey: ["loan", loanId],
    queryFn: async () => {
      const response = await apiInstance.get(`/loans/${loanId}`);
      return response.data;
    },
    enabled: !!loanId,
  });
};

// Create a new loan (borrow a book)
export const useCreateLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loanData) => {
      const response = await apiInstance.post("/loans", loanData);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate the loans query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: LOANS_QUERY_KEY });
      toast.success("Book borrowed successfully!");
    },
    onError: (error) => {
      console.error("Failed to borrow book:", error.message);
      toast.error(error.response?.data?.message || "Failed to borrow book");
    },
  });
};

// Return a book
export const useReturnBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loanId) => {
      const response = await apiInstance.put(`/loans/${loanId}/return`);
      return response.data;
    },
    onSuccess: (data, loanId, context) => {
      // Invalidate all loan-related queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: LOANS_QUERY_KEY });
      
      // Also invalidate user-specific loans query (all user IDs to be safe)
      queryClient.invalidateQueries({ queryKey: ["userLoans"] });
      
      // Don't show toast here, we'll handle it in the component
    },
    onError: (error) => {
      console.error("Failed to return book:", error.message);
      toast.error(error.response?.data?.message || "Failed to return book");
    },
  });
};

// Check for overdue loans
export const useCheckOverdueLoans = () => {
  return useQuery({
    queryKey: ["overdueLoans"],
    queryFn: async () => {
      const response = await apiInstance.get("/loans/check-overdue");
      return response.data;
    },
  });
};

// Get user's active loans
export const useGetUserActiveLoans = (userId) => {
  return useQuery({
    queryKey: ["userLoans", userId],
    queryFn: async () => {
      const endpoint = userId ? `/loans/user/${userId}` : "/loans/user";
      const response = await apiInstance.get(endpoint);
      return response.data;
    },
    enabled: !!userId,
  });
};
