import axiosClient from './axiosClient';

export const ticketsApi = {
  getByBookingId: (bookingId) =>
    axiosClient.get(`/api/v1/tickets/booking/${bookingId}`),

  getByTicketNumber: (ticketNumber) =>
    axiosClient.get(`/api/v1/tickets/${ticketNumber}`),

  download: (ticketNumber) =>
    axiosClient.get(`/api/v1/tickets/${ticketNumber}/download`, {
      responseType: 'blob',
    }),

  getBoardingPass: (ticketNumber) =>
    axiosClient.get(`/api/v1/tickets/${ticketNumber}/boarding-pass`, {
      responseType: 'blob',
    }),

  checkIn: (ticketNumber) =>
    axiosClient.post(`/api/v1/tickets/${ticketNumber}/check-in`),
};