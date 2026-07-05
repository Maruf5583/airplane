import axiosClient from './axiosClient';

export const airportsApi = {
  getAll: (params) => axiosClient.get('/api/v1/airports', { params }),

  getByIata: (iataCode) => axiosClient.get(`/api/v1/airports/${iataCode}`),

  create: (data) => axiosClient.post('/api/v1/airports', data),

  update: (id, data) => axiosClient.put(`/api/v1/airports/${id}`, data),

  delete: (id) => axiosClient.delete(`/api/v1/airports/${id}`),

  uploadPhotos: (id, formData) =>
    axiosClient.post(`/api/v1/airports/${id}/photos`, formData),   // header removed

  deletePhoto: (airportId, photoId) =>
    axiosClient.delete(`/api/v1/airports/${airportId}/photos/${photoId}`),
};