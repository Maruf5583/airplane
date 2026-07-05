import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { airlinesApi } from '../api/airlinesApi';
import { airportsApi } from '../api/airportsApi';

export function useAirlinesList() {
  return useQuery({
    queryKey: ['airlines'],
    queryFn: async () => {
      const { data } = await airlinesApi.getAll();
      return data;
    },
  });
}

export function useAirportsList(params = {}) {
  return useQuery({
    queryKey: ['airports', params],
    queryFn: async () => {
      const { data } = await airportsApi.getAll(params);
      return data;
    },
    keepPreviousData: true,
  });
}

export function useCreateAirline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => airlinesApi.create(payload),
    onSuccess: () => {
      toast.success('Airline created');
      queryClient.invalidateQueries({ queryKey: ['airlines'] });
    },
    onError: (error) => toast.error(error.response?.data?.detail || 'Failed to create airline'),
  });
}

export function useUpdateAirline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => airlinesApi.update(id, payload),
    onSuccess: () => {
      toast.success('Airline updated');
      queryClient.invalidateQueries({ queryKey: ['airlines'] });
    },
    onError: (error) => toast.error(error.response?.data?.detail || 'Failed to update airline'),
  });
}

export function useCreateAirport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => airportsApi.create(payload),
    onSuccess: () => {
      toast.success('Airport created');
      queryClient.invalidateQueries({ queryKey: ['airports'] });
    },
    onError: (error) => toast.error(error.response?.data?.detail || 'Failed to create airport'),
  });
}

export function useUpdateAirport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => airportsApi.update(id, payload),
    onSuccess: () => {
      toast.success('Airport updated');
      queryClient.invalidateQueries({ queryKey: ['airports'] });
    },
    onError: (error) => toast.error(error.response?.data?.detail || 'Failed to update airport'),
  });
}

export function useDeleteAirport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => airportsApi.delete(id),
    onSuccess: () => {
      toast.success('Airport deleted');
      queryClient.invalidateQueries({ queryKey: ['airports'] });
    },
    onError: (error) => toast.error(error.response?.data?.detail || 'Failed to delete airport'),
  });
}

// NEW - Upload photos (max 5)
export function useUploadAirportPhotos() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ airportId, files }) => {
      const formData = new FormData();
      files.forEach((file) => formData.append('photos', file));
      return airportsApi.uploadPhotos(airportId, formData);
    },
    onSuccess: () => {
      toast.success('Photos uploaded');
      queryClient.invalidateQueries({ queryKey: ['airports'] });
    },
    onError: (error) => toast.error(error.response?.data?.detail || 'Failed to upload photos'),
  });
}

// NEW - Delete a single photo
export function useDeleteAirportPhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ airportId, photoId }) => airportsApi.deletePhoto(airportId, photoId),
    onSuccess: () => {
      toast.success('Photo deleted');
      queryClient.invalidateQueries({ queryKey: ['airports'] });
    },
    onError: (error) => toast.error(error.response?.data?.detail || 'Failed to delete photo'),
  });
}