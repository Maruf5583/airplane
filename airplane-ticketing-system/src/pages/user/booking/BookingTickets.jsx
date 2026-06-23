import { useParams, useNavigate } from 'react-router-dom';
import { Ticket as TicketIcon } from 'lucide-react';
import { useTicketsByBooking } from '../../../hooks/useTickets';
import TicketCard from '../../../components/tickets/TicketCard';
import Spinner from '../../../components/common/Spinner';
import EmptyState from '../../../components/common/EmptyState';
import Button from '../../../components/common/Button';

export default function BookingTickets() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { data: tickets, isLoading } = useTicketsByBooking(bookingId);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Your Tickets</h1>
      <p className="text-slate-500 text-sm mb-6">Download or check in for each ticket below</p>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : !tickets || tickets.length === 0 ? (
        <EmptyState
          icon={TicketIcon}
          title="No tickets found"
          description="Tickets will appear here once your booking is confirmed."
          action={<Button onClick={() => navigate('/my-bookings')}>Go to My Bookings</Button>}
        />
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}