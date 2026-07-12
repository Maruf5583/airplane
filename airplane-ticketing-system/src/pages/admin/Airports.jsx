import { useState } from 'react';
import { Plus, Pencil, Trash2, MapPin, Search, ImageOff } from 'lucide-react';
import { useAirportsList, useDeleteAirport } from '../../hooks/useAirlinesAirports';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import AirportFormModal from '../../components/admin/AirportFormModal';

export default function Airports() {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [formModal, setFormModal] = useState({ open: false, airport: null });

  const { data, isLoading } = useAirportsList({
    PageNumber: pageNumber,
    PageSize: 10,
    SearchTerm: searchTerm || undefined,
  });

  const deleteAirport = useDeleteAirport();

  const handleDelete = (airport) => {
    if (window.confirm(`Delete airport ${airport.iataCode} - ${airport.name}?`)) {
      deleteAirport.mutate(airport.id);
    }
  };

  const columns = [
    {
     
  key: 'photo',
  header: 'Photo',
  render: (row) => {
    const primaryPhoto = row.photos?.find((p) => p.isPrimary) || row.photos?.[0];
    const photoUrl = primaryPhoto
      ? `${import.meta.env.VITE_API_BASE_URL}${primaryPhoto.url}`
      : null;

    return photoUrl ? (
      <img
        src={photoUrl}
        alt={row.name}
        className="w-12 h-12 rounded-lg object-cover border border-slate-200"
      />
    ) : (
      <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300">
        <ImageOff size={18} />
      </div>
    );
  },
},
    {
      key: 'iataCode',
      header: 'Code',
      render: (row) => (
        <span className="font-mono text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded font-semibold">
          {row.iataCode}
        </span>
      ),
    },
    { key: 'name', header: 'Airport Name' },
    {
      key: 'location',
      header: 'Location',
      render: (row) => (
        <span className="flex items-center gap-1.5 text-slate-600">
          <MapPin size={13} className="text-slate-400" />
          {row.city}, {row.country}
        </span>
      ),
    },
    { key: 'timeZone', header: 'Time Zone' },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFormModal({ open: true, airport: row })}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <Pencil size={16} />
          </button>
          <button
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
          <h1 className="text-2xl font-bold text-slate-800">Airports</h1>
          <p className="text-slate-500 text-sm mt-1">Manage airport directory</p>
        </div>
        <Button icon={Plus} onClick={() => setFormModal({ open: true, airport: null })}>
          Add Airport
        </Button>
      </div>

      <div className="card !p-4">
        <div className="p-4 border-b border-slate-100">
          <Input
            icon={Search}
            placeholder="Search by IATA code, city, name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPageNumber(1);
            }}
            containerClassName="max-w-sm"
          />
        </div>

        <Table columns={columns} data={data?.items} isLoading={isLoading} emptyMessage="No airports found" />

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

      <AirportFormModal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, airport: null })}
        airport={formModal.airport}
      />
    </div>
  );
}