import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tag, Percent, Copy, Check, Clock, TrendingUp, Gift,
  Users, Plane, ChevronDown, Sparkles,
} from 'lucide-react';

const CATEGORIES = ['All', 'Domestic', 'International', 'Seasonal', 'Loyalty'];

const FEATURED_OFFER = {
  title: 'Monsoon Sale — Up to 25% Off',
  desc: 'Book any international route before 31 July and save on your next getaway.',
  code: 'MONSOON25',
  expiresInHours: 40,
};

const OFFERS = [
  {
    id: 1,
    title: 'Dhaka → Dubai Flash Sale',
    category: 'International',
    discount: '20% OFF',
    code: 'DUBAI20',
    validTill: '31 Jul 2026',
    desc: 'Fly to Dubai and back at unbeatable prices. Limited seats on select flights.',
    trending: true,
    icon: Percent,
    theme: 'from-emerald to-emerald-dark',
  },
  {
    id: 2,
    title: "Cox's Bazar Weekend Getaway",
    category: 'Domestic',
    discount: '15% OFF',
    code: 'BEACH15',
    validTill: '15 Aug 2026',
    desc: 'Round-trip domestic fares to the world\'s longest sea beach.',
    trending: true,
    icon: Tag,
    theme: 'from-sky to-emerald-dark',
  },
  {
    id: 3,
    title: 'Family Package Deal',
    category: 'Domestic',
    discount: 'Kids fly 50% OFF',
    code: 'FAMILY50',
    validTill: '30 Sep 2026',
    desc: 'Children under 12 pay half price on all domestic and regional routes.',
    trending: false,
    icon: Users,
    theme: 'from-crimson to-rose-700',
  },
  {
    id: 4,
    title: 'Early Bird — Bangkok & KL',
    category: 'International',
    discount: '18% OFF',
    code: 'EARLY18',
    validTill: '20 Aug 2026',
    desc: 'Book 45 days in advance and lock in the lowest fares of the season.',
    trending: false,
    icon: Plane,
    theme: 'from-gold to-amber-600',
  },
  {
    id: 5,
    title: 'Eid Special — London & Manchester',
    category: 'Seasonal',
    discount: '12% OFF',
    code: 'EIDUK12',
    validTill: '10 Aug 2026',
    desc: 'Visit family in the UK this season with special seasonal fares.',
    trending: true,
    icon: Sparkles,
    theme: 'from-emerald-dark to-slate-800',
  },
  {
    id: 6,
    title: 'SkyBook Rewards Bonus',
    category: 'Loyalty',
    discount: '2× Miles',
    code: 'DOUBLEMILES',
    validTill: '31 Aug 2026',
    desc: 'Members earn double loyalty miles on every booking this month.',
    trending: false,
    icon: Gift,
    theme: 'from-sky to-primary-800',
  },
];

const FAQS = [
  {
    q: 'How do I apply a promo code?',
    a: 'Enter the code in the "Promo Code" field during checkout, right before payment. The discount applies automatically if the code is valid.',
  },
  {
    q: 'Can I combine multiple offers?',
    a: 'Only one promo code can be applied per booking. The system will use whichever offer gives you the best discount.',
  },
  {
    q: 'Do offers apply to already-booked flights?',
    a: 'No, promo codes must be applied at the time of booking and cannot be applied retroactively.',
  },
];

function useCountdown(hours) {
  const [seconds, setSeconds] = useState(hours * 3600);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const d = Math.floor(seconds / 86400);
  const h = String(Math.floor((seconds % 86400) / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return { d, h, m, s };
}

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-lg transition-colors"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? 'Copied' : code}
    </button>
  );
}

