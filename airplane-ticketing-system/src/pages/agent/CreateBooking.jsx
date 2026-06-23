import { useNavigate } from 'react-router-dom';
import FlightSearchForm from '../../components/flights/FlightSearchForm';
import { useSearchOneWay, useSearchRoundTrip, useSearchMultiCity } from '../../hooks/useSearch';

export default function CreateBooking() {
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
        navigate('/agent/search-results', {
          state: { results: response.data, searchType: type, searchPayload: payload },
        });
      },
    });
  };

  const isSearching =
    oneWayMutation.isPending || roundTripMutation.isPending || multiCityMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Create Booking for Customer</h1>
        <p className="text-slate-500 text-sm mt-1">
          Search flights and complete a booking on behalf of a customer
        </p>
      </div>

      <FlightSearchForm onSearch={handleSearch} isSearching={isSearching} />
    </div>
  );
}