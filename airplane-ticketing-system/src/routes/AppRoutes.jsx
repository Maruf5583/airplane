import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import AdminLayout from '../layouts/AdminLayout';
import AgentLayout from '../layouts/AgentLayout';
import UserLayout from '../layouts/UserLayout';

// Shared pages
import Unauthorized from '../pages/Unauthorized';
import NotFound from '../pages/NotFound';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Admin pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminFlights from '../pages/admin/Flights';
import AdminAirlines from '../pages/admin/Airlines';
import AdminAirports from '../pages/admin/Airports';
import AdminBookings from '../pages/admin/Bookings';
import AdminPayments from '../pages/admin/Payments';
import AdminUsers from '../pages/admin/Users';
import AdminAuditLogs from '../pages/admin/AuditLogs';
import SettingsPage from '../pages/admin/SettingsPage';

// Agent pages
import AgentDashboard from '../pages/agent/Dashboard';
import AgentCreateBooking from '../pages/agent/CreateBooking';
import AgentSearchResults from '../pages/agent/AgentSearchResults';
import AgentManageBookings from '../pages/agent/ManageBookings';

// User (Passenger) pages
import Home from '../pages/user/Home';
import SearchResults from '../pages/user/SearchResults';
import MyBookings from '../pages/user/MyBookings';
import MyTickets from '../pages/user/MyTickets';
import Profile from '../pages/user/Profile';

// Booking flow pages (shared between Passenger and Agent flows)
import PassengerDetails from '../pages/user/booking/PassengerDetails';
import SeatSelection from '../pages/user/booking/SeatSelection';
import ReviewBooking from '../pages/user/booking/ReviewBooking';
import Payment from '../pages/user/booking/Payment';
import BookingConfirmation from '../pages/user/booking/BookingConfirmation';
import BookingTickets from '../pages/user/booking/BookingTickets';



import About from "../pages/user/About";
import Contact from "../pages/user/Contact";



import Offers from '../pages/user/Offers';
import HelpCenter from '../pages/user/HelpCenter';
import ManageBooking from '../pages/user/ManageBooking';
import FAQ from '../pages/user/FAQ';
import TermsOfService from '../pages/user/TermsOfService';
import PrivacyPolicy from '../pages/user/PrivacyPolicy';



export default function AppRoutes() {
  return (
    <Routes>
      {/* ===== Auth routes (public) ===== */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ===== Admin routes ===== */}
      <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="flights" element={<AdminFlights />} />
          <Route path="airlines" element={<AdminAirlines />} />
          <Route path="airports" element={<AdminAirports />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
          <Route path="settings" element={<SettingsPage />} /> 
        </Route>
      </Route>

      {/* ===== Agent routes ===== */}
      <Route element={<ProtectedRoute allowedRoles={['Agent']} />}>
        <Route path="/agent" element={<AgentLayout />}>
          <Route index element={<Navigate to="/agent/dashboard" replace />} />
          <Route path="dashboard" element={<AgentDashboard />} />
          <Route path="create-booking" element={<AgentCreateBooking />} />
          <Route path="search-results" element={<AgentSearchResults />} />
          <Route path="bookings" element={<AgentManageBookings />} />
        </Route>
      </Route>

      {/* ===== Passenger routes (public layout, some pages need auth) ===== */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="search-results" element={<SearchResults />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      
        <Route path="offers" element={<Offers />} />
     <Route path="support/help-center" element={<HelpCenter />} />
<Route path="support/manage-booking" element={<ManageBooking />} />
<Route path="support/faq" element={<FAQ />} />
<Route path="legal/terms-of-service" element={<TermsOfService />} />
<Route path="legal/privacy-policy" element={<PrivacyPolicy />} />

        {/* These require a logged-in passenger */}
        <Route element={<ProtectedRoute allowedRoles={['Passenger', 'Agent', 'Admin']} />}>
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="my-tickets" element={<MyTickets />} />
          <Route path="profile" element={<Profile />} />

          {/* Booking flow */}
          <Route path="booking/passengers" element={<PassengerDetails />} />
          <Route path="booking/seats" element={<SeatSelection />} />
          <Route path="booking/review" element={<ReviewBooking />} />
          <Route path="booking/payment" element={<Payment />} />
          <Route path="booking/confirmation" element={<BookingConfirmation />} />
          <Route path="booking/:bookingId/tickets" element={<BookingTickets />} />
        </Route>
      </Route>

      {/* ===== Fallbacks ===== */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}