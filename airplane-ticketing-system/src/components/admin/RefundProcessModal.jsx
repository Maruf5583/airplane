import { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useProcessRefund } from '../../hooks/usePayments';

export default function RefundProcessModal({ isOpen, onClose, refundId }) {
  const [denialReason, setDenialReason] = useState('');
  const processRefund = useProcessRefund();

  const handleProcess = (approve) => {
    processRefund.mutate(
      { id: refundId, payload: { approve, denialReason: approve ? null : denialReason } },
      { onSuccess: onClose }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Process Refund Request">
      <div className="space-y-4">
        <p className="text-sm text-slate-500">
          Review the refund request and approve or deny it. This action cannot be undone.
        </p>

        <Input
          label="Denial Reason (only if denying)"
          placeholder="e.g. Outside cancellation window"
          value={denialReason}
          onChange={(e) => setDenialReason(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="danger"
            onClick={() => handleProcess(false)}
            isLoading={processRefund.isPending}
            disabled={!denialReason}
          >
            Deny Refund
          </Button>
          <Button
            variant="success"
            onClick={() => handleProcess(true)}
            isLoading={processRefund.isPending}
          >
            Approve Refund
          </Button>
        </div>
      </div>
    </Modal>
  );
}