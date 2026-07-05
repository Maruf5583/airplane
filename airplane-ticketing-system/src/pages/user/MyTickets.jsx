import { useState } from 'react';
import { Ticket as TicketIcon } from 'lucide-react';
import { useBookingsList } from '../../hooks/useBookings';
import { useTicketByNumber, useTicketsByBooking } from '../../hooks/useTickets';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import TicketCard from '../../components/tickets/TicketCard';

function TicketLookup() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [searchedNumber, setSearchedNumber] = useState('');
  const { data: ticket, isLoading, isError } = useTicketByNumber(searchedNumber);

  return (
    <div className="card mb-6">
      <h3 className="font-semibold text-slate-800 mb-3">Look up a ticket by number</h3>
      <div className="flex gap-2">
        <Input
          placeholder="e.g. TKT-2024-00123"
          value={ticketNumber}
          onChange={(e) => setTicketNumber(e.target.value)}
          containerClassName="flex-1"
        />
        <Button onClick={() => setSearchedNumber(ticketNumber)} disabled={!ticketNumber}>
          Look Up
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      )}
      {isError && (
        <p className="text-sm text-red-500 mt-3">Ticket not found. Check the number and try again.</p>
      )}
      {ticket && (
        <div className="mt-4">
          <TicketCard ticket={ticket} />
        </div>
      )}
    </div>
  );
}

function BookingTicketsGroup({ bookingId, reference }) {
  const { data: tickets, isLoading } = useTicketsByBooking(bookingId);

  if (isLoading) return null;
  if (!tickets || tickets.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
        Booking {reference}
      </p>
      <div className="space-y-3">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
}

export default function MyTickets() {
  const { data, isLoading } = useBookingsList({ PageSize: 50 });

  const confirmedBookings = (data?.items || []).filter(
  (b) => b.status === 'Confirmed' || b.status === 2
);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">My Tickets</h1>
      <p className="text-slate-500 text-sm mb-6">
        Browse tickets from your confirmed bookings, or look one up directly
      </p>

      <TicketLookup />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : confirmedBookings.length === 0 ? (
        <EmptyState
          icon={TicketIcon}
          title="No confirmed bookings yet"
          description="Once a booking is confirmed, its tickets will be available here."
        />
      ) : (
        <div className="space-y-6">
          {confirmedBookings.map((booking) => (
            <BookingTicketsGroup key={booking.id} bookingId={booking.id} reference={booking.bookingReference} />
          ))}
        </div>
      )}
    </div>
  );
}