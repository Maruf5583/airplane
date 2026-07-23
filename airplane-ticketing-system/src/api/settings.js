import axiosClient from './axiosClient'; // ⚠️ আপনার এই file-এর exact নাম/path অনুযায়ী adjust করুন

const BASE = '/api/v1/settings';

export const getSettings = () =>
  axiosClient.get(BASE).then((res) => res.data);

export const updateGeneralSettings = (data) =>
  axiosClient.put(`${BASE}/general`, data).then((res) => res.data);

export const updateMailSettings = (data) =>
  axiosClient.put(`${BASE}/mail`, data).then((res) => res.data);

export const testMailSettings = (toEmail) =>
  axiosClient.post(`${BASE}/mail/test`, { toEmail }).then((res) => res.data);

export const uploadLogo = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosClient.post(`${BASE}/logo`, formData).then((res) => res.data);
};

export const uploadFavicon = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosClient.post(`${BASE}/favicon`, formData).then((res) => res.data);
};

export const updateStripeSettings = (data) =>
  axiosClient.put(`${BASE}/stripe`, data).then((res) => res.data);

export const createPaymentIntent = (bookingId) =>
  axiosClient.post(`/api/v1/payments/${bookingId}/create-intent`).then((res) => res.data);

export const confirmStripePayment = (paymentIntentId) =>
  axiosClient.post(`/api/v1/payments/stripe/confirm`, { paymentIntentId }).then((res) => res.data);