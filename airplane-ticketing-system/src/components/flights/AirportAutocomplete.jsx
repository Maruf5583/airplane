import { useState, useRef, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { useAirportsList } from '../../hooks/useAirlinesAirports';

export default function AirportAutocomplete({ label, value, onChange, placeholder }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const { data } = useAirportsList({ SearchTerm: query, PageSize: 8 });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (airport) => {
    onChange(airport);
    setQuery('');
    setOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
    setQuery('');
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="label-text">{label}</label>
      <div
        className="input-field flex items-center gap-2 cursor-text"
        onClick={() => setOpen(true)}
      >
        <MapPin size={16} className="text-slate-400 flex-shrink-0" />
        {value && !open ? (
          <div className="flex items-center justify-between w-full">
            <span className="text-slate-800 font-medium text-sm truncate">
              {value.city} ({value.iataCode})
            </span>
            <button type="button" onClick={handleClear} className="text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          </div>
        ) : (
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full outline-none bg-transparent text-sm"
          />
        )}
      </div>

      {open && (data?.items?.length > 0) && (
        <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-soft border border-slate-100 py-2 z-40 max-h-72 overflow-y-auto">
          {data.items.map((airport) => (
            <button
              key={airport.id}
              type="button"
              onClick={() => handleSelect(airport)}
              className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {airport.city}, {airport.country}
                </p>
                <p className="text-xs text-slate-400">{airport.name}</p>
              </div>
              <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                {airport.iataCode}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}