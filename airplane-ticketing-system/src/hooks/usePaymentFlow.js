import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { paymentsApi } from '../api/paymentsApi';

export function useSubmitPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, formData }) => paymentsApi.submitPayment(bookingId, formData),
    onSuccess: () => {
      toast.success('Payment submitted. Awaiting verification.');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => toast.error(error.response?.data?.detail || 'Failed to submit payment'),
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => paymentsApi.verifyPayment(id, payload),
    onSuccess: () => {
      toast.success('Payment reviewed');
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => toast.error(error.response?.data?.detail || 'Failed to process payment'),
  });
}


import { createPaymentIntent, confirmStripePayment } from '../api/settings'; // অথবা আপনার payments api file, যেখানে থাকা উচিত

export const useCreatePaymentIntent = () =>
  useMutation({ mutationFn: (bookingId) => createPaymentIntent(bookingId) });

export const useConfirmStripePayment = () =>
  useMutation({ mutationFn: (paymentIntentId) => confirmStripePayment(paymentIntentId) });