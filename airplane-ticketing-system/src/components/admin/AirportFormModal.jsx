import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import AirportPhotoManager from './AirportPhotoManager';
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
  const [createdAirport, setCreatedAirport] = useState(null); // holds newly-created airport for photo step
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
    setCreatedAirport(null); // reset photo step whenever modal opens/airport changes
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
      createAirport.mutate(payload, {
        onSuccess: (response) => {
          setCreatedAirport(response.data); // switch to photo-upload step instead of closing
        },
      });
    }
  };

  const isPending = createAirport.isPending || updateAirport.isPending;

  // The airport we should show a photo manager for: either the one being edited, or the one just created
  const photoTargetAirport = airport || createdAirport;
  const showPhotoStep = !!createdAirport && !isEdit;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Airport' : showPhotoStep ? 'Add Photos' : 'Add Airport'}
      size="lg"
    >
      {showPhotoStep ? (
        // ── STEP 2: Airport created, now upload photos ──────────────────────
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2 rounded-lg">
            Airport "{createdAirport.name}" created successfully. You can add up to 5 photos now, or skip and add them later.
          </div>

          <AirportPhotoManager airport={photoTargetAirport} />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        // ── STEP 1: Airport details form ─────────────────────────────────────
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

          {isEdit && (
            <div className="pt-3 border-t border-slate-100">
              <AirportPhotoManager airport={photoTargetAirport} />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isPending}>
              {isEdit ? 'Save Changes' : 'Add Airport'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}