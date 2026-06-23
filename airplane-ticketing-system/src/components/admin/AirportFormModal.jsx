import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useCreateAirport, useUpdateAirport } from '../../hooks/useAirlinesAirports';

const EMPTY_FORM = {
  iataCode: '',
  icaoCode: '',
  name: '',
  city: '',
  country: '',
  countryCode: '',
  latitude: '',
  longitude: '',
  timeZone: '',
};

export default function AirportFormModal({ isOpen, onClose, airport }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const createAirport = useCreateAirport();
  const updateAirport = useUpdateAirport();
  const isEdit = !!airport;

  useEffect(() => {
    if (airport) {
      setForm({
        iataCode: airport.iataCode || '',
        icaoCode: airport.icaoCode || '',
        name: airport.name || '',
        city: airport.city || '',
        country: airport.country || '',
        countryCode: airport.countryCode || '',
        latitude: airport.latitude ?? '',
        longitude: airport.longitude ?? '',
        timeZone: airport.timeZone || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [airport, isOpen]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
    };
    if (isEdit) {
      updateAirport.mutate({ id: airport.id, payload }, { onSuccess: onClose });
    } else {
      createAirport.mutate(payload, { onSuccess: onClose });
    }
  };

  const isPending = createAirport.isPending || updateAirport.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Airport' : 'Add Airport'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Input
            label="IATA Code"
            name="iataCode"
            placeholder="e.g. JFK"
            value={form.iataCode}
            onChange={handleChange}
            maxLength={3}
            required
          />
          <Input
            label="ICAO Code"
            name="icaoCode"
            placeholder="e.g. KJFK"
            value={form.icaoCode}
            onChange={handleChange}
          />
          <Input
            label="Time Zone"
            name="timeZone"
            placeholder="e.g. America/New_York"
            value={form.timeZone}
            onChange={handleChange}
          />
        </div>

        <Input
          label="Airport Name"
          name="name"
          placeholder="e.g. John F. Kennedy International"
          value={form.name}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="City"
            name="city"
            placeholder="e.g. New York"
            value={form.city}
            onChange={handleChange}
            required
          />
          <Input
            label="Country"
            name="country"
            placeholder="e.g. United States"
            value={form.country}
            onChange={handleChange}
            required
          />
          <Input
            label="Country Code"
            name="countryCode"
            placeholder="e.g. US"
            value={form.countryCode}
            onChange={handleChange}
            maxLength={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Latitude"
            type="number"
            step="any"
            name="latitude"
            placeholder="e.g. 40.6413"
            value={form.latitude}
            onChange={handleChange}
            required
          />
          <Input
            label="Longitude"
            type="number"
            step="any"
            name="longitude"
            placeholder="e.g. -73.7781"
            value={form.longitude}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending}>
            {isEdit ? 'Save Changes' : 'Add Airport'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}