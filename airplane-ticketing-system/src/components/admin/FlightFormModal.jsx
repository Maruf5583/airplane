import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useAirlinesList, useAirportsList } from '../../hooks/useAirlinesAirports';
import { useCreateFlight, useUpdateFlight } from '../../hooks/useFlights';

import { useAircraftsList } from '../../hooks/useAircrafts';
import { useRoutesList } from '../../hooks/useRoutes';

const EMPTY_FORM = {
  flightNumber: '',
  airlineId: '',
  aircraftId: '',
  routeId: '',
  departureTime: '',
  arrivalTime: '',
  economyBasePrice: '',
  businessBasePrice: '',
  firstClassBasePrice: '',
  airportFee: '',
  taxPercentage: '',
  gateNumber: '',
};

export default function FlightFormModal({ isOpen, onClose, flight }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const { data: airlines } = useAirlinesList();
  const { data: aircrafts } = useAircraftsList();
  const { data: routes } = useRoutesList();
  const createFlight = useCreateFlight();
  const updateFlight = useUpdateFlight();
  const isEdit = !!flight;

  useEffect(() => {
    if (flight) {
      setForm({
        flightNumber: flight.flightNumber || '',
        airlineId: flight.airlineId || '',
        aircraftId: flight.aircraftId || '',
        routeId: flight.routeId || '',
        departureTime: flight.departureTime?.slice(0, 16) || '',
        arrivalTime: flight.arrivalTime?.slice(0, 16) || '',
        economyBasePrice: flight.economyBasePrice ?? '',
        businessBasePrice: flight.businessBasePrice ?? '',
        firstClassBasePrice: flight.firstClassBasePrice ?? '',
        airportFee: flight.airportFee ?? '',
        taxPercentage: flight.taxPercentage ?? '',
        gateNumber: flight.gateNumber || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [flight, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      economyBasePrice: parseFloat(form.economyBasePrice),
      businessBasePrice: parseFloat(form.businessBasePrice),
      firstClassBasePrice: parseFloat(form.firstClassBasePrice),
      airportFee: parseFloat(form.airportFee),
      taxPercentage: parseFloat(form.taxPercentage),
      departureTime: new Date(form.departureTime).toISOString(),
      arrivalTime: new Date(form.arrivalTime).toISOString(),
    };

    if (isEdit) {
      updateFlight.mutate(
        { id: flight.id, payload },
        { onSuccess: onClose }
      );
    } else {
      createFlight.mutate(payload, { onSuccess: onClose });
    }
  };

  const airlineOptions = (airlines || []).map((a) => ({
    value: a.id,
    label: `${a.name} (${a.iataCode})`,
  }));

  const aircraftOptions = (aircrafts || []).map((a) => ({
  value: a.id,
  label: `${a.model} — ${a.registrationNumber}`,
}));

const routeOptions = (routes || []).map((r) => ({
  value: r.id,
  label: `${r.originIata} (${r.originCity}) → ${r.destinationIata} (${r.destinationCity})`,
}));

  const isPending = createFlight.isPending || updateFlight.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Flight' : 'Create New Flight'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Flight Number"
            name="flightNumber"
            placeholder="e.g. SK101"
            value={form.flightNumber}
            onChange={handleChange}
            required
          />
          <Select
            label="Airline"
            name="airlineId"
            options={airlineOptions}
            placeholder="Select airline"
            value={form.airlineId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
         <Select
  label="Aircraft"
  name="aircraftId"
  options={aircraftOptions}
  placeholder="Select aircraft"
  value={form.aircraftId}
  onChange={handleChange}
  required
/>
<Select
  label="Route"
  name="routeId"
  options={routeOptions}
  placeholder="Select route"
  value={form.routeId}
  onChange={handleChange}
  required
/>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Departure Time"
            type="datetime-local"
            name="departureTime"
            value={form.departureTime}
            onChange={handleChange}
            required
          />
          <Input
            label="Arrival Time"
            type="datetime-local"
            name="arrivalTime"
            value={form.arrivalTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Economy Price"
            type="number"
            step="0.01"
            name="economyBasePrice"
            value={form.economyBasePrice}
            onChange={handleChange}
            required
          />
          <Input
            label="Business Price"
            type="number"
            step="0.01"
            name="businessBasePrice"
            value={form.businessBasePrice}
            onChange={handleChange}
            required
          />
          <Input
            label="First Class Price"
            type="number"
            step="0.01"
            name="firstClassBasePrice"
            value={form.firstClassBasePrice}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Airport Fee"
            type="number"
            step="0.01"
            name="airportFee"
            value={form.airportFee}
            onChange={handleChange}
            required
          />
          <Input
            label="Tax %"
            type="number"
            step="0.01"
            name="taxPercentage"
            value={form.taxPercentage}
            onChange={handleChange}
            required
          />
          <Input
            label="Gate Number"
            name="gateNumber"
            placeholder="e.g. A12"
            value={form.gateNumber}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending}>
            {isEdit ? 'Save Changes' : 'Create Flight'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}