import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { searchApi } from '../api/searchApi';

export function useSearchOneWay() {
  return useMutation({
    mutationFn: (payload) => searchApi.oneWay(payload),
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Search failed. Please try again.');
    },
  });
}

export function useSearchRoundTrip() {
  return useMutation({
    mutationFn: (payload) => searchApi.roundTrip(payload),
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Search failed. Please try again.');
    },
  });
}

export function useSearchMultiCity() {
  return useMutation({
    mutationFn: (payload) => searchApi.multiCity(payload),
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Search failed. Please try again.');
    },
  });
}