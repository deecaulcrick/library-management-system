import { apiInstance } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage, formatValidationErrors } from "@/utils/errorHandler";
import { useState, useEffect } from "react";

// Query keys
export const BOOKS_QUERY_KEY = ["books"];
export const BOOK_SEARCH_QUERY_KEY = (query) => ["books", "search", query];
export const BOOK_DETAIL_QUERY_KEY = (id) => ["books", id];
export const BOOK_LOANS_QUERY_KEY = (id) => ["books", id, "loans"];

// Get all books
export const useGetAllBooks = (query = "") => {
  return useQuery({
    queryKey: query ? BOOK_SEARCH_QUERY_KEY(query) : BOOKS_QUERY_KEY,
    queryFn: async () => {
      const response = await apiInstance.get("/books", {
        params: query ? { search: query } : {},
      });
      return response.data;
    },
  });
};

// Search books with debounce
export const useSearchBooks = (query = "", debounceMs = 500) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);
    
    return () => {
      clearTimeout(handler);
    };
  }, [query, debounceMs]);
  
  return useQuery({
    queryKey: BOOK_SEARCH_QUERY_KEY(debouncedQuery),
    queryFn: async () => {
      const response = await apiInstance.get("/books", {
        params: { search: debouncedQuery },
      });
      return response.data;
    },
    enabled: debouncedQuery.length > 2, // Only search if query is at least 3 characters
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
    mutationFn: async (newBook) => {
      const response = await apiInstance.post("/books", newBook);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEY });
      toast.success("Book created successfully!");
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
      
      // Return formatted validation errors to be used in form
      return formatValidationErrors(error.response?.data);
    },
  });
};

// Update a book
export const useUpdateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, bookData }) => {
      const response = await apiInstance.put(`/books/${id}`, bookData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEY });
      toast.success("Book updated successfully!");
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
      
      // Return formatted validation errors to be used in form
      return formatValidationErrors(error.response?.data);
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEY });
      toast.success("Book deleted successfully!");
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
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
