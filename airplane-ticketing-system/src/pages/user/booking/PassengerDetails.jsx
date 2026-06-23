import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import BookingStepper from '../../../components/bookings/BookingStepper';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';
import { useBookingFlow } from '../../../context/BookingFlowContext';

const PASSENGER_TYPE_OPTIONS = [
  { value: 'Adult', label: 'Adult' },
  { value: 'Child', label: 'Child' },
  { value: 'Infant', label: 'Infant' },
];

const EMPTY_PASSENGER = {
  firstName: '',
  lastName: '',
  passengerType: 'Adult',
  dateOfBirth: '',
  passportNumber: '',
  passportExpiry: '',
  passportCountry: '',
  mealPreference: '',
  specialAssistance: '',
};

export default function PassengerDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setBookingDraft, passengers, setPassengers } = useBookingFlow();

  useEffect(() => {
    if (location.state?.bookingDraft) {
      setBookingDraft(location.state.bookingDraft);
      if (passengers.length === 0) {
        setPassengers([{ ...EMPTY_PASSENGER }]);
      }
    } else if (!location.state?.bookingDraft && passengers.length === 0) {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addPassenger = () => {
    setPassengers([...passengers, { ...EMPTY_PASSENGER }]);
  };

  const removePassenger = (idx) => {
    if (passengers.length <= 1) return;
    setPassengers(passengers.filter((_, i) => i !== idx));
  };

  const updatePassenger = (idx, field, value) => {
    const next = [...passengers];
    next[idx] = { ...next[idx], [field]: value };
    setPassengers(next);
  };

  const isValid = passengers.every(
    (p) => p.firstName && p.lastName && p.dateOfBirth
  );

  const handleContinue = () => {
    if (!isValid) return;
    navigate('/booking/seats');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <BookingStepper currentStep="passengers" />

      <div className="space-y-5">
        {passengers.map((passenger, idx) => (
          <div key={idx} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Passenger {idx + 1}</h3>
              {passengers.length > 1 && (
                <button
                  onClick={() => removePassenger(idx)}
                  className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={passenger.firstName}
                onChange={(e) => updatePassenger(idx, 'firstName', e.target.value)}
                required
              />
              <Input
                label="Last Name"
                value={passenger.lastName}
                onChange={(e) => updatePassenger(idx, 'lastName', e.target.value)}
                required
              />
              <Select
                label="Passenger Type"
                options={PASSENGER_TYPE_OPTIONS}
                value={passenger.passengerType}
                onChange={(e) => updatePassenger(idx, 'passengerType', e.target.value)}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={passenger.dateOfBirth}
                onChange={(e) => updatePassenger(idx, 'dateOfBirth', e.target.value)}
                required
              />
              <Input
                label="Passport Number"
                value={passenger.passportNumber}
                onChange={(e) => updatePassenger(idx, 'passportNumber', e.target.value)}
              />
              <Input
                label="Passport Country"
                value={passenger.passportCountry}
                onChange={(e) => updatePassenger(idx, 'passportCountry', e.target.value)}
              />
              <Input
                label="Passport Expiry"
                type="date"
                value={passenger.passportExpiry}
                onChange={(e) => updatePassenger(idx, 'passportExpiry', e.target.value)}
              />
              <Input
                label="Meal Preference"
                placeholder="e.g. Vegetarian"
                value={passenger.mealPreference}
                onChange={(e) => updatePassenger(idx, 'mealPreference', e.target.value)}
              />
              <Input
                label="Special Assistance"
                placeholder="e.g. Wheelchair"
                value={passenger.specialAssistance}
                onChange={(e) => updatePassenger(idx, 'specialAssistance', e.target.value)}
                containerClassName="sm:col-span-2"
              />
            </div>
          </div>
        ))}

        <button
          onClick={addPassenger}
          className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          <Plus size={15} /> Add another passenger
        </button>
      </div>

      <div className="flex justify-end mt-8">
        <Button onClick={handleContinue} disabled={!isValid} size="lg">
          Continue to Seat Selection <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}