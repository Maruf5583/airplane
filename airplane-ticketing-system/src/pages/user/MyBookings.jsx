import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Search, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useBookingsList, useCancelBooking } from '../../hooks/useBookings';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import BookingDetailModal from '../../components/admin/BookingDetailModal';

export default function MyBookings() {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [detailModal, setDetailModal] = useState({ open: false, bookingId: null });

  const { data, isLoading } = useBookingsList({
    PageNumber: pageNumber,
    PageSize: 8,
    SearchTerm: searchTerm || undefined,
  });

  const cancelBooking = useCancelBooking();

  const handleCancel = (booking) => {
    const reason = window.prompt('Reason for cancellation (optional):');
    if (reason !== null) {
      cancelBooking.mutate({ id: booking.id, reason });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Bookings</h1>
          <p className="text-slate-500 text-sm mt-1">View and manage your flight bookings</p>
        </div>
        <Input
          icon={Search}
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPageNumber(1);
          }}
          containerClassName="max-w-xs"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : !data?.items || data.items.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No bookings yet"
          description="Start by searching for a flight on the home page."
          action={<Link to="/"><Button>Search Flights</Button></Link>}
        />
      ) : (
        <div className="space-y-3">
          {data.items.map((booking) => (
            <div key={booking.id} className="card">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono font-semibold text-slate-800">
                      {booking.bookingReference}
                    </span>
                    <Badge status={booking.status} />
                  </div>
                  <p className="text-sm text-slate-500">
                    {booking.tripType} · {booking.segments?.length || 0} flight
                    {booking.segments?.length !== 1 ? 's' : ''} · Booked{' '}
                    {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-primary-700">
                    {booking.currencyCode} {booking.totalAmount.toFixed(2)}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Eye}
                    onClick={() => setDetailModal({ open: true, bookingId: booking.id })}
                  >
                    Details
                  </Button>
                  {booking.status === 'Confirmed' && (
                    <Link to={`/booking/${booking.id}/tickets`}>
                      <Button size="sm">Tickets</Button>
                    </Link>
                  )}
                  {(booking.status === 'Confirmed' || booking.status === 'PendingPayment') && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancel(booking)}
                      isLoading={cancelBooking.isPending}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <Pagination
            pageNumber={data.pageNumber}
            totalPages={data.totalPages}
            hasNextPage={data.hasNextPage}
            hasPreviousPage={data.hasPreviousPage}
            onPageChange={setPageNumber}
          />
        </div>
      )}

      <BookingDetailModal
        isOpen={detailModal.open}
        onClose={() => setDetailModal({ open: false, bookingId: null })}
        bookingId={detailModal.bookingId}
      />
    </div>
  );
}