import { useState } from 'react';
import { Plus, Pencil, Building2 } from 'lucide-react';
import { useAirlinesList } from '../../hooks/useAirlinesAirports';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import EmptyState from '../../components/common/EmptyState';
import AirlineFormModal from '../../components/admin/AirlineFormModal';

export default function Airlines() {
  const [formModal, setFormModal] = useState({ open: false, airline: null });
  const { data: airlines, isLoading } = useAirlinesList();

  const columns = [
    {
      key: 'logo',
      header: '',
      render: (row) =>
        row.logoUrl ? (
          <img src={row.logoUrl} alt={row.name} className="w-9 h-9 rounded-lg object-contain bg-slate-50 p-1" />
        ) : (
          <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
            <Building2 size={16} className="text-primary-500" />
          </div>
        ),
    },
    { key: 'name', header: 'Airline Name' },
    {
      key: 'iataCode',
      header: 'IATA',
      render: (row) => (
        <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{row.iataCode}</span>
      ),
    },
    { key: 'country', header: 'Country' },
    { key: 'contactEmail', header: 'Contact Email' },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <button
          onClick={() => setFormModal({ open: true, airline: row })}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
        >
          <Pencil size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Airlines</h1>
          <p className="text-slate-500 text-sm mt-1">Manage partner airlines</p>
        </div>
        <Button icon={Plus} onClick={() => setFormModal({ open: true, airline: null })}>
          Add Airline
        </Button>
      </div>

      <div className="card !p-4">
        {!isLoading && (!airlines || airlines.length === 0) ? (
          <EmptyState
            icon={Building2}
            title="No airlines yet"
            description="Add your first airline to start scheduling flights."
            action={
              <Button icon={Plus} onClick={() => setFormModal({ open: true, airline: null })}>
                Add Airline
              </Button>
            }
          />
        ) : (
          <Table columns={columns} data={airlines} isLoading={isLoading} />
        )}
      </div>

      <AirlineFormModal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, airline: null })}
        airline={formModal.airline}
      />
    </div>
  );
}