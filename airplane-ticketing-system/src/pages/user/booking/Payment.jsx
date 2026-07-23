import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Landmark, Lock, ArrowLeft, ShieldCheck, Upload, X, ImageIcon, CreditCard } from 'lucide-react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import StripeCardForm from '../../../components/payment/StripeCardForm';   // ADD THIS
import { useSubmitPayment, useCreatePaymentIntent, useConfirmStripePayment } from '../../../hooks/usePaymentFlow';   // ADD 2 hooks
import { useSettings } from '../../../hooks/useSettings';   // ADD THIS
import { useBookingFlow } from '../../../context/BookingFlowContext';

const PAYMENT_METHODS = [
  { value: 'Card', label: 'Card' },   // ADD — সবচেয়ে উপরে card option
  { value: 'BKash', label: 'bKash' },
  { value: 'Nagad', label: 'Nagad' },
  { value: 'Rocket', label: 'Rocket' },
  { value: 'BankTransfer', label: 'Bank Transfer' },
  { value: 'Other', label: 'Other' },
];

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 5;

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetFlow } = useBookingFlow();
  const booking = location.state?.booking;

  const [method, setMethod] = useState(null);   
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const submitPayment = useSubmitPayment();
  const { data: settings } = useSettings();   // ADD THIS — publishable key এখান থেকে আসবে

  // ADD BELOW — Card payment state
  const [clientSecret, setClientSecret] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const createIntent = useCreatePaymentIntent();
  const confirmStripe = useConfirmStripePayment();

  // ADD BELOW — publishable key পেলে Stripe.js load করা
  useEffect(() => {
    if (settings?.stripePublishableKey) {
      setStripePromise(loadStripe(settings.stripePublishableKey));
    }
  }, [settings?.stripePublishableKey]);

  // ADD BELOW — Card method সিলেক্ট করলে backend থেকে PaymentIntent তৈরি করা
  useEffect(() => {
    if (method === 'Card' && booking?.id && !clientSecret) {
      createIntent.mutate(booking.id, {
        onSuccess: (data) => setClientSecret(data.clientSecret),
      });
    }
  }, [method, booking?.id]);

  if (!booking) {
    navigate('/');
    return null;
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Only JPEG, PNG, or WEBP images are allowed.');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`File must be under ${MAX_SIZE_MB}MB.`);
      e.target.value = '';
      return;
    }

    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeScreenshot = () => {
    if (preview) URL.revokeObjectURL(preview);
    setScreenshot(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!transactionId || !screenshot) return;

    const formData = new FormData();
    formData.append('BookingId', booking.id);
    formData.append('TransactionId', transactionId);
    formData.append('Method', method);
    formData.append('Screenshot', screenshot);

    submitPayment.mutate(
      { bookingId: booking.id, formData },
      {
        onSuccess: (response) => {
          resetFlow();
          navigate('/booking/confirmation', {
            state: { payment: response.data, bookingId: booking.id, pendingVerification: true },
          });
        },
      }
    );
  };

  // ADD BELOW — Card payment success হলে backend confirm + confirmation page
  const handleCardPaymentSuccess = (paymentIntentId) => {
    confirmStripe.mutate(paymentIntentId, {
      onSuccess: (response) => {
        resetFlow();
        navigate('/booking/confirmation', {
          state: { payment: response, bookingId: booking.id, pendingVerification: false },
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
        <h1 className="text-xl font-bold text-slate-800">Complete Your Payment</h1>
        <p className="text-sm text-slate-500 mt-1">
          {method === 'Card'
            ? 'Enter your card details to pay instantly'
            : 'Pay using your preferred method, then submit the transaction details below'}
        </p>
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

      {/* Payment method selector — এখন card component-এর বাইরে, দুই flow-এই কমন */}
      <div className="card mb-5">
        <label className="label-text mb-2 block">Payment Method</label>
        <div className="grid grid-cols-3 gap-2">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMethod(m.value)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-colors ${
                method === m.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {m.value === 'Card' ? <CreditCard size={16} /> : <Landmark size={16} />}
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* ADD THIS — Card flow */}
      {method === 'Card' ? (
        <div className="card">
          {!stripePromise || !clientSecret ? (
            <p className="text-sm text-slate-400 text-center py-6">Preparing secure payment form...</p>
          ) : (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripeCardForm
                clientSecret={clientSecret}
                onSuccess={handleCardPaymentSuccess}
                isCreatingIntent={confirmStripe.isPending}
              />
            </Elements>
          )}
        </div>
      ) : (
        /* Manual flow — unchanged, শুধু method selector উপরে move হয়েছে */
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-500 leading-relaxed">
            Send <strong className="text-slate-700">{booking.currencyCode} {booking.totalAmount.toFixed(2)}</strong> to
            our {PAYMENT_METHODS.find((m) => m.value === method)?.label} account, then enter the transaction ID and
            upload a screenshot of the payment confirmation below.
          </div>

          <Input
            label="Transaction ID"
            placeholder="e.g. 8N7A2K9X1M"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            required
          />

          <div>
            <label className="label-text mb-2 block">Payment Screenshot</label>

            {!preview ? (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                id="payment-screenshot-input"
              />
            ) : null}

            {preview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200">
                <img src={preview} alt="Payment proof" className="w-full max-h-64 object-contain bg-slate-50" />
                <button
                  type="button"
                  onClick={removeScreenshot}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label
                htmlFor="payment-screenshot-input"
                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-8 cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-colors"
              >
                <ImageIcon size={22} className="text-slate-300" />
                <span className="text-sm text-slate-500">Click to upload screenshot</span>
                <span className="text-xs text-slate-400">JPEG, PNG or WEBP, up to 5MB</span>
              </label>
            )}
          </div>

          <p className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck size={13} /> Your payment will be verified by our team within 24 hours
          </p>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            icon={Upload}
            isLoading={submitPayment.isPending}
            disabled={!transactionId || !screenshot}
          >
            Submit Payment Proof
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