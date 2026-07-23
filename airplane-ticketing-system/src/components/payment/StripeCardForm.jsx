import { useState } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Button from '../common/Button';
import { Lock, CreditCard, ShieldCheck } from 'lucide-react';

const ELEMENT_STYLE = {
  style: {
    base: {
      fontSize: '15px',
      fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
      color: '#0f172a',
      letterSpacing: '0.02em',
      '::placeholder': { color: '#94a3b8' },
    },
    invalid: { color: '#ef4444' },
  },
};

export default function StripeCardForm({ clientSecret, onSuccess, isCreatingIntent }) {
  const stripe = useStripe();
  const elements = useElements();

  const [zip, setZip] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [focusField, setFocusField] = useState(null);

  const handlePay = async () => {
    if (!stripe || !elements || !clientSecret) return;
    setProcessing(true);
    setError('');

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: {
          address: { postal_code: zip || undefined },
        },
      },
    });

    if (stripeError) {
      setError(stripeError.message || 'Payment failed. Please check your card details.');
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    } else {
      setError(`Payment status: ${paymentIntent.status}. Please try again.`);
      setProcessing(false);
    }
  };

  const fieldBoxClass = (name) =>
    `rounded-xl border px-4 py-3 bg-white transition-all duration-150 ${
      focusField === name
        ? 'border-indigo-500 ring-4 ring-indigo-500/10'
        : 'border-slate-200 hover:border-slate-300'
    }`;

  return (
    <div className="space-y-5">
      {/* Header strip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <CreditCard size={15} className="text-white" />
          </div>
          <span className="text-sm font-semibold">Card Details</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck size={13} className="text-emerald-500" /> Secured by Stripe
        </div>
      </div>

      {/* Card number — full width box */}
      <div>
        <label className="block text-[11px] font-medium text-slate-500 mb-1.5 tracking-wide uppercase">
          Card Number
        </label>
        <div className={fieldBoxClass('number')}>
          <CardNumberElement
            options={{ ...ELEMENT_STYLE, placeholder: '4242 4242 4242 4242' }}
            onFocus={() => setFocusField('number')}
            onBlur={() => setFocusField(null)}
          />
        </div>
      </div>

      {/* 3 boxes: Expiry / CVC / ZIP */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1.5 tracking-wide uppercase">
            Expiry
          </label>
          <div className={fieldBoxClass('expiry')}>
            <CardExpiryElement
              options={{ ...ELEMENT_STYLE, placeholder: 'MM / YY' }}
              onFocus={() => setFocusField('expiry')}
              onBlur={() => setFocusField(null)}
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1.5 tracking-wide uppercase">
            CVC
          </label>
          <div className={fieldBoxClass('cvc')}>
            <CardCvcElement
              options={{ ...ELEMENT_STYLE, placeholder: '123' }}
              onFocus={() => setFocusField('cvc')}
              onBlur={() => setFocusField(null)}
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1.5 tracking-wide uppercase">
            ZIP Code
          </label>
          <div className={fieldBoxClass('zip')}>
            <input
              type="text"
              inputMode="numeric"
              placeholder="12345"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
              onFocus={() => setFocusField('zip')}
              onBlur={() => setFocusField(null)}
              maxLength={10}
              className="w-full text-[15px] text-slate-900 placeholder-slate-400 outline-none bg-transparent"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
          <p className="text-xs text-red-500 leading-relaxed">{error}</p>
        </div>
      )}

      <Button
        type="button"
        size="lg"
        className="w-full !bg-gradient-to-r !from-indigo-600 !to-violet-600 hover:!from-indigo-700 hover:!to-violet-700"
        onClick={handlePay}
        isLoading={processing || isCreatingIntent}
        disabled={!stripe || isCreatingIntent}
      >
        <Lock size={15} className="mr-1.5" /> Pay Securely
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <Lock size={11} /> Your card details are encrypted and never touch our servers
      </p>
    </div>
  );
}