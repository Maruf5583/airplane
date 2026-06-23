import Modal from '../common/Modal';
import Badge from '../common/Badge';
import Spinner from '../common/Spinner';
import { useBooking } from '../../hooks/useBookings';
import { format } from 'date-fns';

export default function BookingDetailModal({ isOpen, onClose, bookingId }) {
  const { data: booking, isLoading } = useBooking(isOpen ? bookingId : null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Booking Details" size="lg">
      {isLoading || !booking ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Booking Reference</p>
              <p className="font-mono font-semibold text-slate-800 text-lg">
                {booking.bookingReference}
              </p>
            </div>
            <Badge status={booking.status} />
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="text-xs text-slate-400">Trip Type</p>
              <p className="font-medium text-slate-700">{booking.tripType}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Total Amount</p>
              <p className="font-medium text-slate-700">
                {booking.currencyCode} {booking.totalAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Discount</p>
              <p className="font-medium text-slate-700">
                {booking.discountAmount > 0 ? `-${booking.discountAmount.toFixed(2)}` : '—'}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Flight Segments</h4>
            <div className="space-y-2">
              {booking.segments?.map((seg) => (
                <div key={seg.id} className="border border-slate-100 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">
                      {seg.flightNumber} · {seg.originIata} → {seg.destinationIata}
                    </p>
                    <p className="text-xs text-slate-400">
                      {format(new Date(seg.departureTime), 'MMM d, yyyy · h:mm a')}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge status={seg.seatClass} />
                    <p className="text-xs text-slate-400 mt-1">${seg.segmentTotal.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Passengers</h4>
            <div className="space-y-2">
              {booking.passengers?.map((p) => (
                <div key={p.id} className="border border-slate-100 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">{p.fullName}</p>
                    <p className="text-xs text-slate-400">{p.passengerType}</p>
                  </div>
                  <span className="text-sm text-slate-500">Seat {p.seatNumber || '—'}</span>
                </div>
              ))}
            </div>
          </div>

          {booking.payment && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Payment</h4>
              <div className="border border-slate-100 rounded-lg p-3 flex items-center justify-between">
                <Badge status={booking.payment.status} />
                <span className="text-sm font-medium text-slate-700">
                  ${booking.payment.amount.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}