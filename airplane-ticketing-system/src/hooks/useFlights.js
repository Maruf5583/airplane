import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { flightsApi } from '../api/flightsApi';

export function useFlightsList(params = {}) {
  return useQuery({
    queryKey: ['flights', params],
    queryFn: async () => {
      const { data } = await flightsApi.getAll(params);
      return data;
    },
    keepPreviousData: true,
  });
}

export function useFlight(id) {
  return useQuery({
    queryKey: ['flights', id],
    queryFn: async () => {
      const { data } = await flightsApi.getById(id);
      return data;
    },
    enabled: !!id,
  });
}

export function useFlightSeatMap(id, enabled = true) {
  return useQuery({
    queryKey: ['flights', id, 'seats'],
    queryFn: async () => {
      const { data } = await flightsApi.getSeatMap(id);
      return data;
    },
    enabled: !!id && enabled,
  });
}

export function useCreateFlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => flightsApi.create(payload),
    onSuccess: () => {
      toast.success('Flight created successfully');
      queryClient.invalidateQueries({ queryKey: ['flights'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to create flight');
    },
  });
}

export function useUpdateFlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => flightsApi.update(id, payload),
    onSuccess: () => {
      toast.success('Flight updated successfully');
      queryClient.invalidateQueries({ queryKey: ['flights'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to update flight');
    },
  });
}

export function useDeleteFlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => flightsApi.delete(id),
    onSuccess: () => {
      toast.success('Flight deleted');
      queryClient.invalidateQueries({ queryKey: ['flights'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to delete flight');
    },
  });
}

export function useGenerateSeats() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => flightsApi.generateSeats(id),
    onSuccess: (_, id) => {
      toast.success('Seats generated successfully');
      queryClient.invalidateQueries({ queryKey: ['flights', id, 'seats'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to generate seats');
    },
  });
}

export function useUpdateFlightStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => flightsApi.updateStatus(id, payload),
    onSuccess: () => {
      toast.success('Flight status updated');
      queryClient.invalidateQueries({ queryKey: ['flights'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to update status');
    },
  });
}