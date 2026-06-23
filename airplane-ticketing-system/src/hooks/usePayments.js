import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { paymentsApi } from '../api/paymentsApi';

export function usePaymentsListAdmin(params = {}) {
  return useQuery({
    queryKey: ['payments', 'admin', params],
    queryFn: async () => {
      const { data } = await paymentsApi.getAllAdmin(params);
      return data;
    },
    keepPreviousData: true,
  });
}

export function usePayment(id) {
  return useQuery({
    queryKey: ['payments', id],
    queryFn: async () => {
      const { data } = await paymentsApi.getById(id);
      return data;
    },
    enabled: !!id,
  });
}

export function useRequestRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => paymentsApi.requestRefund(payload),
    onSuccess: () => {
      toast.success('Refund requested');
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to request refund');
    },
  });
}

export function useProcessRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => paymentsApi.processRefund(id, payload),
    onSuccess: (_, variables) => {
      toast.success(variables.payload.approve ? 'Refund approved' : 'Refund denied');
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to process refund');
    },
  });
}