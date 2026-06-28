import { useState } from 'react';
import { Eye, Search } from 'lucide-react';
import { useBookingsListAdmin } from '../../hooks/useBookings';
import Input from '../../components/common/Input';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import BookingDetailModal from '../../components/admin/BookingDetailModal';
import { format } from 'date-fns';

export default function Bookings() {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [detailModal, setDetailModal] = useState({ open: false, bookingId: null });

  const { data, isLoading } = useBookingsListAdmin({
    PageNumber: pageNumber,
    PageSize: 10,
    SearchTerm: searchTerm || undefined,
  });

  const columns = [
    {
      key: 'bookingReference',
      header: 'Reference',
      render: (row) => <span className="font-mono font-medium">{row.bookingReference}</span>,
    },
    {
      key: 'tripType',
      header: 'Trip Type',
    },
    {
      key: 'totalAmount',
      header: 'Amount',
      render: (row) => `${row.currencyCode} ${row.totalAmount.toFixed(2)}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge status={row.status} />,
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (row) => format(new Date(row.createdAt), 'MMM d, yyyy'),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <button
          onClick={() => setDetailModal({ open: true, bookingId: row.id })}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
        >
          <Eye size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Bookings</h1>
        <p className="text-slate-500 text-sm mt-1">All customer bookings across the platform</p>
      </div>

      <div className="card !p-4">
        <div className="p-4 border-b border-slate-100">
          <Input
            icon={Search}
            placeholder="Search by reference, passenger name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPageNumber(1);
            }}
            containerClassName="max-w-sm"
          />
        </div>

        <Table columns={columns} data={data?.items} isLoading={isLoading} emptyMessage="No bookings found" />

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

      <BookingDetailModal
        isOpen={detailModal.open}
        onClose={() => setDetailModal({ open: false, bookingId: null })}
        bookingId={detailModal.bookingId}
      />
    </div>
  );
}