import { useState, useEffect, useRef } from 'react';
import { FileText } from 'lucide-react';
import PageHero from '../../components/common/PageHero';

const SECTIONS = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    body: `By accessing or using the SkyBook website, mobile application, or any of our booking services, you agree to be legally bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our platform or services.`,
  },
  {
    id: 'eligibility',
    title: '2. Eligibility',
    body: `You must be at least 18 years old or use SkyBook under the supervision of a parent or legal guardian. By making a booking, you confirm that you have the legal authority to enter into this agreement and provide accurate passenger information.`,
  },
  {
    id: 'account',
    title: '3. Account Registration',
    body: `You are responsible for maintaining the confidentiality of your account credentials. All activities performed through your account are your responsibility. You must immediately notify us if you suspect unauthorized access to your account.`,
  },
  {
    id: 'bookings',
    title: '4. Flight Bookings',
    body: `Flight availability and fares displayed during your search are subject to change until payment has been successfully completed. Once your booking is confirmed, you will receive an electronic ticket and itinerary containing your booking details and applicable fare rules.`,
  },
  {
    id: 'pricing',
    title: '5. Pricing & Fare Rules',
    body: `Displayed fares may include the base fare, taxes, airport fees, and applicable service charges. Different fare types may have different rules regarding refunds, cancellations, baggage allowances, and flight changes. Please review your fare conditions before completing your purchase.`,
  },
  {
    id: 'payments',
    title: '6. Payments',
    body: `SkyBook accepts secure online payments through supported payment gateways, including major debit and credit cards and local mobile financial services. All payment transactions are encrypted using PCI DSS compliant payment systems. SkyBook does not store your complete payment card information.`,
  },
  {
    id: 'refunds',
    title: '7. Refunds & Cancellations',
    body: `Refund eligibility depends on the airline's fare rules and ticket conditions. Approved refunds are processed using the original payment method. Processing times may vary depending on the airline, payment provider, and financial institution.`,
  },
  {
    id: 'changes',
    title: '8. Flight Changes',
    body: `Flight changes, including date, time, route, or passenger modifications, are subject to airline policies and applicable change fees. Some promotional fares may not permit any modifications after booking confirmation.`,
  },
  {
    id: 'checkin',
    title: '9. Check-in Requirements',
    body: `Passengers are responsible for completing online or airport check-in within the deadlines established by the operating airline. Failure to check in on time may result in denied boarding without refund.`,
  },
  {
    id: 'travel-documents',
    title: '10. Travel Documents',
    body: `Passengers are solely responsible for ensuring they possess valid passports, visas, health certificates, vaccination records, and any other travel documents required by the destination country. SkyBook is not responsible for denied boarding due to missing or invalid documentation.`,
  },
  {
    id: 'baggage',
    title: '11. Baggage Policy',
    body: `Checked baggage and cabin baggage allowances vary according to the airline, route, and fare class selected. Additional baggage charges may apply if your luggage exceeds the permitted limits. Dangerous or prohibited items must comply with airline and aviation authority regulations.`,
  },
  {
    id: 'conduct',
    title: '12. User Responsibilities',
    body: `Users must provide accurate passenger information and use the platform only for lawful purposes. Fraudulent bookings, false identities, payment disputes made in bad faith, misuse of promotional offers, or attempts to interfere with our systems may result in immediate suspension or termination of your account.`,
  },
  {
    id: 'third-party',
    title: '13. Third-Party Services',
    body: `SkyBook works with airlines, payment gateways, airport systems, cloud hosting providers, customer support services, and analytics platforms to deliver our services. These trusted partners may process your information only as necessary to perform their services.`,
  },
  {
    id: 'privacy',
    title: '14. Privacy',
    body: `Your use of SkyBook is also governed by our Privacy Policy, which explains how we collect, store, process, and protect your personal information. By using our services, you also agree to our Privacy Policy.`,
  },
  {
    id: 'liability',
    title: '15. Limitation of Liability',
    body: `SkyBook operates as an online flight booking platform and is not the operating airline. Flight delays, cancellations, schedule changes, baggage issues, denied boarding, or in-flight services remain the responsibility of the operating airline and are governed by the airline's Conditions of Carriage and applicable aviation regulations.`,
  },
  {
    id: 'force-majeure',
    title: '16. Force Majeure',
    body: `SkyBook shall not be liable for delays, cancellations, service interruptions, or other failures caused by events beyond our reasonable control, including natural disasters, severe weather, government restrictions, war, civil unrest, epidemics, pandemics, airport closures, or technical failures affecting airline operations.`,
  },
  {
    id: 'termination',
    title: '17. Account Suspension & Termination',
    body: `SkyBook reserves the right to suspend or permanently terminate accounts involved in fraudulent activity, fake bookings, unauthorized payment methods, abusive behavior, or violations of these Terms and Conditions without prior notice.`,
  },
  {
    id: 'law',
    title: '18. Governing Law',
    body: `These Terms and Conditions shall be governed by and interpreted in accordance with the laws of Bangladesh. Any disputes arising from the use of SkyBook shall be subject to the exclusive jurisdiction of the courts of Bangladesh.`,
  },
  {
    id: 'changes-to-terms',
    title: '19. Changes to These Terms',
    body: `SkyBook may revise these Terms and Conditions from time to time to reflect changes in our services, legal obligations, or business practices. Updated versions will be published on this page together with a revised effective date.`,
  },
  {
    id: 'contact',
    title: '20. Contact Us',
    body: `If you have any questions regarding these Terms and Conditions or require legal assistance related to your booking, please contact us at legal@skybook.com or through the SkyBook Help Center. Our customer support team will be happy to assist you.`,
  },
];

export default function TermsOfService() {
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
        icon={FileText}
        eyebrow="Legal"
        title="Terms of Service"
        subtitle="Last updated: 1 July 2026 — please read these terms carefully before booking."
        breadcrumb="Terms of Service"
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
            These Terms of Service govern your use of SkyBook's flight search, booking, and
            account features. Operating airlines' own conditions of carriage apply in addition
            to these terms.
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