import axiosClient from './axiosClient';

export const paymentsApi = {
  createIntent: (bookingId) =>
    axiosClient.post('/api/v1/payments/intent', { bookingId }),

  confirm: (paymentIntentId) =>
    axiosClient.post('/api/v1/payments/confirm', { paymentIntentId }),

  validatePromo: (data) =>
    axiosClient.post('/api/v1/payments/promo/validate', data),

  requestRefund: (data) => axiosClient.post('/api/v1/payments/refund', data),

  processRefund: (id, data) =>
    axiosClient.patch(`/api/v1/payments/refund/${id}/process`, data),

  getById: (id) => axiosClient.get(`/api/v1/payments/${id}`),

  getAllAdmin: (params) => axiosClient.get('/api/v1/payments/admin', { params }),
};