import { useNavigate } from 'react-router-dom';
import { Shield, Clock, HeadphonesIcon } from 'lucide-react';
import FlightSearchForm from '../../components/flights/FlightSearchForm';
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

export default function Home() {
  const navigate = useNavigate();
  const oneWayMutation = useSearchOneWay();
  const roundTripMutation = useSearchRoundTrip();
  const multiCityMutation = useSearchMultiCity();

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

  const isSearching =
    oneWayMutation.isPending || roundTripMutation.isPending || multiCityMutation.isPending;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 pt-12 pb-32 sm:pb-40 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 bg-white rounded-full -top-32 -left-20" />
          <div className="absolute w-72 h-72 bg-white rounded-full bottom-0 right-10" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Find your next flight
          </h1>
          <p className="text-primary-100 text-sm sm:text-base max-w-xl mx-auto">
            Compare prices, book in minutes, and travel with confidence — anywhere in the world.
          </p>
        </div>
      </section>

      {/* Search form - overlapping hero */}
      <div className="max-w-4xl mx-auto px-4 -mt-24 sm:-mt-28 relative z-20">
        <FlightSearchForm onSearch={handleSearch} isSearching={isSearching} />
      </div>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="text-center p-6">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-3">
                <f.icon size={22} />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{f.title}</h3>
              <p className="text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}