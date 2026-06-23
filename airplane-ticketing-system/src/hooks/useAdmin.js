import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';

export function useDashboard(params = {}) {
  return useQuery({
    queryKey: ['admin', 'dashboard', params],
    queryFn: async () => {
      const { data } = await adminApi.getDashboard(params);
      return data;
    },
  });
}

export function useRevenueReport(params = {}) {
  return useQuery({
    queryKey: ['admin', 'revenue-report', params],
    queryFn: async () => {
      const { data } = await adminApi.getRevenueReport(params);
      return data;
    },
  });
}

export function useBookingReport(params = {}) {
  return useQuery({
    queryKey: ['admin', 'booking-report', params],
    queryFn: async () => {
      const { data } = await adminApi.getBookingReport(params);
      return data;
    },
  });
}

export function useAuditLogs(params = {}) {
  return useQuery({
    queryKey: ['admin', 'audit-logs', params],
    queryFn: async () => {
      const { data } = await adminApi.getAuditLogs(params);
      return data;
    },
    keepPreviousData: true,
  });
}

export function useCreateAgent() {
  return useMutation({
    mutationFn: (payload) => adminApi.createAgent(payload),
  });
}

export function useSendFlightAlert() {
  return useMutation({
    mutationFn: (payload) => adminApi.sendFlightAlert(payload),
  });
}