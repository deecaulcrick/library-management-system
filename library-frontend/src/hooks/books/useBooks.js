import { apiInstance } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Query keys
export const BOOKS_QUERY_KEY = ["books"];
export const BOOK_DETAIL_QUERY_KEY = (id) => ["books", id];
export const BOOK_LOANS_QUERY_KEY = (id) => ["books", id, "loans"];

// Get all books
export const useGetAllBooks = () => {
  return useQuery({
    queryKey: BOOKS_QUERY_KEY,
    queryFn: async () => {
      const response = await apiInstance.get("/books");
      return response.data;
    },
  });
};

// Get book by ID
export const useGetBookById = (id) => {
  return useQuery({
    queryKey: BOOK_DETAIL_QUERY_KEY(id),
    queryFn: async () => {
      const response = await apiInstance.get(`/books/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run the query if an ID is provided
  });
};

// Create a new book
export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookData) => {
      const response = await apiInstance.post("/books", bookData);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate the books query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEY });
      toast.success("Book created successfully!");
    },
    onError: (error) => {
      console.error("Failed to create book:", error.message);
      toast.error(error.response?.data?.message || "Failed to create book");
    },
  });
};

// Update a book
export const useUpdateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...bookData }) => {
      const response = await apiInstance.put(`/books/${id}`, bookData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific book detail
      queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: BOOK_DETAIL_QUERY_KEY(variables.id),
      });
      toast.success("Book updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update book:", error.message);
      toast.error(error.response?.data?.message || "Failed to update book");
    },
  });
};

// Delete a book
export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await apiInstance.delete(`/books/${id}`);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate the books query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEY });
      // Remove the specific book from the query cache
      queryClient.removeQueries({ queryKey: BOOK_DETAIL_QUERY_KEY(variables) });
      toast.success("Book deleted successfully!");
    },
    onError: (error) => {
      console.error("Failed to delete book:", error.message);
      toast.error(error.response?.data?.message || "Failed to delete book");
    },
  });
};

// Get book loan history
export const useGetBookLoanHistory = (id) => {
  return useQuery({
    queryKey: BOOK_LOANS_QUERY_KEY(id),
    queryFn: async () => {
      const response = await apiInstance.get(`/books/${id}/loans`);
      return response.data;
    },
    enabled: !!id, // Only run the query if an ID is provided
  });
};
