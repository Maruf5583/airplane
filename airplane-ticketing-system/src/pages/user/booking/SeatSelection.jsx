import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Plane } from 'lucide-react';
import BookingStepper from '../../../components/bookings/BookingStepper';
import SeatPicker from '../../../components/bookings/SeatPicker';
import Button from '../../../components/common/Button';
import Spinner from '../../../components/common/Spinner';
import { useBookingFlow } from '../../../context/BookingFlowContext';
import { useFlightSeatMap } from '../../../hooks/useFlights';

export default function SeatSelection() {
  const navigate = useNavigate();
  const { bookingDraft, passengers, setPassengers } = useBookingFlow();
  const [activeSegmentIdx, setActiveSegmentIdx] = useState(0);
  const [activePassengerIdx, setActivePassengerIdx] = useState(0);

  useEffect(() => {
    if (!bookingDraft) {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const segments = bookingDraft?.segments || [];
  const activeSegment = segments[activeSegmentIdx];

  const { data: seatMap, isLoading } = useFlightSeatMap(activeSegment?.flightId);

  if (!bookingDraft || !activeSegment) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const getSeatKey = (segIdx) => `segment_${segIdx}_seatId`;

  const handleSelectSeat = (seat) => {
    const next = [...passengers];
    next[activePassengerIdx] = {
      ...next[activePassengerIdx],
      [getSeatKey(activeSegmentIdx)]: seat.id,
      seatId: seat.id, // last selected, used as fallback for single-segment trips
    };
    setPassengers(next);
  };

  const allSeatsAssigned = passengers.every((p) =>
    segments.every((_, segIdx) => p[getSeatKey(segIdx)])
  );

  const handleContinue = () => {
    if (!allSeatsAssigned) return;
    navigate('/booking/review');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <BookingStepper currentStep="seats" />

      {segments.length > 1 && (
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {segments.map((seg, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSegmentIdx(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                idx === activeSegmentIdx
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <Plane size={12} /> Flight {idx + 1}
            </button>
          ))}
        </div>
      )}

      <div className="card mb-5">
        <p className="text-sm font-medium text-slate-600 mb-3">Select passenger to assign a seat:</p>
        <div className="flex gap-2 flex-wrap">
          {passengers.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setActivePassengerIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                idx === activePassengerIdx
                  ? 'bg-primary-600 text-white'
                  : p[getSeatKey(activeSegmentIdx)]
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {p.firstName || `Passenger ${idx + 1}`}
              {p[getSeatKey(activeSegmentIdx)] && ' ✓'}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <SeatPicker
            seats={seatMap?.seats || []}
            selectedSeatId={passengers[activePassengerIdx]?.[getSeatKey(activeSegmentIdx)]}
            onSelect={handleSelectSeat}
            requiredClass={activeSegment.seatClass}
          />
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="secondary" onClick={() => navigate('/booking/passengers')}>
          <ArrowLeft size={16} /> Back
        </Button>
        <Button onClick={handleContinue} disabled={!allSeatsAssigned} size="lg">
          Continue to Review <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}