import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { paymentsApi } from '../api/paymentsApi';

export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: (bookingId) => paymentsApi.createIntent(bookingId),
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to initialize payment');
    },
  });
}

export function useConfirmPayment() {
  return useMutation({
    mutationFn: (paymentIntentId) => paymentsApi.confirm(paymentIntentId),
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Payment confirmation failed');
    },
  });
}