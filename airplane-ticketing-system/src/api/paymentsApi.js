import axiosClient from './axiosClient';

export const paymentsApi = {
  // NEW - submit manual payment proof (transaction ID + screenshot)
  submitPayment: (bookingId, formData) =>
    axiosClient.post(`/api/v1/payments/${bookingId}/submit`, formData),

  // NEW - admin approves/rejects a payment
  verifyPayment: (id, data) =>
    axiosClient.patch(`/api/v1/payments/${id}/verify`, data),

  // NEW - check payment status for a booking
  getByBookingId: (bookingId) =>
    axiosClient.get(`/api/v1/payments/by-booking/${bookingId}`),

  validatePromo: (data) =>
    axiosClient.post('/api/v1/payments/promo/validate', data),

  requestRefund: (data) => axiosClient.post('/api/v1/payments/refund', data),

  processRefund: (id, data) =>
    axiosClient.patch(`/api/v1/payments/refund/${id}/process`, data),

  getById: (id) => axiosClient.get(`/api/v1/payments/${id}`),

  getAllAdmin: (params) => axiosClient.get('/api/v1/payments/admin', { params }),
};