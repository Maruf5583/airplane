import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plane, Shield, Heart, Award, Users, Globe2, ChevronDown,
  Target, Eye, ArrowRight,
} from 'lucide-react';
import useInView from '../../hooks/useInView';
import useCountUp from '../../hooks/useCountUp';

const STATS = [
  { value: 1972, suffix: '', label: 'Founded in', isYear: true },
  { value: 500000, suffix: '+', label: 'Happy travelers' },
  { value: 120, suffix: '+', label: 'Destinations' },
  { value: 45, suffix: '+', label: 'Fleet size' },
];

const VALUES = [
  { icon: Shield, title: 'Safety First', desc: 'Every flight follows the highest international safety standards.' },
  { icon: Heart, title: 'Genuine Care', desc: 'We treat every passenger like family, from check-in to landing.' },
  { icon: Globe2, title: 'Connecting Bangladesh', desc: 'Linking our country to the world, one route at a time.' },
  { icon: Award, title: 'Trusted Service', desc: 'Decades of experience flying millions of passengers safely home.' },
];

const FLEET = [
  { name: 'Boeing 787-9 Dreamliner', range: 'Long-haul international', seats: '298 seats', img: '/Images/air01.jpg' },
  { name: 'Boeing 787-8 Dreamliner', range: 'Long-haul international', seats: '271 seats', img: '/Images/air02.avif' },
  { name: 'Boeing 737-800', range: 'Regional & short-haul', seats: '162 seats', img: '/Images/air03.webp' },
  { name: 'De Havilland Dash-8 Q400', range: 'Domestic routes', seats: '74 seats', img: '/Images/air04.jpg' },
];

const TIMELINE = [
  { year: '1972', text: 'Founded shortly after independence, becoming the flag carrier of Bangladesh.' },
  { year: '1996', text: 'Expanded international routes across the Middle East, Asia, and Europe.' },
  { year: '2011', text: 'Began modernizing the fleet with new-generation Boeing aircraft.' },
  { year: '2018', text: 'Welcomed the first Boeing 787 Dreamliner into the fleet.' },
  { year: '2026', text: 'Serving 120+ destinations with a fully digital, modern booking experience.' },
];

const FAQS = [
  {
    q: 'How do I change or cancel my booking?',
    a: 'Go to "My Bookings", select your trip, and choose Change or Cancel. Fees depend on your fare type and how close to departure you are.',
  },
  {
    q: 'What baggage allowance do I get?',
    a: 'Economy passengers get 20kg checked baggage and 7kg carry-on. Business class gets 30kg checked baggage and 10kg carry-on. Extra baggage can be purchased during booking.',
  },
  {
    q: 'How early should I arrive at the airport?',
    a: 'We recommend arriving 3 hours before international flights and 2 hours before domestic flights to allow time for check-in and security.',
  },
  {
    q: 'Can I select my seat in advance?',
    a: 'Yes, seat selection is available during booking or later from "My Bookings" for most fare types, subject to availability.',
  },
  {
    q: 'Do you offer refunds for cancelled flights?',
    a: 'If we cancel or significantly delay your flight, you are entitled to a full refund or free rebooking on the next available flight.',
  },
  {
    q: 'How do I join the loyalty program?',
    a: 'Sign up for free from your account page. You will start earning miles on your very next booking, redeemable for future flights and upgrades.',
  },
];

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

function StatItem({ stat, start }) {
  const count = useCountUp(stat.value, start, stat.isYear ? 1800 : 1400);
  const display = stat.isYear ? count : count.toLocaleString();
  return (
    <div>
      <div className="font-display text-2xl sm:text-3xl font-bold text-emerald">
        {display}{stat.suffix}
      </div>
      <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
    </div>
  );
}

