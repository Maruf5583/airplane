import Modal from '../common/Modal';
import Spinner from '../common/Spinner';
import { useFlightSeatMap } from '../../hooks/useFlights';
import clsx from 'clsx';

export default function SeatMapModal({ isOpen, onClose, flightId, flightNumber }) {
  const { data, isLoading } = useFlightSeatMap(flightId, isOpen);

  const seatStyle = (seat) => {
    if (!seat.isAvailable) return 'bg-slate-200 text-slate-400 cursor-not-allowed';
    if (seat.seatClass === 'First') return 'bg-violet-100 text-violet-700 border-violet-300';
    if (seat.seatClass === 'Business') return 'bg-blue-100 text-blue-700 border-blue-300';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Seat Map — ${flightNumber || ''}`} size="lg">
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-violet-100 border border-violet-300" /> First
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-100 border border-blue-300" /> Business
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200" /> Economy
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-200" /> Occupied
            </span>
          </div>
          <div className="grid grid-cols-6 gap-2 max-h-96 overflow-y-auto p-1">
            {(data?.seats || []).map((seat) => (
              <div
                key={seat.id}
                title={`${seat.seatNumber} • ${seat.seatClass}${
                  seat.extraLegroom ? ' • Extra legroom' : ''
                }`}
                className={clsx(
                  'border rounded-lg py-2 text-center text-xs font-medium',
                  seatStyle(seat)
                )}
              >
                {seat.seatNumber}
              </div>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
}