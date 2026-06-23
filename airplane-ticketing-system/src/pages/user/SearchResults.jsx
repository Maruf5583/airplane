import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plane, ArrowRight } from 'lucide-react';
import FlightCard from '../../components/flights/FlightCard';
import SearchSummaryBar from '../../components/flights/SearchSummaryBar';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, searchType, searchPayload } = location.state || {};

  // ... rest of the component is identical to above, starting from useState lines

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
          action={<Button onClick={() => navigate('/')}>Back to Search</Button>}
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
    <div>
      <SearchSummaryBar
        searchPayload={searchPayload}
        searchType={searchType}
        resultCount={results.length}
      />

      <div className="max-w-5xl mx-auto px-4 py-6 pb-28">
        {results.length === 0 ? (
          <EmptyState
            icon={Plane}
            title="No flights found"
            description="Try adjusting your dates, route, or filters."
            action={<Button onClick={() => navigate('/')}>New Search</Button>}
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
              results.map((pair, idx) => (
                <div
                  key={idx}
                  className={`border rounded-xl p-4 ${
                    selectedRoundTrip === pair
                      ? 'border-primary-400 ring-1 ring-primary-200'
                      : 'border-slate-100'
                  }`}
                >
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                    Outbound
                  </p>
                  <FlightCard flight={pair.outboundFlight} onSelect={() => {}} selected />
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-3 mb-2">
                    Return
                  </p>
                  <FlightCard flight={pair.returnFlight} onSelect={() => {}} selected />

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                    <p className="text-lg font-bold text-primary-700">
                      Total: ${pair.totalPrice.toFixed(2)}
                    </p>
                    <button
                      onClick={() => setSelectedRoundTrip(pair)}
                      className="btn-primary !py-2 !px-5 text-sm"
                    >
                      {selectedRoundTrip === pair ? 'Selected' : 'Select This Trip'}
                    </button>
                  </div>
                </div>
              ))}

            {/* MULTI-CITY */}
            {searchType === 'multi-city' &&
              results.map((trip, idx) => (
                <div
                  key={idx}
                  className={`border rounded-xl p-4 ${
                    selectedMultiCity === trip
                      ? 'border-primary-400 ring-1 ring-primary-200'
                      : 'border-slate-100'
                  }`}
                >
                  <div className="space-y-3">
                    {trip.flights.map((flight, fIdx) => (
                      <div key={fIdx}>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                          Flight {fIdx + 1}
                        </p>
                        <FlightCard flight={flight} onSelect={() => {}} selected />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                    <p className="text-lg font-bold text-primary-700">
                      Total: ${trip.totalPrice.toFixed(2)}
                    </p>
                    <button
                      onClick={() => setSelectedMultiCity(trip)}
                      className="btn-primary !py-2 !px-5 text-sm"
                    >
                      {selectedMultiCity === trip ? 'Selected' : 'Select This Trip'}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Sticky continue bar */}
      {hasSelection && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-30">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <p className="text-sm text-slate-500">Flight selected — ready to continue</p>
            <Button onClick={handleContinue} size="lg">
              Continue to Passenger Details <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}