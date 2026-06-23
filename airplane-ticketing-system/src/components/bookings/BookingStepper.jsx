import { Check } from 'lucide-react';
import clsx from 'clsx';

const STEPS = [
  { key: 'passengers', label: 'Passenger Details' },
  { key: 'seats', label: 'Seat Selection' },
  { key: 'review', label: 'Review & Pay' },
];

export default function BookingStepper({ currentStep }) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
      {STEPS.map((step, idx) => (
        <div key={step.key} className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <div
              className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0',
                idx < currentIndex
                  ? 'bg-primary-600 text-white'
                  : idx === currentIndex
                  ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500'
                  : 'bg-slate-100 text-slate-400'
              )}
            >
              {idx < currentIndex ? <Check size={15} /> : idx + 1}
            </div>
            <span
              className={clsx(
                'text-sm font-medium hidden sm:block',
                idx === currentIndex ? 'text-slate-800' : 'text-slate-400'
              )}
            >
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={clsx(
                'w-8 sm:w-16 h-px',
                idx < currentIndex ? 'bg-primary-500' : 'bg-slate-200'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}