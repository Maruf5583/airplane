import { useState, useEffect, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';
import PageHero from '../../components/common/PageHero';

const SECTIONS = [
  {
    id: 'overview',
    title: '1. Overview',
    body: `This Privacy Policy explains how SkyBook collects, uses, stores, and protects your personal information when you search, book, or manage flights through our website or mobile application. By using our services, you agree to the practices described in this policy.`,
  },
  {
    id: 'data-we-collect',
    title: '2. Information We Collect',
    body: `We collect information you provide directly, including your full name, email address, phone number, passport or national ID details (when required for travel), date of birth, emergency contact information, and payment details. We also automatically collect technical information such as your IP address, browser type, device information, operating system, location (when permitted), and website usage analytics.`,
  },
  {
    id: 'how-we-use',
    title: '3. How We Use Your Information',
    body: `Your information is used to process flight bookings, issue e-tickets, send booking confirmations and flight updates, provide customer support, verify your identity, prevent fraud, improve our services, personalize your experience, and comply with legal and aviation regulations. With your consent, we may also send promotional offers and travel recommendations.`,
  },
  {
    id: 'sharing',
    title: '4. Sharing Your Information',
    body: `We only share the information necessary to complete your travel with airlines, payment providers, airport authorities, immigration agencies, government authorities when legally required, and trusted technology partners. We never sell your personal information to third parties for advertising or marketing purposes.`,
  },
  {
    id: 'cookies',
    title: '5. Cookies & Tracking Technologies',
    body: `SkyBook uses cookies and similar technologies to remember your preferences, keep you signed in, improve website performance, analyze visitor behavior, and provide a better booking experience. You can disable or manage cookies through your browser settings, although some features may not function properly.`,
  },
  {
    id: 'security',
    title: '6. Data Security',
    body: `We protect your information using industry-standard security measures including HTTPS encryption, secure servers, access controls, monitoring systems, and PCI DSS compliant payment processing. While no online system can guarantee absolute security, we continuously improve our safeguards to protect your personal information.`,
  },
  {
    id: 'retention',
    title: '7. Data Retention',
    body: `We retain your booking records, payment information, and travel history only for as long as necessary to provide our services and comply with applicable legal, tax, accounting, and aviation regulations. After the retention period expires, your information is securely deleted or anonymized.`,
  },
  {
    id: 'rights',
    title: '8. Your Privacy Rights',
    body: `You have the right to request access to your personal information, correct inaccurate data, request deletion where legally permitted, restrict certain processing activities, and opt out of marketing communications at any time. Requests may be submitted through your account or our support team.`,
  },
  {
    id: 'account-deletion',
    title: '9. Account Deletion',
    body: `You may request permanent deletion of your SkyBook account at any time. Certain booking and transaction records may continue to be retained where required by law, financial regulations, or aviation authorities.`,
  },
  {
    id: 'international',
    title: '10. International Data Transfers',
    body: `Your information may be processed or stored on secure cloud servers located in different countries. Whenever international data transfers occur, we take appropriate safeguards to ensure your information remains protected in accordance with applicable privacy laws.`,
  },
  {
    id: 'third-party',
    title: '11. Third-Party Services',
    body: `SkyBook works with trusted third-party service providers including payment gateways, airline reservation systems, cloud hosting providers, email delivery services, analytics platforms, and customer support tools. These providers may process personal information only to deliver services on our behalf and are required to protect your data.`,
  },
  {
    id: 'children',
    title: '12. Children’s Privacy',
    body: `SkyBook is not intended for children under the age of 13. Flight bookings for minors must be made and managed by a parent, legal guardian, or authorized adult.`,
  },
  {
    id: 'gdpr',
    title: '13. GDPR & International Privacy Rights',
    body: `If you are located in the European Economic Area (EEA), the United Kingdom, or another region with applicable privacy laws, you may have additional rights including data portability, restriction of processing, objection to processing, and the right to lodge a complaint with your local data protection authority.`,
  },
  {
    id: 'changes',
    title: '14. Changes to This Privacy Policy',
    body: `We may update this Privacy Policy from time to time to reflect changes in our services, legal requirements, or business practices. Any significant updates will be published on this page together with a revised effective date.`,
  },
  {
    id: 'contact',
    title: '15. Contact Us',
    body: `If you have any questions regarding this Privacy Policy or wish to exercise your privacy rights, please contact us at privacy@skybook.com, visit our Help Center, or write to SkyBook Customer Support, Dhaka, Bangladesh.`,
  },
];
export default function PrivacyPolicy() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="font-body bg-white">
      <PageHero
        icon={ShieldCheck}
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="Last updated: 1 July 2026 — how we collect, use, and protect your data."
        breadcrumb="Privacy Policy"
      />

      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">
              On this page
            </span>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  activeId === s.id
                    ? 'text-emerald bg-emerald/5 font-medium'
                    : 'text-slate-500 hover:text-emerald hover:bg-emerald/5'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-10 max-w-2xl">
          <div className="rounded-2xl bg-slate-50 border border-slate-100 px-5 py-4 text-sm text-slate-500">
            Your trust matters to us. This policy covers all personal data processed through
            the SkyBook website and app when you search, book, or manage a flight.
          </div>

          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} ref={(el) => (sectionRefs.current[s.id] = el)} className="scroll-mt-24">
              <h2 className="font-display font-bold text-lg text-slate-800 mb-2">{s.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}