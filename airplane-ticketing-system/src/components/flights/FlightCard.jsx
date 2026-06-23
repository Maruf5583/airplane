import { Plane, Clock } from 'lucide-react';
import { format } from 'date-fns';
import Badge from '../common/Badge';

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export default function FlightCard({ flight, onSelect, selected }) {
  return (
    <div
      className={`border rounded-xl p-4 sm:p-5 transition-all ${
        selected
          ? 'border-primary-400 bg-primary-50/40 ring-1 ring-primary-200'
          : 'border-slate-100 hover:border-slate-200 hover:shadow-soft'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Airline */}
        <div className="flex items-center gap-3 sm:w-44 flex-shrink-0">
          {flight.airlineLogoUrl ? (
            <img src={flight.airlineLogoUrl} alt={flight.airlineName} className="w-9 h-9 object-contain" />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
              <Plane size={16} className="text-slate-400" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-slate-700">{flight.airlineName}</p>
            <p className="text-xs text-slate-400">
              {flight.flightNumber} · {flight.aircraftModel}
            </p>
          </div>
        </div>

        {/* Route & times */}
        <div className="flex-1 flex items-center justify-between sm:justify-center sm:gap-8">
          <div className="text-center">
            <p className="text-lg font-bold text-slate-800">
              {format(new Date(flight.departureTime), 'h:mm a')}
            </p>
            <p className="text-xs text-slate-400">{flight.originIata}</p>
          </div>

          <div className="flex flex-col items-center px-2">
            <p className="text-xs text-slate-400 flex items-center gap-1 mb-1">
              <Clock size={11} /> {formatDuration(flight.durationMinutes)}
            </p>
            <div className="w-16 sm:w-24 h-px bg-slate-200 relative">
              <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-slate-300" />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="text-center">
            <p className="text-lg font-bold text-slate-800">
              {format(new Date(flight.arrivalTime), 'h:mm a')}
            </p>
            <p className="text-xs text-slate-400">{flight.destinationIata}</p>
          </div>
        </div>

        {/* Price & action */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:w-36 flex-shrink-0 gap-2 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-5">
          <div className="text-right">
            <p className="text-xl font-bold text-primary-700">${flight.totalPrice.toFixed(2)}</p>
            <p className="text-xs text-slate-400">{flight.requestedClass}</p>
          </div>
          <button
            type="button"
            onClick={() => onSelect(flight)}
            className="btn-primary !py-2 !px-4 text-sm"
          >
            {selected ? 'Selected' : 'Select'}
          </button>
        </div>
      </div>

      {flight.status !== 'Scheduled' && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <Badge status={flight.status} />
        </div>
      )}
    </div>
  );
}