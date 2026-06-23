import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Download, Ticket } from 'lucide-react';
import Button from '../../../components/common/Button';

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId } = location.state || {};

  if (!bookingId) {
    navigate('/');
    return null;
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 size={32} className="text-emerald-600" />
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed!</h1>
      <p className="text-slate-500 mb-8">
        Your payment was successful and your tickets are ready.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to={`/booking/${bookingId}/tickets`}>
          <Button size="lg" icon={Ticket} className="w-full sm:w-auto">
            View My Tickets
          </Button>
        </Link>
        <Link to="/my-bookings">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            Go to My Bookings
          </Button>
        </Link>
      </div>
    </div>
  );
}