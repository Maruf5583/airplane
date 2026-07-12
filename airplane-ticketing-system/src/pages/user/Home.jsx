import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Clock, HeadphonesIcon, MapPin, Star, TrendingUp,
  Users, PlaneTakeoff, Percent, ChevronLeft, ChevronRight,
} from 'lucide-react';
import FlightSearchForm from '../../components/flights/FlightSearchForm';
import useInView from '../../hooks/useInView';
import useCountUp from '../../hooks/useCountUp';
import {
  useSearchOneWay,
  useSearchRoundTrip,
  useSearchMultiCity,
} from '../../hooks/useSearch';

const FEATURES = [
  { icon: Shield, title: 'Secure Booking', desc: 'Your payments and data are always protected' },
  { icon: Clock, title: 'Real-Time Updates', desc: 'Live flight status and instant notifications' },
  { icon: HeadphonesIcon, title: '24/7 Support', desc: "We're here whenever you need us" },
];

const STATS = [
  { value: 500000, suffix: '+', label: 'Happy travelers' },
  { value: 120, suffix: '+', label: 'Destinations' },
  { value: 4.8, suffix: '/5', label: 'Average rating', decimal: true },
  { value: 24, suffix: '/7', label: 'Customer support' },
];

const DESTINATIONS = [
  { city: 'Makkah', country: 'Saudi Arabia', price: '৳52,000', rating: 4.9, bookedToday: 210, trending: true, img: '/Images/makkah.jpg' },
  { city: 'Dubai', country: 'UAE', price: '৳45,000', rating: 4.7, bookedToday: 142, trending: true, img: '/Images/dubai.jpg' },
  { city: 'Bangkok', country: 'Thailand', price: '৳28,000', rating: 4.6, bookedToday: 98, trending: false, img: '/Images/bankok.jpg' },
  { city: 'Kuala Lumpur', country: 'Malaysia', price: '৳22,000', rating: 4.5, bookedToday: 76, trending: false, img: '/Images/malaysia.wep' },
  { city: 'Kathmandu', country: 'Nepal', price: '৳19,000', rating: 4.6, bookedToday: 64, trending: false, img: '/Images/nepal.jpg' },
  { city: 'London', country: 'UK', price: '৳98,000', rating: 4.8, bookedToday: 54, trending: false, img: '/Images/london.jpg' },
];

const OFFERS = [
  {
    title: 'Save 20% on Dhaka → Dubai',
    desc: 'Book before 31 July, travel any time this year',
    icon: Percent,
    theme: 'from-emerald to-emerald-dark',
  },
  {
    title: 'Family package deals',
    desc: 'Kids under 12 fly at half price on all routes',
    icon: Users,
    theme: 'from-crimson to-rose-700',
  },
];

const TESTIMONIALS = [
  { name: 'Rafiul Islam', text: 'Booking was smooth and the price was the best I found anywhere.', rating: 5 },
  { name: 'Nusrat Jahan', text: 'Customer support helped me rebook instantly after a delay.', rating: 5 },
  { name: 'Kamal Hossain', text: 'Clean UI, no hidden fees. Will book again.', rating: 4 },
];