function FaqItem({ item, isOpen, onClick }) {
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white hover:bg-slate-50 transition-colors"
      >
        <span className="text-sm font-medium text-slate-800">{item.q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-emerald transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-sm text-slate-500 leading-relaxed">{item.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function Offers() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [openFaq, setOpenFaq] = useState(0);
  const featuredCountdown = useCountdown(FEATURED_OFFER.expiresInHours);

  const filtered =
    activeCategory === 'All' ? OFFERS : OFFERS.filter((o) => o.category === activeCategory);

  const handleUseOffer = (code) => {
    navigate('/', { state: { promoCode: code } });
  };

  return (
    <div className="font-body bg-white">
      {/* ---------- HERO ---------- */}
      <section
        className="relative pt-20 pb-16 px-4 bg-cover bg-center"
        style={{ backgroundImage: "url('/Images/sky02.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-white" />
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <span className="inline-flex items-center gap-2 bg-gold/90 text-emerald-dark text-xs font-semibold px-3 py-1.5 rounded-full animate-fade-up">
            <Tag size={14} /> Fresh deals, updated weekly
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white mt-5 leading-tight animate-fade-up [animation-delay:100ms]">
            Offers & <span className="text-gold">deals</span>
          </h1>
          <p className="text-white/80 text-base sm:text-lg mt-4 max-w-xl mx-auto animate-fade-up [animation-delay:200ms]">
            Grab a discount before it's gone — new fares added every week.
          </p>
        </div>
      </section>

      {/* ---------- FEATURED OFFER BANNER (overlapping hero) ---------- */}
      <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-20">
        <div className="rounded-2xl bg-gradient-to-br from-emerald to-emerald-dark p-6 sm:p-8 shadow-xl text-white animate-fade-up [animation-delay:300ms] relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute right-16 top-6 w-20 h-20 rounded-full bg-gold/20" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-gold text-emerald-dark text-[11px] font-bold px-2.5 py-1 rounded-full mb-3">
                <TrendingUp size={11} /> Best deal this week
              </span>
              <h2 className="font-display font-bold text-xl sm:text-2xl">{FEATURED_OFFER.title}</h2>
              <p className="text-sm text-white/80 mt-1 max-w-md">{FEATURED_OFFER.desc}</p>
              <div className="mt-4">
                <CopyButton code={FEATURED_OFFER.code} />
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2 shrink-0">
              <span className="text-xs text-white/70 uppercase tracking-wider">Ends in</span>
              <div className="flex gap-2">
                {[
                  { v: featuredCountdown.d, l: 'd' },
                  { v: featuredCountdown.h, l: 'h' },
                  { v: featuredCountdown.m, l: 'm' },
                  { v: featuredCountdown.s, l: 's' },
                ].map((t) => (
                  <div key={t.l} className="bg-white/15 rounded-lg px-2.5 py-1.5 text-center min-w-[42px]">
                    <div className="font-display font-bold text-lg tabular-nums">{t.v}</div>
                    <div className="text-[10px] text-white/70">{t.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- CATEGORY FILTER ---------- */}
      <section className="max-w-6xl mx-auto px-4 pt-12">
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                activeCategory === c
                  ? 'bg-emerald text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* ---------- OFFER GRID ---------- */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((o, i) => (
            <div
              key={o.id}
              className="rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`relative bg-gradient-to-br ${o.theme} text-white p-5`}>
                {o.trending && (
                  <span className="absolute top-3 right-3 bg-white/20 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp size={10} /> Hot
                  </span>
                )}
                <o.icon size={26} className="mb-3 opacity-90" />
                <div className="font-display font-bold text-2xl">{o.discount}</div>
                <div className="text-xs text-white/80 mt-1">{o.category}</div>
              </div>

              <div className="p-5">
                <h3 className="font-display font-semibold text-slate-800 mb-1.5">{o.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{o.desc}</p>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-4">
                  <Clock size={12} /> Valid till {o.validTill}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 border border-dashed border-emerald/40 bg-emerald/5 text-emerald text-xs font-semibold px-3 py-1.5 rounded-lg">
                    <Tag size={12} /> {o.code}
                  </div>
                  <button
                    onClick={() => handleUseOffer(o.code)}
                    className="text-xs font-medium bg-emerald hover:bg-emerald-dark text-white px-3.5 py-1.5 rounded-lg transition-colors"
                  >
                    Use offer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Tag size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No offers in this category right now.</p>
          </div>
        )}
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="bg-slate-50 border-y border-slate-100 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-2xl font-bold text-slate-800 text-center mb-10">
            How to redeem an offer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Copy the code', desc: 'Tap "Copy" on any offer card above.' },
              { step: '2', title: 'Search your flight', desc: 'Choose your route, dates, and passengers as usual.' },
              { step: '3', title: 'Apply at checkout', desc: 'Paste the code in the promo field before payment.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-emerald text-white font-display font-bold flex items-center justify-center mx-auto mb-3">
                  {s.step}
                </div>
                <h3 className="font-display font-semibold text-slate-800 mb-1">{s.title}</h3>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-display text-2xl font-bold text-slate-800 text-center mb-10">
            Offer FAQs
          </h2>
          <div className="space-y-3">
            {FAQS.map((item, i) => (
              <FaqItem
                key={item.q}
                item={item}
                isOpen={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}