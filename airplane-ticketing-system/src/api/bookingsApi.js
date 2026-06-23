import axiosClient from './axiosClient';

export const bookingsApi = {
  create: (data) => axiosClient.post('/api/v1/bookings', data),

  getAll: (params) => axiosClient.get('/api/v1/bookings', { params }),

  getAllAdmin: (params) => axiosClient.get('/api/v1/bookings/admin', { params }),

  getById: (id) => axiosClient.get(`/api/v1/bookings/${id}`),

  getByReference: (reference) =>
    axiosClient.get(`/api/v1/bookings/reference/${reference}`),

  cancel: (id, data) => axiosClient.patch(`/api/v1/bookings/${id}/cancel`, data),

  selectSeat: (id, data) =>
    axiosClient.post(`/api/v1/bookings/${id}/select-seat`, data),
};