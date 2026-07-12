import { useState } from 'react';
import { ArrowLeftRight, Plus, Trash2, Search } from 'lucide-react';
import clsx from 'clsx';
import AirportAutocomplete from './AirportAutocomplete';
import PassengerCountPicker from './PassengerCountPicker';
import Select from '../common/Select';
import Input from '../common/Input';
import Button from '../common/Button';

const TABS = [
  { key: 'one-way', label: 'One Way' },
  { key: 'round-trip', label: 'Round Trip' },
  { key: 'multi-city', label: 'Multi-City' },
];

const SEAT_CLASS_OPTIONS = [
  { value: 'Economy', label: 'Economy' },
  { value: 'Business', label: 'Business' },
  { value: 'First', label: 'First Class' },
];

const todayStr = () => new Date().toISOString().split('T')[0];

export default function FlightSearchForm({ onSearch, isSearching }) {
  const [tab, setTab] = useState('one-way');
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [departureDate, setDepartureDate] = useState(todayStr());
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
  const [seatClass, setSeatClass] = useState('Economy');
  const [legs, setLegs] = useState([
    { origin: null, destination: null, departureDate: todayStr() },
    { origin: null, destination: null, departureDate: todayStr() },
  ]);

  const swapOriginDestination = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const addLeg = () => {
    setLegs([...legs, { origin: null, destination: null, departureDate: todayStr() }]);
  };

  const removeLeg = (idx) => {
    if (legs.length <= 2) return;
    setLegs(legs.filter((_, i) => i !== idx));
  };

  const updateLeg = (idx, field, val) => {
    const next = [...legs];
    next[idx] = { ...next[idx], [field]: val };
    setLegs(next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (tab === 'multi-city') {
      const validLegs = legs.filter((l) => l.origin && l.destination);
      if (validLegs.length < 2) return;

      onSearch('multi-city', {
        legs: validLegs.map((l) => ({
          originIata: l.origin.iataCode,
          destinationIata: l.destination.iataCode,
          departureDate: l.departureDate,
        })),
        passengers,
        seatClass,
      });
      return;
    }

    if (!origin || !destination) return;

    const payload = {
      originIata: origin.iataCode,
      destinationIata: destination.iataCode,
      departureDate,
      returnDate: tab === 'round-trip' ? returnDate : null,
      passengers,
      seatClass,
      maxStops: 2,
      sortBy: 'price',
      sortDescending: false,
    };

    onSearch(tab === 'round-trip' ? 'round-trip' : 'one-way', payload);
  };

  return (
    // No shadow/border/bg here — Home.jsx already wraps this in its own
    // "bg-white rounded-2xl shadow-xl border border-slate-100" card.
    // Keeping both stacked was creating a visible double-card/double-shadow look.
    <div className="p-3 sm:p-4">
      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
              tab === t.key ? 'bg-white text-emerald shadow-sm' : 'text-slate-500 hover:text-emerald'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {tab !== 'multi-city' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 relative">
              <AirportAutocomplete
                label="From"
                value={origin}
                onChange={setOrigin}
                placeholder="City or airport"
              />
              <AirportAutocomplete
                label="To"
                value={destination}
                onChange={setDestination}
                placeholder="City or airport"
              />
              <button
                type="button"
                onClick={swapOriginDestination}
                className="hidden sm:flex absolute left-1/2 top-9 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 items-center justify-center text-slate-400 hover:text-emerald hover:border-emerald/30 transition-colors duration-200 z-10"
              >
                <ArrowLeftRight size={14} />
              </button>
            </div>

            <div
              className={clsx(
                'grid gap-4 mb-4',
                tab === 'round-trip' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-1'
              )}
            >
              <Input
                label="Departure"
                type="date"
                min={todayStr()}
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                required
              />
              {tab === 'round-trip' && (
                <Input
                  label="Return"
                  type="date"
                  min={departureDate}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                />
              )}
            </div>
          </>
        ) : (
          <div className="space-y-3 mb-4">
            {legs.map((leg, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-3 p-3 bg-slate-50 rounded-xl items-end"
              >
                <AirportAutocomplete
                  label={`Leg ${idx + 1} - From`}
                  value={leg.origin}
                  onChange={(val) => updateLeg(idx, 'origin', val)}
                  placeholder="City or airport"
                />
                <AirportAutocomplete
                  label="To"
                  value={leg.destination}
                  onChange={(val) => updateLeg(idx, 'destination', val)}
                  placeholder="City or airport"
                />
                <Input
                  label="Date"
                  type="date"
                  min={todayStr()}
                  value={leg.departureDate}
                  onChange={(e) => updateLeg(idx, 'departureDate', e.target.value)}
                  required
                />
                {legs.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeLeg(idx)}
                    className="p-2.5 rounded-lg text-crimson hover:bg-crimson/5 transition-colors duration-200 h-fit"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addLeg}
              className="flex items-center gap-1.5 text-sm font-medium text-emerald hover:text-emerald-dark transition-colors duration-200"
            >
              <Plus size={15} /> Add another flight
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <PassengerCountPicker value={passengers} onChange={setPassengers} />
          <Select
            label="Class"
            options={SEAT_CLASS_OPTIONS}
            value={seatClass}
            onChange={(e) => setSeatClass(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          icon={Search}
          size="lg"
          className="w-full !bg-emerald hover:!bg-emerald-dark"
          isLoading={isSearching}
        >
          Search Flights
        </Button>
      </form>
    </div>
  );
}