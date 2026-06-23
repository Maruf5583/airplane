import axiosClient from './axiosClient';

export const authApi = {
  register: (data) => axiosClient.post('/api/v1/auth/register', data),

  login: (data) => axiosClient.post('/api/v1/auth/login', data),

  refreshToken: (refreshToken) =>
    axiosClient.post('/api/v1/auth/refresh-token', { refreshToken }),

  revokeToken: (token) =>
    axiosClient.post('/api/v1/auth/revoke-token', { token }),

  verifyEmail: (data) => axiosClient.post('/api/v1/auth/verify-email', data),

  forgotPassword: (email) =>
    axiosClient.post('/api/v1/auth/forgot-password', { email }),

  resetPassword: (data) => axiosClient.post('/api/v1/auth/reset-password', data),

  getMe: () => axiosClient.get('/api/v1/auth/me'),
};