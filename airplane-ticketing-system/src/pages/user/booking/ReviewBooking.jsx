import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, Check, X } from 'lucide-react';
import BookingStepper from '../../../components/bookings/BookingStepper';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { useBookingFlow } from '../../../context/BookingFlowContext';
import { useCreateBooking } from '../../../hooks/useBookings';
import { paymentsApi } from '../../../api/paymentsApi';

export default function ReviewBooking() {
  const navigate = useNavigate();
  const { bookingDraft, passengers, promoCode, setPromoCode, setCreatedBooking } = useBookingFlow();
  const [promoInput, setPromoInput] = useState(promoCode || '');
  const [promoStatus, setPromoStatus] = useState(null); // null | 'valid' | 'invalid'
  const [promoMessage, setPromoMessage] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  const createBooking = useCreateBooking();

  useEffect(() => {
    if (!bookingDraft) navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!bookingDraft) return null;

  const handleValidatePromo = async () => {
    if (!promoInput) return;
    setIsValidatingPromo(true);
    try {
      const { data } = await paymentsApi.validatePromo({
        code: promoInput,
        cartTotal: 0, // estimated server-side; backend recalculates at booking time
      });
      if (data.isValid) {
        setPromoStatus('valid');
        setPromoMessage(data.message || 'Promo code applied');
        setPromoCode(promoInput);
      } else {
        setPromoStatus('invalid');
        setPromoMessage(data.message || 'Invalid promo code');
        setPromoCode('');
      }
    } catch (err) {
      setPromoStatus('invalid');
      setPromoMessage('Could not validate promo code');
      setPromoCode('');
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleConfirmBooking = () => {
    const payload = {
      tripType: bookingDraft.tripType,
      segments: bookingDraft.segments,
      passengers: passengers.map((p) => ({
        firstName: p.firstName,
        lastName: p.lastName,
        passengerType: p.passengerType,
        dateOfBirth: p.dateOfBirth,
        passportNumber: p.passportNumber || null,
        passportExpiry: p.passportExpiry || null,
        passportCountry: p.passportCountry || null,
        seatId: p.seatId || null,
        mealPreference: p.mealPreference || null,
        specialAssistance: p.specialAssistance || null,
      })),
      promoCode: promoCode || null,
    };

    createBooking.mutate(payload, {
      onSuccess: (response) => {
        setCreatedBooking(response.data);
        navigate('/booking/payment', { state: { booking: response.data } });
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <BookingStepper currentStep="review" />

      <div className="space-y-5">
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">Trip Summary</h3>
          <p className="text-sm text-slate-500 mb-1">
            Trip Type: <span className="font-medium text-slate-700">{bookingDraft.tripType}</span>
          </p>
          <p className="text-sm text-slate-500">
            Flights: <span className="font-medium text-slate-700">{bookingDraft.segments.length}</span>
          </p>
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">Passengers</h3>
          <div className="space-y-2">
            {passengers.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm py-2 border-b border-slate-50 last:border-0">
                <span className="text-slate-700">
                  {p.firstName} {p.lastName} ({p.passengerType})
                </span>
                <span className="text-slate-400">DOB: {p.dateOfBirth}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Tag size={16} /> Promo Code
          </h3>
          <div className="flex gap-2">
            <Input
              placeholder="Enter promo code"
              value={promoInput}
              onChange={(e) => {
                setPromoInput(e.target.value.toUpperCase());
                setPromoStatus(null);
              }}
              containerClassName="flex-1"
            />
            <Button
              variant="secondary"
              onClick={handleValidatePromo}
              isLoading={isValidatingPromo}
              disabled={!promoInput}
            >
              Apply
            </Button>
          </div>
          {promoStatus && (
            <p
              className={`flex items-center gap-1.5 text-sm mt-2 ${
                promoStatus === 'valid' ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              {promoStatus === 'valid' ? <Check size={14} /> : <X size={14} />}
              {promoMessage}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="secondary" onClick={() => navigate('/booking/seats')}>
          <ArrowLeft size={16} /> Back
        </Button>
        <Button onClick={handleConfirmBooking} isLoading={createBooking.isPending} size="lg">
          Confirm Booking
        </Button>
      </div>
    </div>
  );
}