import axiosClient from './axiosClient';

export const usersApi = {
  getProfile: () => axiosClient.get('/api/v1/users/profile'),

  updateProfile: (data) => axiosClient.put('/api/v1/users/profile', data),

  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/api/v1/users/profile/picture', formData);
  },

  updatePassport: (data) => axiosClient.put('/api/v1/users/passport', data),

  getAll: (params) => axiosClient.get('/api/v1/users', { params }),

  getById: (id) => axiosClient.get(`/api/v1/users/${id}`),

  delete: (id) => axiosClient.delete(`/api/v1/users/${id}`),

  setActive: (id, isActive) =>
    axiosClient.patch(`/api/v1/users/${id}/activate`, { isActive }),
};