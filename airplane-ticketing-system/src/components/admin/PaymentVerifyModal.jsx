import { useState } from 'react';
import { X, Check, ImageOff } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { useVerifyPayment } from '../../hooks/usePayments';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PaymentVerifyModal({ isOpen, onClose, payment }) {
  const [adminNote, setAdminNote] = useState('');
  const verifyPayment = useVerifyPayment();

  if (!payment) return null;

  const screenshotUrl = payment.screenshotUrl ? `${API_BASE_URL}${payment.screenshotUrl}` : null;

  const handleDecision = (approve) => {
    verifyPayment.mutate(
      { id: payment.id, payload: { approve, adminNote: adminNote || null } },
      { onSuccess: onClose }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Review Payment" size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-slate-400 text-xs mb-0.5">Booking Reference</p>
            <p className="font-mono font-semibold text-slate-800">{payment.bookingReference}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-0.5">Amount</p>
            <p className="font-semibold text-slate-800">
              {payment.currencyCode} {Number(payment.amount).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-0.5">Payment Method</p>
            <p className="text-slate-700">{payment.method}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-0.5">Transaction ID</p>
            <p className="font-mono text-slate-700">{payment.transactionId}</p>
          </div>
        </div>

        <div>
          <p className="text-slate-400 text-xs mb-2">Payment Screenshot</p>
          {screenshotUrl ? (
            <a href={screenshotUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={screenshotUrl}
                alt="Payment proof"
                className="w-full max-h-80 object-contain rounded-xl border border-slate-200 bg-slate-50"
              />
            </a>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-10">
              <ImageOff size={22} className="text-slate-300" />
              <span className="text-sm text-slate-400">No screenshot available</span>
            </div>
          )}
        </div>

        <Input
          label="Admin Note (optional)"
          placeholder="Add a note about this decision..."
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="danger"
            icon={X}
            onClick={() => handleDecision(false)}
            isLoading={verifyPayment.isPending}
          >
            Reject
          </Button>
          <Button
            icon={Check}
            onClick={() => handleDecision(true)}
            isLoading={verifyPayment.isPending}
          >
            Approve
          </Button>
        </div>
      </div>
    </Modal>
  );
}