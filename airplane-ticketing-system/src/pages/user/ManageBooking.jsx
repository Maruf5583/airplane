import { useState } from 'react';
import {
  ClipboardCheck, Search, PlaneTakeoff, PlaneLanding, Calendar,
  Luggage, RefreshCcw, XCircle, Download, ArrowRight, Loader2,
} from 'lucide-react';
import PageHero from '../../components/common/PageHero';

const SAMPLE_BOOKING = {
  pnr: 'SB4X9K',
  passenger: 'Rafiul Islam',
  status: 'Confirmed',
  from: { code: 'DAC', city: 'Dhaka' },
  to: { code: 'DXB', city: 'Dubai' },
  date: '24 Aug 2026',
  time: '10:35 AM',
  flightNo: 'BS 201',
  fare: 'Economy Saver',
  price: '৳45,000',
};

export default function ManageBooking() {
  const [pnr, setPnr] = useState('');
  const [lastName, setLastName] = useState('');
  const [status, setStatus] = useState('idle');
  const [booking, setBooking] = useState(null);

  const handleRetrieve = (e) => {
    e.preventDefault();
    if (!pnr.trim() || !lastName.trim()) return;
    setStatus('loading');
    setTimeout(() => {
      if (pnr.trim().toUpperCase() === SAMPLE_BOOKING.pnr) {
        setBooking(SAMPLE_BOOKING);
        setStatus('found');
      } else {
        setStatus('error');
      }
    }, 900);
  };

  const reset = () => {
    setStatus('idle');
    setBooking(null);
    setPnr('');
    setLastName('');
  };

  return (
    <div className="font-body bg-white">
      <PageHero
        icon={ClipboardCheck}
        eyebrow="Self-service"
        title="Manage your booking"
        subtitle="Retrieve your trip to change flights, add baggage, or request a refund."
        breadcrumb="Manage Booking"
      />

      <div className="max-w-2xl mx-auto px-4 -mt-8 sm:-mt-10 relative z-20 pb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 animate-fade-up [animation-delay:300ms]">
          {status !== 'found' ? (
            <form onSubmit={handleRetrieve} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  Booking reference (PNR)
                </label>
                <input
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value.toUpperCase())}
                  type="text"
                  placeholder="e.g. SB4X9K"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm tracking-wider font-medium text-slate-700 outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/20 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  Passenger last name
                </label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  placeholder="e.g. Islam"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/20 transition-all"
                />
              </div>

              {status === 'error' && (
                <p className="text-xs text-crimson bg-crimson/5 border border-crimson/20 rounded-lg px-3 py-2">
                  We couldn't find a booking with those details. Double-check your PNR and last name, or try the sample code <span className="font-semibold">SB4X9K</span>.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-emerald text-white shadow-sm hover:bg-emerald-dark hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:translate-y-0"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Searching...
                  </>
                ) : (
                  <>
                    <Search size={16} /> Retrieve booking
                  </>
                )}
              </button>
            </form>
          ) : (
            <BookingSummary booking={booking} onReset={reset} />
          )}
        </div>
      </div>
    </div>
  );
}

function BookingSummary({ booking, onReset }) {
  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-xs text-slate-400">Booking reference</span>
          <div className="font-display font-bold text-xl text-slate-800 tracking-wider">{booking.pnr}</div>
        </div>
        <span className="text-xs font-semibold text-emerald bg-emerald/10 px-3 py-1.5 rounded-full">
          {booking.status}
        </span>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-emerald to-emerald-dark text-white p-5 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs opacity-80 mb-1">
              <PlaneTakeoff size={13} /> {booking.date}
            </div>
            <div className="font-display font-bold text-2xl">{booking.from.code}</div>
            <div className="text-xs opacity-80">{booking.from.city}</div>
          </div>
          <ArrowRight size={20} className="opacity-70" />
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5 text-xs opacity-80 mb-1">
              <PlaneLanding size={13} /> {booking.time}
            </div>
            <div className="font-display font-bold text-2xl">{booking.to.code}</div>
            <div className="text-xs opacity-80">{booking.to.city}</div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20 text-xs opacity-90">
          <span>{booking.flightNo} · {booking.fare}</span>
          <span className="font-semibold">{booking.price}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <ActionButton icon={Calendar} label="Change flight" />
        <ActionButton icon={Luggage} label="Add baggage" />
        <ActionButton icon={Download} label="Download ticket" />
        <ActionButton icon={RefreshCcw} label="Request refund" />
      </div>

      <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-crimson border border-crimson/20 hover:bg-crimson/5 transition-colors">
        <XCircle size={15} /> Cancel booking
      </button>

      <button onClick={onReset} className="w-full text-center text-xs text-slate-400 hover:text-emerald mt-4 transition-colors">
        Look up a different booking
      </button>
    </div>
  );
}

function ActionButton({ icon: Icon, label }) {
  return (
    <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:border-emerald/30 hover:text-emerald hover:bg-emerald/5 transition-colors">
      <Icon size={16} /> {label}
    </button>
  );
}