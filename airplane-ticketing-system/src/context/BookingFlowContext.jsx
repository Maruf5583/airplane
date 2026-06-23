import { createContext, useContext, useState } from 'react';

const BookingFlowContext = createContext(null);

export function BookingFlowProvider({ children }) {
  const [bookingDraft, setBookingDraft] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [createdBooking, setCreatedBooking] = useState(null);

  const resetFlow = () => {
    setBookingDraft(null);
    setPassengers([]);
    setPromoCode('');
    setCreatedBooking(null);
  };

  const value = {
    bookingDraft,
    setBookingDraft,
    passengers,
    setPassengers,
    promoCode,
    setPromoCode,
    createdBooking,
    setCreatedBooking,
    resetFlow,
  };

  return <BookingFlowContext.Provider value={value}>{children}</BookingFlowContext.Provider>;
}

export function useBookingFlow() {
  const context = useContext(BookingFlowContext);
  if (!context) {
    throw new Error('useBookingFlow must be used within BookingFlowProvider');
  }
  return context;
}