export default function About() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);

  const [statsRef, statsVisible] = useInView();
  const [valuesRef, valuesVisible] = useInView();
  const [fleetRef, fleetVisible] = useInView();
  const [timelineRef, timelineVisible] = useInView();

  return (
    <div className="font-body bg-white">
      {/* ---------- HERO ---------- */}
      <section
        className="relative pt-20 pb-24 px-4 bg-cover bg-center"
        style={{ backgroundImage: "url('/Images/sky02.jpg')" }}
      >
       <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-white" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <span className="inline-flex items-center gap-2 bg-gold/90 text-emerald-dark text-xs font-semibold px-3 py-1.5 rounded-full animate-fade-up">
            <Plane size={14} /> Est. 1972 — Flag carrier of Bangladesh
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white mt-5 leading-tight animate-fade-up [animation-delay:100ms]">
            Connecting Bangladesh <span className="text-gold">to the world.</span>
          </h1>
          <p className="text-white/80 text-base sm:text-lg mt-4 max-w-2xl mx-auto animate-fade-up [animation-delay:200ms]">
            For over five decades, we've carried millions of passengers home, to new opportunities,
            and to the people they love most — safely, comfortably, and on time.
          </p>
        </div>
      </section>

      {/* ---------- STATS STRIP ---------- */}
      <section ref={statsRef} className="bg-slate-50 py-10 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <StatItem key={s.label} stat={s} start={statsVisible} />
          ))}
        </div>
      </section>

      {/* ---------- MISSION / VISION ---------- */}
      <section className="max-w-5xl mx-auto px-4 py-20 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-100 p-7 hover:shadow-lg transition-shadow duration-300">
          <div className="w-12 h-12 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center mb-4">
            <Target size={22} />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-800 mb-2">Our Mission</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            To connect Bangladesh with the world through safe, reliable, and affordable air travel —
            while giving every passenger a journey worth remembering.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 p-7 hover:shadow-lg transition-shadow duration-300">
          <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-4">
            <Eye size={22} />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-800 mb-2">Our Vision</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            To be South Asia's most loved airline — recognized for genuine hospitality, a modern fleet,
            and a seamless digital booking experience.
          </p>
        </div>
      </section>

      {/* ---------- VALUES ---------- */}
      <section ref={valuesRef} className="max-w-6xl mx-auto px-4 pb-20">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-emerald uppercase tracking-wider">What drives us</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
            Our core values
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((v, i) => (
            <div
              key={v.title}
              className={`text-center p-6 rounded-2xl border border-slate-100 hover:border-emerald/20 hover:-translate-y-1 transition-all duration-300 ${
                valuesVisible ? 'animate-fade-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center mx-auto mb-3">
                <v.icon size={22} />
              </div>
              <h3 className="font-display font-semibold text-slate-800 mb-1">{v.title}</h3>
              <p className="text-sm text-slate-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- TIMELINE ---------- */}
      <section ref={timelineRef} className="bg-slate-50 py-20 border-y border-slate-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-emerald uppercase tracking-wider">Our journey</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
              Decades of flying
            </h2>
          </div>
          <div className="relative pl-8 border-l-2 border-emerald/20 space-y-8">
            {TIMELINE.map((item, i) => (
              <div
                key={item.year}
                className={`relative ${timelineVisible ? 'animate-fade-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <span className="absolute -left-[38px] top-0 w-4 h-4 rounded-full bg-emerald ring-4 ring-white" />
                <div className="font-display font-bold text-emerald text-lg">{item.year}</div>
                <p className="text-sm text-slate-500 mt-1">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FLEET ---------- */}
      <section ref={fleetRef} className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-emerald uppercase tracking-wider">Modern & reliable</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
            Our fleet
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FLEET.map((f, i) => (
            <div
              key={f.name}
              className={`rounded-2xl overflow-hidden border border-slate-100 hover:shadow-lg transition-all duration-300 ${
                fleetVisible ? 'animate-fade-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className="h-32 bg-slate-200 bg-cover bg-center"
                style={{ backgroundImage: `url(${f.img})` }}
              />
              <div className="p-4">
                <h3 className="font-display font-semibold text-sm text-slate-800">{f.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{f.range}</p>
                <p className="text-xs text-emerald font-medium mt-1">{f.seats}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="bg-slate-50 py-20 border-t border-slate-100">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold text-emerald uppercase tracking-wider">Got questions?</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
              Frequently asked questions
            </h2>
          </div>
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

      {/* ---------- CTA ---------- */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <Users size={32} className="text-emerald mx-auto mb-4" />
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-800">
          Ready for your next journey?
        </h2>
        <p className="text-slate-500 mt-2 max-w-lg mx-auto">
          Join half a million travelers who trust us to get them where they need to be.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 mt-6 bg-emerald hover:bg-emerald-dark text-white font-medium py-3 px-7 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
        >
          Search Flights <ArrowRight size={16} />
        </button>
      </section>
    </div>
  );
}