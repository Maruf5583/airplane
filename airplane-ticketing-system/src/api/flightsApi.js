import axiosClient from './axiosClient';

export const flightsApi = {
  getAll: (params) => axiosClient.get('/api/v1/flights', { params }),

  generateSeats: (id) => axiosClient.post(`/api/v1/flights/${id}/generate-seats`),

  getById: (id) => axiosClient.get(`/api/v1/flights/${id}`),

  create: (data) => axiosClient.post('/api/v1/flights', data),

  update: (id, data) => axiosClient.put(`/api/v1/flights/${id}`, data),

  delete: (id) => axiosClient.delete(`/api/v1/flights/${id}`),

  getSeatMap: (id) => axiosClient.get(`/api/v1/flights/${id}/seats`),

  updateStatus: (id, data) =>
    axiosClient.patch(`/api/v1/flights/${id}/status`, data),
};