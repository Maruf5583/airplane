import { useState, useMemo } from 'react';
import {
  Search, LifeBuoy, CreditCard, Luggage, PlaneTakeoff, RefreshCcw,
  ClipboardCheck, Phone, Mail, MessageCircle, ChevronRight,
} from 'lucide-react';
import PageHero from '../../components/common/PageHero';

const CATEGORIES = [
  { key: 'booking', icon: ClipboardCheck, title: 'Booking & Reservations', desc: 'Search, hold, and confirm your flight', count: 12 },
  { key: 'payments', icon: CreditCard, title: 'Payments & Refunds', desc: 'Cards, mobile banking, refund status', count: 9 },
  { key: 'baggage', icon: Luggage, title: 'Baggage', desc: 'Allowance, excess fees, lost items', count: 7 },
  { key: 'checkin', icon: PlaneTakeoff, title: 'Check-in & Boarding', desc: 'Online check-in, boarding passes, seats', count: 8 },
  { key: 'changes', icon: RefreshCcw, title: 'Flight Changes', desc: 'Reschedule, cancel, name correction', count: 10 },
  { key: 'support', icon: LifeBuoy, title: 'Special Assistance', desc: 'Wheelchair, medical, unaccompanied minors', count: 5 },
];

const POPULAR_ARTICLES = [
  { category: 'Booking & Reservations', title: 'How do I retrieve my booking with a PNR code?' },
  { category: 'Payments & Refunds', title: 'How long does a refund take to reach my account?' },
  { category: 'Baggage', title: 'What is my checked baggage allowance in Economy?' },
  { category: 'Check-in & Boarding', title: 'When does online check-in open for my flight?' },
  { category: 'Flight Changes', title: 'Can I change my travel date after booking?' },
  { category: 'Payments & Refunds', title: 'Which payment methods are accepted?' },
];

export default function HelpCenter() {
  const [query, setQuery] = useState('');

  const filteredArticles = useMemo(() => {
    if (!query.trim()) return POPULAR_ARTICLES;
    return POPULAR_ARTICLES.filter((a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="font-body bg-white">
      <PageHero
        icon={LifeBuoy}
        eyebrow="We're here 24/7"
        title="How can we help?"
        subtitle="Search our help articles or browse by topic to get quick answers."
        breadcrumb="Help Center"
      />

      <div className="max-w-2xl mx-auto px-4 -mt-8 sm:-mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-fade-up [animation-delay:300ms]">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Search size={18} className="text-slate-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search for topics like 'baggage allowance' or 'refund'"
              className="w-full text-sm text-slate-700 placeholder:text-slate-400 outline-none"
            />
          </div>
        </div>
      </div>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-800 mb-6">
          Browse by topic
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.key}
              className="group text-left p-5 rounded-2xl border border-slate-100 hover:border-emerald/30 hover:shadow-md transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-11 h-11 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center mb-3 group-hover:bg-emerald group-hover:text-white transition-colors duration-300">
                <c.icon size={20} />
              </div>
              <h3 className="font-display font-semibold text-slate-800 mb-1">{c.title}</h3>
              <p className="text-sm text-slate-500 mb-2">{c.desc}</p>
              <span className="text-xs font-medium text-emerald flex items-center gap-1">
                {c.count} articles <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 border-y border-slate-100 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-800 mb-6">
            Popular articles
          </h2>
          <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 overflow-hidden">
            {filteredArticles.length ? (
              filteredArticles.map((a) => (
                <button
                  key={a.title}
                  className="w-full text-left flex items-center justify-between gap-4 px-5 py-4 hover:bg-emerald/5 transition-colors group"
                >
                  <div>
                    <span className="text-xs font-medium text-emerald">{a.category}</span>
                    <p className="text-sm text-slate-700 mt-0.5">{a.title}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-sm text-slate-500">
                No articles match "{query}". Try a different search or contact support below.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-800 mb-2">
          Still need help?
        </h2>
        <p className="text-sm text-slate-500 mb-8">Our support team typically replies within minutes.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: MessageCircle, title: 'Live Chat', desc: 'Chat with an agent now', action: 'Start chat', theme: 'bg-emerald' },
            { icon: Phone, title: 'Call Us', desc: '+880 9666-000-000', action: 'Call now', theme: 'bg-crimson' },
            { icon: Mail, title: 'Email', desc: 'support@skybook.com', action: 'Send email', theme: 'bg-slate-800' },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-slate-100 p-6 text-center hover:shadow-md transition-shadow duration-300">
              <div className={`w-12 h-12 rounded-xl ${c.theme} text-white flex items-center justify-center mx-auto mb-3`}>
                <c.icon size={20} />
              </div>
              <h3 className="font-display font-semibold text-slate-800">{c.title}</h3>
              <p className="text-sm text-slate-500 mt-1 mb-4">{c.desc}</p>
              <button className="text-sm font-medium text-emerald hover:text-emerald-dark transition-colors">
                {c.action} →
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}