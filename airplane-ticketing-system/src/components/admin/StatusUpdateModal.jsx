import { useState } from 'react';
import Modal from '../common/Modal';
import Select from '../common/Select';
import Input from '../common/Input';
import Button from '../common/Button';
import { useUpdateFlightStatus } from '../../hooks/useFlights';

const STATUS_OPTIONS = [
  { value: 'Scheduled', label: 'Scheduled' },
  { value: 'Delayed', label: 'Delayed' },
  { value: 'Cancelled', label: 'Cancelled' },
  { value: 'Boarding', label: 'Boarding' },
  { value: 'Departed', label: 'Departed' },
  { value: 'Arrived', label: 'Arrived' },
];

export default function StatusUpdateModal({ isOpen, onClose, flight }) {
  const [form, setForm] = useState({ status: '', gateNumber: '', delayReason: '' });
  const updateStatus = useUpdateFlightStatus();

  const handleOpen = () => {
    if (flight) {
      setForm({
        status: flight.status || '',
        gateNumber: flight.gateNumber || '',
        delayReason: '',
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateStatus.mutate(
      { id: flight.id, payload: form },
      { onSuccess: onClose }
    );
  };

  if (isOpen && form.status === '' && flight) handleOpen();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Update Status — ${flight?.flightNumber || ''}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Flight Status"
          options={STATUS_OPTIONS}
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          required
        />
        <Input
          label="Gate Number"
          placeholder="e.g. B7"
          value={form.gateNumber}
          onChange={(e) => setForm({ ...form, gateNumber: e.target.value })}
        />
        {form.status === 'Delayed' && (
          <Input
            label="Delay Reason"
            placeholder="e.g. Weather conditions"
            value={form.delayReason}
            onChange={(e) => setForm({ ...form, delayReason: e.target.value })}
          />
        )}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={updateStatus.isPending}>
            Update Status
          </Button>
        </div>
      </form>
    </Modal>
  );
}