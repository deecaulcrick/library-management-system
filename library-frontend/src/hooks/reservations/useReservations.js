import { apiInstance } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Query keys
export const RESERVATIONS_QUERY_KEY = ["reservations"];

// Get all reservations
export const useGetAllReservations = () => {
  return useQuery({
    queryKey: RESERVATIONS_QUERY_KEY,
    queryFn: async () => {
      const response = await apiInstance.get("/reservations");
      return response.data;
    },
  });
};

// Get reservation by ID
export const useGetReservationById = (id) => {
  return useQuery({
    queryKey: ["reservation", id],
    queryFn: async () => {
      const response = await apiInstance.get(`/reservations/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Create a new reservation
export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationData) => {
      const response = await apiInstance.post("/reservations", reservationData);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate the reservations query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: RESERVATIONS_QUERY_KEY });
      toast.success("Book reserved successfully!");
    },
    onError: (error) => {
      console.error("Failed to reserve book:", error.message);
      toast.error(error.response?.data?.message || "Failed to reserve book");
    },
  });
};

// Cancel a reservation
export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId) => {
      const response = await apiInstance.put(`/reservations/${reservationId}/cancel`);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate the reservations query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: RESERVATIONS_QUERY_KEY });
      toast.success("Reservation cancelled successfully!");
    },
    onError: (error) => {
      console.error("Failed to cancel reservation:", error.message);
      toast.error(error.response?.data?.message || "Failed to cancel reservation");
    },
  });
};

// Check for expired reservations
export const useCheckExpiredReservations = () => {
  return useQuery({
    queryKey: ["expiredReservations"],
    queryFn: async () => {
      const response = await apiInstance.get("/reservations/check-expired");
      return response.data;
    },
  });
};

// Get user's active reservations
export const useGetUserActiveReservations = (userId) => {
  return useQuery({
    queryKey: ["userReservations", userId],
    queryFn: async () => {
      const endpoint = userId ? `/reservations/user/${userId}` : "/reservations/user";
      const response = await apiInstance.get(endpoint);
      return response.data;
    },
    enabled: !!userId,
  });
};
