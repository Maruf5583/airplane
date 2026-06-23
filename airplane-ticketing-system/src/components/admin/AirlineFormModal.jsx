import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useCreateAirline, useUpdateAirline } from '../../hooks/useAirlinesAirports';

const EMPTY_FORM = {
  iataCode: '',
  name: '',
  country: '',
  logoUrl: '',
  contactEmail: '',
};

export default function AirlineFormModal({ isOpen, onClose, airline }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const createAirline = useCreateAirline();
  const updateAirline = useUpdateAirline();
  const isEdit = !!airline;

  useEffect(() => {
    if (airline) {
      setForm({
        iataCode: airline.iataCode || '',
        name: airline.name || '',
        country: airline.country || '',
        logoUrl: airline.logoUrl || '',
        contactEmail: airline.contactEmail || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [airline, isOpen]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      updateAirline.mutate({ id: airline.id, payload: form }, { onSuccess: onClose });
    } else {
      createAirline.mutate(form, { onSuccess: onClose });
    }
  };

  const isPending = createAirline.isPending || updateAirline.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Airline' : 'Add Airline'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="IATA Code"
            name="iataCode"
            placeholder="e.g. EK"
            value={form.iataCode}
            onChange={handleChange}
            maxLength={3}
            required
          />
          <Input
            label="Airline Name"
            name="name"
            placeholder="e.g. Emirates"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <Input
          label="Country"
          name="country"
          placeholder="e.g. United Arab Emirates"
          value={form.country}
          onChange={handleChange}
          required
        />
        <Input
          label="Logo URL"
          name="logoUrl"
          placeholder="https://..."
          value={form.logoUrl}
          onChange={handleChange}
        />
        <Input
          label="Contact Email"
          type="email"
          name="contactEmail"
          placeholder="contact@airline.com"
          value={form.contactEmail}
          onChange={handleChange}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending}>
            {isEdit ? 'Save Changes' : 'Add Airline'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}