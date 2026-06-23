import axiosClient from './axiosClient';

export const airlinesApi = {
  getAll: () => axiosClient.get('/api/v1/airlines'),

  create: (data) => axiosClient.post('/api/v1/airlines', data),

  getById: (id) => axiosClient.get(`/api/v1/airlines/${id}`),

  update: (id, data) => axiosClient.put(`/api/v1/airlines/${id}`, data),
};