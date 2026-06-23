import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Spinner from '../../../components/common/Spinner';
import { useCreatePaymentIntent, useConfirmPayment } from '../../../hooks/usePaymentFlow';
import { useBookingFlow } from '../../../context/BookingFlowContext';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetFlow } = useBookingFlow();
  const booking = location.state?.booking;

  const [paymentIntent, setPaymentIntent] = useState(null);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });

  const createIntent = useCreatePaymentIntent();
  const confirmPayment = useConfirmPayment();

  useEffect(() => {
    if (!booking) {
      navigate('/');
      return;
    }
    createIntent.mutate(booking.id, {
      onSuccess: (response) => setPaymentIntent(response.data),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!booking) return null;

  const handlePay = (e) => {
    e.preventDefault();
    if (!paymentIntent) return;

    // ⚠️ STRIPE INTEGRATION POINT:
    // If using real Stripe, replace this whole block with:
    //   const stripe = await stripePromise;
    //   const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
    //     payment_method: { card: elements.getElement(CardElement) }
    //   });
    // Then call confirmPayment.mutate(result.paymentIntent.id) only on success.
    // Below is a direct-confirm flow assuming your backend handles card capture itself.

    confirmPayment.mutate(paymentIntent.paymentIntentId, {
      onSuccess: (response) => {
        resetFlow();
        navigate('/booking/confirmation', {
          state: { payment: response.data, bookingId: booking.id },
        });
      },
    });
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-3">
          <Lock size={20} className="text-primary-600" />
        </div>
        <h1 className="text-xl font-bold text-slate-800">Secure Payment</h1>
        <p className="text-sm text-slate-500 mt-1">Complete your booking payment</p>
      </div>

      <div className="card mb-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Booking Reference</span>
          <span className="font-mono font-semibold text-slate-800">{booking.bookingReference}</span>
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
          <span className="text-sm text-slate-500">Total Amount</span>
          <span className="text-lg font-bold text-primary-700">
            {booking.currencyCode} {booking.totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {!paymentIntent ? (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      ) : (
        <form onSubmit={handlePay} className="card space-y-4">
          <Input
            label="Cardholder Name"
            icon={CreditCard}
            placeholder="Name on card"
            value={cardDetails.name}
            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
            required
          />
          <Input
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            value={cardDetails.number}
            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
            maxLength={19}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Expiry"
              placeholder="MM/YY"
              value={cardDetails.expiry}
              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
              maxLength={5}
              required
            />
            <Input
              label="CVC"
              placeholder="123"
              value={cardDetails.cvc}
              onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
              maxLength={4}
              required
            />
          </div>

          <p className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck size={13} /> Your payment is encrypted and secure
          </p>

          <Button type="submit" size="lg" className="w-full" isLoading={confirmPayment.isPending}>
            Pay {booking.currencyCode} {booking.totalAmount.toFixed(2)}
          </Button>
        </form>
      )}

      <button
        onClick={() => navigate('/booking/review')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mt-5 mx-auto"
      >
        <ArrowLeft size={14} /> Back to review
      </button>
    </div>
  );
}