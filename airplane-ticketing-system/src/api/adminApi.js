import axiosClient from './axiosClient';

export const adminApi = {
  getDashboard: (params) =>
    axiosClient.get('/api/v1/admin/dashboard', { params }),

  getRevenueReport: (params) =>
    axiosClient.get('/api/v1/admin/reports/revenue', { params }),

  getBookingReport: (params) =>
    axiosClient.get('/api/v1/admin/reports/bookings', { params }),

  getAuditLogs: (params) =>
    axiosClient.get('/api/v1/admin/audit-logs', { params }),

  createAgent: (data) => axiosClient.post('/api/v1/admin/agents', data),

  sendFlightAlert: (data) =>
    axiosClient.post('/api/v1/admin/notifications/flight-alert', data),
};