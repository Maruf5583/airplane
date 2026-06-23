import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';

export default function SearchSummaryBar({ searchPayload, searchType, resultCount }) {
  const navigate = useNavigate();

  const totalPassengers = searchPayload?.passengers
    ? searchPayload.passengers.adults + searchPayload.passengers.children + searchPayload.passengers.infants
    : searchPayload?.legs
    ? 1
    : 1;

  const routeLabel = searchPayload?.legs
    ? `${searchPayload.legs.length}-city trip`
    : `${searchPayload?.originIata} → ${searchPayload?.destinationIata}`;

  return (
    <div className="bg-white border-b border-slate-100 sticky top-16 z-20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft size={15} /> Modify search
        </button>

        <div className="flex items-center gap-4 text-sm">
          <span className="font-medium text-slate-700">{routeLabel}</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Users size={13} /> {totalPassengers}
          </span>
          <span className="text-slate-400">
            {resultCount} {resultCount === 1 ? 'result' : 'results'}
          </span>
        </div>
      </div>
    </div>
  );
}