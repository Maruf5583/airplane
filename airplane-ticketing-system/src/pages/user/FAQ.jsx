import { useState } from 'react';
import { MessageCircleQuestion, ChevronDown } from 'lucide-react';
import PageHero from '../../components/common/PageHero';

const TABS = ['All', 'Booking', 'Payments', 'Baggage', 'Check-in', 'Refunds'];

const FAQS = [
  { category: 'Booking', q: 'How do I book a flight on SkyBook?', a: 'Search your route on the homepage, pick a fare that suits you, fill in passenger details, and pay securely. Your e-ticket and PNR arrive by email right after payment.' },
  { category: 'Booking', q: 'Can I book for someone else?', a: 'Yes. Enter the traveling passenger\'s details during checkout — the account holder and the passenger don\'t need to be the same person.' },
  { category: 'Payments', q: 'Which payment methods do you accept?', a: 'We accept Visa, Mastercard, bKash, Nagad, and Rocket. All payments are processed over an encrypted, PCI-compliant connection.' },
  { category: 'Payments', q: 'How long do refunds take?', a: 'Refunds to cards typically take 7–10 business days. Mobile banking refunds (bKash, Nagad, Rocket) usually complete within 3–5 business days.' },
  { category: 'Baggage', q: 'What is my checked baggage allowance?', a: 'Economy fares include 20kg checked baggage, Business fares include 30kg. Excess baggage can be added during booking or from Manage Booking.' },
  { category: 'Baggage', q: 'What happens if my baggage is delayed or lost?', a: 'Report it at the airline baggage desk before leaving the airport with your baggage tag. Our support team can also help you track a claim — see the Baggage help topic.' },
  { category: 'Check-in', q: 'When does online check-in open?', a: 'Online check-in opens 48 hours and closes 2 hours before departure for international flights, and 1 hour for domestic flights.' },
  { category: 'Check-in', q: 'Can I choose my seat in advance?', a: 'Yes, seat selection is available during booking or later through Manage Booking, subject to availability and fare type.' },
  { category: 'Refunds', q: 'Can I cancel a non-refundable ticket?', a: 'Non-refundable fares aren\'t eligible for a cash refund, but most can be converted to travel credit minus a cancellation fee.' },
  { category: 'Refunds', q: 'How do I request a refund?', a: 'Go to Manage Booking, retrieve your trip with your PNR and last name, then select "Request refund." You\'ll see the eligible amount before confirming.' },
];

export default function FAQ() {
  const [activeTab, setActiveTab] = useState('All');
  const [openIndex, setOpenIndex] = useState(0);

  const visible = activeTab === 'All' ? FAQS : FAQS.filter((f) => f.category === activeTab);

  return (
    <div className="font-body bg-white">
      <PageHero
        icon={MessageCircleQuestion}
        eyebrow="Quick answers"
        title="Frequently asked questions"
        subtitle="Everything you need to know about booking, payments, baggage, and more."
        breadcrumb="FAQ"
      />

      <section className="max-w-3xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-20 pb-20">
        <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-fade-up [animation-delay:200ms]">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setOpenIndex(0);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                activeTab === tab
                  ? 'bg-emerald text-white shadow-sm'
                  : 'text-slate-600 hover:bg-emerald/5 hover:text-emerald'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {visible.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.q}
                className={`rounded-2xl border transition-colors duration-200 overflow-hidden animate-fade-up ${
                  isOpen ? 'border-emerald/30 bg-emerald/5' : 'border-slate-100 bg-white'
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-slate-800">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-slate-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-emerald' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm text-slate-600 px-5 pb-4 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-slate-500 mb-3">Didn't find what you're looking for?</p>
          
          <a  href="/support/help-center"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-emerald text-white shadow-sm hover:bg-emerald-dark hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          
            Visit Help Center
          </a>
        </div>
      </section>
    </div>
  );
}