import axiosClient from './axiosClient';

export const searchApi = {
  oneWay: (data) => axiosClient.post('/api/v1/search/one-way', data),

  roundTrip: (data) => axiosClient.post('/api/v1/search/round-trip', data),

  multiCity: (data) => axiosClient.post('/api/v1/search/multi-city', data),
};