import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { bookingsApi } from '../api/bookingsApi';

export function useBookingsListAdmin(params = {}) {
  return useQuery({
    queryKey: ['bookings', 'admin', params],
    queryFn: async () => {
      const { data } = await bookingsApi.getAllAdmin(params);
      return data;
    },
    keepPreviousData: true,
  });
}

export function useBookingsList(params = {}) {
  return useQuery({
    queryKey: ['bookings', params],
    queryFn: async () => {
      const { data } = await bookingsApi.getAll(params);
      return data;
    },
    keepPreviousData: true,
  });
}

export function useBooking(id) {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: async () => {
      const { data } = await bookingsApi.getById(id);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => bookingsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to create booking');
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => bookingsApi.cancel(id, { reason }),
    onSuccess: () => {
      toast.success('Booking cancelled');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to cancel booking');
    },
  });
}

export function useSelectSeat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => bookingsApi.selectSeat(id, payload),
    onSuccess: (_, variables) => {
      toast.success('Seat selected');
      queryClient.invalidateQueries({ queryKey: ['bookings', variables.id] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to select seat');
    },
  });
}

