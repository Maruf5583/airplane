import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plane, ArrowRight, Check } from 'lucide-react';
import FlightCard from '../../components/flights/FlightCard';
import SearchSummaryBar from '../../components/flights/SearchSummaryBar';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, searchType, searchPayload } = location.state || {};

  const [selectedOneWay, setSelectedOneWay] = useState(null);
  const [selectedRoundTrip, setSelectedRoundTrip] = useState(null);
  const [selectedMultiCity, setSelectedMultiCity] = useState(null);

  if (!results) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <EmptyState
          icon={Plane}
          title="No search data"
          description="Please start a new search from the home page."
          action={
            <Button onClick={() => navigate('/')} className="!bg-emerald hover:!bg-emerald-dark">
              Back to Search
            </Button>
          }
        />
      </div>
    );
  }

  const handleContinue = () => {
    let bookingDraft = null;

    if (searchType === 'one-way' && selectedOneWay) {
      bookingDraft = {
        tripType: 'OneWay',
        segments: [{ flightId: selectedOneWay.id, seatClass: selectedOneWay.requestedClass }],
      };
    } else if (searchType === 'round-trip' && selectedRoundTrip) {
      bookingDraft = {
        tripType: 'RoundTrip',
        segments: [
          { flightId: selectedRoundTrip.outboundFlight.id, seatClass: selectedRoundTrip.outboundFlight.requestedClass },
          { flightId: selectedRoundTrip.returnFlight.id, seatClass: selectedRoundTrip.returnFlight.requestedClass },
        ],
      };
    } else if (searchType === 'multi-city' && selectedMultiCity) {
      bookingDraft = {
        tripType: 'MultiCity',
        segments: selectedMultiCity.flights.map((f) => ({
          flightId: f.id,
          seatClass: f.requestedClass,
        })),
      };
    }

    if (bookingDraft) {
      navigate('/booking/passengers', { state: { bookingDraft } });
    }
  };

  const hasSelection = selectedOneWay || selectedRoundTrip || selectedMultiCity;

  return (
    <div className="bg-white min-h-screen">
      <SearchSummaryBar
        searchPayload={searchPayload}
        searchType={searchType}
        resultCount={results.length}
      />

      <div className="max-w-4xl mx-auto px-4 py-6 pb-28">
        {results.length === 0 ? (
          <EmptyState
            icon={Plane}
            title="No flights found"
            description="Try adjusting your dates, route, or filters."
            action={
              <Button onClick={() => navigate('/')} className="!bg-emerald hover:!bg-emerald-dark">
                New Search
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {/* ONE-WAY */}
            {searchType === 'one-way' &&
              results.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  selected={selectedOneWay?.id === flight.id}
                  onSelect={setSelectedOneWay}
                />
              ))}

            {/* ROUND-TRIP */}
            {searchType === 'round-trip' &&
              results.map((pair, idx) => {
                const isSelected = selectedRoundTrip === pair;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl p-5 bg-white transition-all duration-200 ${
                      isSelected
                        ? 'ring-2 ring-emerald border border-emerald/30'
                        : 'border border-slate-100 hover:border-emerald/20'
                    }`}
                  >
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Outbound
                    </p>
                    <FlightCard flight={pair.outboundFlight} onSelect={() => {}} selected />
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-4 mb-2">
                      Return
                    </p>
                    <FlightCard flight={pair.returnFlight} onSelect={() => {}} selected />

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                      <p className="text-lg font-display font-bold text-emerald">
                        Total: ${pair.totalPrice.toFixed(2)}
                      </p>
                      <button
                        onClick={() => setSelectedRoundTrip(pair)}
                        className={`flex items-center gap-1.5 py-2 px-5 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isSelected
                            ? 'bg-emerald/10 text-emerald'
                            : 'bg-emerald text-white hover:bg-emerald-dark hover:-translate-y-0.5'
                        }`}
                      >
                        {isSelected && <Check size={15} />}
                        {isSelected ? 'Selected' : 'Select This Trip'}
                      </button>
                    </div>
                  </div>
                );
              })}

            {/* MULTI-CITY */}
            {searchType === 'multi-city' &&
              results.map((trip, idx) => {
                const isSelected = selectedMultiCity === trip;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl p-5 bg-white transition-all duration-200 ${
                      isSelected
                        ? 'ring-2 ring-emerald border border-emerald/30'
                        : 'border border-slate-100 hover:border-emerald/20'
                    }`}
                  >
                    <div className="space-y-3">
                      {trip.flights.map((flight, fIdx) => (
                        <div key={fIdx}>
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Flight {fIdx + 1}
                          </p>
                          <FlightCard flight={flight} onSelect={() => {}} selected />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                      <p className="text-lg font-display font-bold text-emerald">
                        Total: ${trip.totalPrice.toFixed(2)}
                      </p>
                      <button
                        onClick={() => setSelectedMultiCity(trip)}
                        className={`flex items-center gap-1.5 py-2 px-5 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isSelected
                            ? 'bg-emerald/10 text-emerald'
                            : 'bg-emerald text-white hover:bg-emerald-dark hover:-translate-y-0.5'
                        }`}
                      >
                        {isSelected && <Check size={15} />}
                        {isSelected ? 'Selected' : 'Select This Trip'}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Sticky continue bar */}
      {hasSelection && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-100 p-4 z-30 animate-fade-up [animation-duration:0.25s]">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <p className="text-sm text-slate-500 flex items-center gap-1.5">
              <Check size={15} className="text-emerald" /> Flight selected — ready to continue
            </p>
            <button
              onClick={handleContinue}
              className="flex items-center gap-2 bg-emerald hover:bg-emerald-dark text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              Continue to Passenger Details <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}