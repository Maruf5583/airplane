import { useState } from 'react';
import { Plus, Pencil, Trash2, RadioTower, Grid3x3, Search } from 'lucide-react';
import { useFlightsList, useDeleteFlight } from '../../hooks/useFlights';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import FlightFormModal from '../../components/admin/FlightFormModal';
import StatusUpdateModal from '../../components/admin/StatusUpdateModal';
import SeatMapModal from '../../components/admin/SeatMapModal';
import { format } from 'date-fns';

export default function Flights() {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [formModal, setFormModal] = useState({ open: false, flight: null });
  const [statusModal, setStatusModal] = useState({ open: false, flight: null });
  const [seatModal, setSeatModal] = useState({ open: false, flight: null });

  const { data, isLoading } = useFlightsList({
    PageNumber: pageNumber,
    PageSize: 10,
    SearchTerm: searchTerm || undefined,
  });

  const deleteFlight = useDeleteFlight();

  const handleDelete = (flight) => {
    if (window.confirm(`Delete flight ${flight.flightNumber}? This cannot be undone.`)) {
      deleteFlight.mutate(flight.id);
    }
  };

  const columns = [
    {
      key: 'flightNumber',
      header: 'Flight',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800">{row.flightNumber}</p>
          <p className="text-xs text-slate-400">{row.airlineName}</p>
        </div>
      ),
    },
    {
      key: 'route',
      header: 'Route',
      render: (row) => (
        <span className="font-medium">
          {row.originIata} → {row.destinationIata}
        </span>
      ),
    },
    {
      key: 'departureTime',
      header: 'Departure',
      render: (row) => format(new Date(row.departureTime), 'MMM d, yyyy · h:mm a'),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge status={row.status} />,
    },
    {
      key: 'seats',
      header: 'Available Seats',
      render: (row) => (
        <span className="text-slate-600">
          {row.availableEconomySeats + row.availableBusinessSeats + row.availableFirstClassSeats}
        </span>
      ),
    },
    {
      key: 'economyBasePrice',
      header: 'Base Price',
      render: (row) => `$${row.economyBasePrice.toFixed(2)}`,
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            title="View seat map"
            onClick={() => setSeatModal({ open: true, flight: row })}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <Grid3x3 size={16} />
          </button>
          <button
            title="Update status"
            onClick={() => setStatusModal({ open: true, flight: row })}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <RadioTower size={16} />
          </button>
          <button
            title="Edit flight"
            onClick={() => setFormModal({ open: true, flight: row })}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <Pencil size={16} />
          </button>
          <button
            title="Delete flight"
            onClick={() => handleDelete(row)}
            className="p-2 rounded-lg hover:bg-red-50 text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Flights</h1>
          <p className="text-slate-500 text-sm mt-1">Manage scheduled flights and their status</p>
        </div>
        <Button icon={Plus} onClick={() => setFormModal({ open: true, flight: null })}>
          Add Flight
        </Button>
      </div>

      <div className="card !p-4">
        <div className="p-4 border-b border-slate-100">
          <Input
            icon={Search}
            placeholder="Search by flight number, route..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPageNumber(1);
            }}
            containerClassName="max-w-sm"
          />
        </div>

        <Table columns={columns} data={data?.items} isLoading={isLoading} emptyMessage="No flights found" />

        {data && (
          <Pagination
            pageNumber={data.pageNumber}
            totalPages={data.totalPages}
            hasNextPage={data.hasNextPage}
            hasPreviousPage={data.hasPreviousPage}
            onPageChange={setPageNumber}
          />
        )}
      </div>

      <FlightFormModal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, flight: null })}
        flight={formModal.flight}
      />

      <StatusUpdateModal
        isOpen={statusModal.open}
        onClose={() => setStatusModal({ open: false, flight: null })}
        flight={statusModal.flight}
      />

      <SeatMapModal
        isOpen={seatModal.open}
        onClose={() => setSeatModal({ open: false, flight: null })}
        flightId={seatModal.flight?.id}
        flightNumber={seatModal.flight?.flightNumber}
      />
    </div>
  );
}