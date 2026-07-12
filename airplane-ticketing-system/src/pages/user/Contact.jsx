import { useState } from 'react';
import {
  Phone, Mail, MapPin, Clock, Send, MessageCircle,
  Facebook, Twitter, Instagram, CheckCircle2,
} from 'lucide-react';

const CONTACT_CARDS = [
  {
    icon: Phone,
    title: 'Call us',
    lines: ['+88-02-8901600', '24/7 Customer Support'],
  },
  {
    icon: Mail,
    title: 'Email us',
    lines: ['support@skybook.com', 'We reply within 24 hours'],
  },
  {
    icon: MapPin,
    title: 'Visit us',
    lines: ['Balaka, Kurmitola', 'Dhaka-1229, Bangladesh'],
  },
  {
    icon: Clock,
    title: 'Working hours',
    lines: ['Sun – Thu: 9:00 AM – 8:00 PM', 'Fri – Sat: 10:00 AM – 6:00 PM'],
  },
];

const OFFICES = [
  { city: 'Dhaka (Head Office)', address: 'Balaka, Kurmitola, Dhaka-1229' },
  { city: 'Chattogram', address: 'CDA Avenue, Sholosohar, Nasirabad' },
  { city: 'Sylhet', address: 'Osmani International Airport Road' },
];

const SOCIALS = [
  { icon: Facebook, url: 'https://facebook.com' },
  { icon: Twitter, url: 'https://twitter.com' },
  { icon: Instagram, url: 'https://instagram.com' },
];

const SUBJECTS = ['Booking Inquiry', 'Refund Request', 'Baggage Issue', 'Loyalty Program', 'Other'];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setForm({ name: '', email: '', subject: SUBJECTS[0], message: '' });
    }, 900);
  };

  return (
    <div className="font-body bg-white">
      {/* HERO */}
      <section
        className="relative pt-20 pb-24 px-4 bg-cover bg-center"
        style={{ backgroundImage: "url('/Images/sky01.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-white" />
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <span className="inline-flex items-center gap-2 bg-gold/90 text-emerald-dark text-xs font-semibold px-3 py-1.5 rounded-full animate-fade-up">
            <MessageCircle size={14} /> We're here to help
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white mt-5 leading-tight animate-fade-up [animation-delay:100ms]">
            Get in <span className="text-gold">touch</span>
          </h1>
          <p className="text-white/80 text-base sm:text-lg mt-4 max-w-xl mx-auto animate-fade-up [animation-delay:200ms]">
            Questions about a booking, baggage, or your loyalty account? Our team replies fast.
          </p>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CONTACT_CARDS.map((c) => (
            <div
              key={c.title}
              className="bg-white rounded-2xl border border-slate-100 shadow-lg p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center mb-4">
                <c.icon size={20} />
              </div>
              <h3 className="font-display font-semibold text-slate-800 mb-1">{c.title}</h3>
              {c.lines.map((line) => (
                <p key={line} className="text-xs text-slate-500 leading-relaxed">{line}</p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* FORM + OFFICES + SOCIALS */}
      <section className="max-w-5xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ---- FORM COLUMN ---- */}
        <div className="lg:col-span-3">
          <h2 className="font-display text-2xl font-bold text-slate-800 mb-1">Send us a message</h2>
          <p className="text-sm text-slate-500 mb-6">Fill out the form and we'll get back to you shortly.</p>

          {submitted ? (
            <div className="bg-emerald/5 border border-emerald/20 rounded-2xl p-8 text-center">
              <CheckCircle2 size={36} className="text-emerald mx-auto mb-3" />
              <h3 className="font-display font-semibold text-slate-800">Message sent!</h3>
              <p className="text-sm text-slate-500 mt-1">
                Thanks for reaching out — our team will email you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-sm font-medium text-emerald hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Full name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald/30 focus:border-emerald transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald/30 focus:border-emerald transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Subject</label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald/30 focus:border-emerald transition-all bg-white"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald/30 focus:border-emerald transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="flex items-center gap-2 bg-emerald hover:bg-emerald-dark disabled:opacity-60 text-white font-medium py-3 px-7 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                {sending ? 'Sending...' : 'Send message'} <Send size={16} />
              </button>
            </form>
          )}
        </div>
        {/* ---- FORM COLUMN ENDS ---- */}

        {/* ---- SIDEBAR COLUMN ---- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-100 p-6">
            <h3 className="font-display font-semibold text-slate-800 mb-4">Our offices</h3>
            <div className="space-y-4">
              {OFFICES.map((o) => (
                <div key={o.city} className="flex gap-3">
                  <MapPin size={16} className="text-emerald shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">{o.city}</div>
                    <div className="text-xs text-slate-500">{o.address}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6">
            <h3 className="font-display font-semibold text-slate-800 mb-4">Follow us</h3>
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-emerald hover:border-emerald/30 transition-colors"
                >
                  <s.icon size={17} />
                </a>
              ))}
            </div>
          </div>
        </div>
        {/* ---- SIDEBAR COLUMN ENDS ---- */}
      </section>
    </div>
  );
}