function useCountdown(hours = 18) {
  const [seconds, setSeconds] = useState(hours * 3600);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// Small component so useCountUp follows React's rules of hooks properly
// (calling a hook inside STATS.map was technically unsafe before)
function StatItem({ stat, start }) {
  const count = useCountUp(stat.decimal ? stat.value * 10 : stat.value, start);
  const display = stat.decimal ? (count / 10).toFixed(1) : count.toLocaleString();
  return (
    <div>
      <div className="font-display text-2xl sm:text-3xl font-bold text-emerald">
        {display}{stat.suffix}
      </div>
      <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
    </div>
  );
}

// ---------- Destination card — tall, full-bleed photo card (matches reference shape) ----------
function DestinationCard({ d, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative block w-full text-left rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
    >
      <div className="relative h-[420px] sm:h-[480px] lg:h-[540px] overflow-hidden bg-slate-200">
        <div
          className="h-full w-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
          style={{ backgroundImage: `url(${d.img})` }}
        />

        {/* gradient only at the bottom, just enough to keep the name legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />

        {/* small pill badge, top-left */}
        <span className="absolute top-4 left-4 bg-emerald text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
          {d.badge || d.city}
        </span>

        {/* just the place name, bottom-left — nothing else on the card */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="text-white font-display font-bold text-xl sm:text-2xl leading-tight">
            {d.city}, {d.country}
          </div>
        </div>
      </div>
    </button>
  );
}

// ---------- Destinations carousel: floating outer arrows + dot pagination ----------
function DestinationsCarousel({ destinations, onSelect, visible }) {
  const trackRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);

  const cardStep = () => {
    const el = trackRef.current;
    const card = el?.querySelector('[data-card]');
    return card ? card.offsetWidth + 24 : el?.clientWidth * 0.85 || 0;
  };

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * cardStep(), behavior: 'smooth' });
  };

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const step = cardStep();
    if (!step) return;
    setActiveDot(Math.round(el.scrollLeft / step));
  };

  const goToDot = (i) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * cardStep(), behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Previous destination"
        onClick={() => scrollByCard(-1)}
        className="hidden sm:flex absolute -left-5 lg:-left-16 top-[38%] -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg border border-slate-100 items-center justify-center text-slate-500 hover:text-emerald hover:border-emerald/30 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {destinations.map((d, i) => (
          <div
            key={d.city}
            data-card
            className={`flex-none w-[82%] sm:w-[46%] lg:w-[31%] snap-start ${
              visible ? 'animate-fade-up' : 'opacity-0'
            }`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <DestinationCard d={d} onClick={() => onSelect(d.city)} />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Next destination"
        onClick={() => scrollByCard(1)}
        className="hidden sm:flex absolute -right-5 lg:-right-16 top-[38%] -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg border border-slate-100 items-center justify-center text-slate-500 hover:text-emerald hover:border-emerald/30 transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* dot pagination, like the reference */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {destinations.map((d, i) => (
          <button
            key={d.city}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goToDot(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeDot ? 'w-6 bg-emerald' : 'w-2 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}


export default function Home() {
  const navigate = useNavigate();
  const oneWayMutation = useSearchOneWay();
  const roundTripMutation = useSearchRoundTrip();
  const multiCityMutation = useSearchMultiCity();
  const countdown = useCountdown(18);

  const [statsRef, statsVisible] = useInView();
  const [destRef, destVisible] = useInView();
  const [offersRef, offersVisible] = useInView();
  const [testRef, testVisible] = useInView();

  const handleSearch = (type, payload) => {
    const mutationMap = {
      'one-way': oneWayMutation,
      'round-trip': roundTripMutation,
      'multi-city': multiCityMutation,
    };
    mutationMap[type].mutate(payload, {
      onSuccess: (response) => {
        navigate('/search-results', {
          state: { results: response.data, searchType: type, searchPayload: payload },
        });
      },
    });
  };

  const handleDestinationClick = (city) => {
    navigate('/', { state: { prefillTo: city } });
  };

  const isSearching =
    oneWayMutation.isPending || roundTripMutation.isPending || multiCityMutation.isPending;

  return (
    <div className="font-body bg-white overflow-hidden">
      {/* ---------- HERO (photo only — no color wash, just a neutral scrim for text) ---------- */}
      <section
        className="relative pt-16 pb-40 sm:pb-48 px-4 bg-cover bg-center"
        style={{ backgroundImage: "url('/Images/sky02.jpg')" }}
      >
        {/* Neutral black-to-white gradient purely for legibility and to blend into the page.
            No brand color tint sits on top of the photo. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-white" />

        <div className="max-w-6xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-2 bg-gold/90 text-emerald-dark text-xs font-semibold px-3 py-1.5 rounded-full animate-fade-up">
            <PlaneTakeoff size={14} /> Bangladesh's favorite way to fly
          </span>

          <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white mt-5 max-w-2xl leading-tight animate-fade-up [animation-delay:100ms]">
            Fly further, <span className="text-gold">pay less.</span>
          </h1>
          <p className="text-white/80 text-base sm:text-lg mt-4 max-w-lg animate-fade-up [animation-delay:200ms]">
            Compare 120+ destinations, lock in the best fare, and book in under two minutes.
          </p>
        </div>
      </section>

      {/* ---------- FLOATING SEARCH CARD ---------- */}
      <div className="max-w-5xl mx-auto px-4 -mt-28 sm:-mt-32 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-fade-up [animation-delay:300ms]">
          <FlightSearchForm onSearch={handleSearch} isSearching={isSearching} />
        </div>
      </div>

      {/* ---------- URGENCY / DEAL STRIP ---------- */}
      <div className="max-w-5xl mx-auto px-4 mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-crimson/5 border border-crimson/20 rounded-xl px-5 py-3">
          <div className="flex items-center gap-2 text-sm text-crimson font-medium">
            <TrendingUp size={16} /> Flash sale on Dhaka → Bangkok ends in
          </div>
          <span className="font-display font-bold text-crimson tabular-nums">{countdown}</span>
        </div>
      </div>

      {/* ---------- FEATURES ---------- */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="text-center p-6 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center mx-auto mb-3">
                <f.icon size={22} />
              </div>
              <h3 className="font-display font-semibold text-slate-800 mb-1">{f.title}</h3>
              <p className="text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- STATS (count-up on scroll) ---------- */}
      <section ref={statsRef} className="bg-slate-50 py-10 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <StatItem key={s.label} stat={s} start={statsVisible} />
          ))}
        </div>
      </section>

      {/* ---------- POPULAR DESTINATIONS (carousel) ---------- */}
      <section ref={destRef} className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-emerald uppercase tracking-wider">Trending now</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
            Popular Destinations
          </h2>
          <p className="text-slate-500 text-sm mt-2">Top picks of our passengers</p>
        </div>

        <DestinationsCarousel
          destinations={DESTINATIONS}
          onSelect={handleDestinationClick}
          visible={destVisible}
        />
      </section>

      {/* ---------- OFFERS ---------- */}
      <section ref={offersRef} className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-800 mb-8">
          Current offers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {OFFERS.map((o, i) => (
            <div
              key={o.title}
              className={`relative overflow-hidden rounded-2xl p-7 bg-gradient-to-br ${o.theme} text-white ${
                offersVisible ? 'animate-fade-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <o.icon size={28} className="mb-4 opacity-90" />
              <div className="font-display font-bold text-lg">{o.title}</div>
              <div className="text-sm opacity-85 mt-1">{o.desc}</div>
              <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section ref={testRef} className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-800 mb-8">
            What travelers say
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className={`bg-white rounded-2xl p-5 border border-slate-100 ${
                  testVisible ? 'animate-fade-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} size={14} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-sm text-slate-600">{t.text}</p>
                <div className="text-xs font-semibold text-slate-800 mt-3">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}