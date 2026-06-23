import { useState } from 'react';
import { Users, Plus, Minus, ChevronDown } from 'lucide-react';

export default function PassengerCountPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const update = (field, delta) => {
    const next = { ...value, [field]: Math.max(field === 'adults' ? 1 : 0, value[field] + delta) };
    onChange(next);
  };

  const total = value.adults + value.children + value.infants;

  const ROWS = [
    { key: 'adults', label: 'Adults', sub: '12+ years', min: 1 },
    { key: 'children', label: 'Children', sub: '2-11 years', min: 0 },
    { key: 'infants', label: 'Infants', sub: 'Under 2 years', min: 0 },
  ];

  return (
    <div className="relative">
      <label className="label-text">Passengers</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="input-field flex items-center justify-between text-left"
      >
        <span className="flex items-center gap-2">
          <Users size={16} className="text-slate-400" />
          {total} {total === 1 ? 'Passenger' : 'Passengers'}
        </span>
        <ChevronDown size={16} className="text-slate-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 left-0 w-72 bg-white rounded-xl shadow-soft border border-slate-100 p-4 z-40 space-y-4">
            {ROWS.map((row) => (
              <div key={row.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">{row.label}</p>
                  <p className="text-xs text-slate-400">{row.sub}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => update(row.key, -1)}
                    disabled={value[row.key] <= row.min}
                    className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 disabled:opacity-30 hover:bg-slate-50"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-5 text-center text-sm font-medium">{value[row.key]}</span>
                  <button
                    type="button"
                    onClick={() => update(row.key, 1)}
                    className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full btn-primary !py-2 mt-2"
            >
              Done
            </button>
          </div>
        </>
      )}
    </div>
  );
}