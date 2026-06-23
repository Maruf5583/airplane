import clsx from 'clsx';

export default function SeatPicker({ seats, selectedSeatId, onSelect, requiredClass }) {
  const seatStyle = (seat) => {
    const isSelected = seat.id === selectedSeatId;
    if (!seat.isAvailable) return 'bg-slate-100 text-slate-300 cursor-not-allowed border-slate-100';
    if (isSelected) return 'bg-primary-600 text-white border-primary-600 scale-105';
    if (seat.seatClass === 'First') return 'bg-violet-50 text-violet-700 border-violet-200 hover:border-violet-400';
    if (seat.seatClass === 'Business') return 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400';
  };

  const relevantSeats = requiredClass ? seats.filter((s) => s.seatClass === requiredClass) : seats;

  return (
    <div>
      <div className="flex items-center gap-4 mb-4 text-xs flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-primary-600" /> Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-slate-100" /> Occupied
        </span>
      </div>
      <div className="grid grid-cols-6 gap-2 max-h-80 overflow-y-auto p-1 border border-slate-100 rounded-xl">
        {relevantSeats.map((seat) => (
          <button
            key={seat.id}
            type="button"
            disabled={!seat.isAvailable}
            onClick={() => onSelect(seat)}
            title={`${seat.seatNumber}${seat.extraLegroom ? ' • Extra legroom' : ''}${
              seat.isWindowSeat ? ' • Window' : ''
            }${seat.isAisleSeat ? ' • Aisle' : ''}`}
            className={clsx(
              'border-2 rounded-lg py-2.5 text-center text-xs font-semibold transition-all',
              seatStyle(seat)
            )}
          >
            {seat.seatNumber}
          </button>
        ))}
      </div>
    </div>
  );
}