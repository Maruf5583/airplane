import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ticketsApi } from '../api/ticketsApi';

export function useTicketsByBooking(bookingId) {
  return useQuery({
    queryKey: ['tickets', 'booking', bookingId],
    queryFn: async () => {
      const { data } = await ticketsApi.getByBookingId(bookingId);
      return data;
    },
    enabled: !!bookingId,
  });
}

export function useTicketByNumber(ticketNumber) {
  return useQuery({
    queryKey: ['tickets', ticketNumber],
    queryFn: async () => {
      const { data } = await ticketsApi.getByTicketNumber(ticketNumber);
      return data;
    },
    enabled: !!ticketNumber,
  });
}

function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export function useDownloadTicket() {
  return useMutation({
    mutationFn: async (ticketNumber) => {
      const { data } = await ticketsApi.download(ticketNumber);
      downloadBlob(data, `ticket-${ticketNumber}.pdf`);
    },
    onError: () => toast.error('Failed to download ticket'),
  });
}

export function useDownloadBoardingPass() {
  return useMutation({
    mutationFn: async (ticketNumber) => {
      const { data } = await ticketsApi.getBoardingPass(ticketNumber);
      downloadBlob(data, `boarding-pass-${ticketNumber}.pdf`);
    },
    onError: () => toast.error('Failed to download boarding pass'),
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ticketNumber) => ticketsApi.checkIn(ticketNumber),
    onSuccess: (_, ticketNumber) => {
      toast.success('Checked in successfully');
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Check-in failed');
    },
  });
}