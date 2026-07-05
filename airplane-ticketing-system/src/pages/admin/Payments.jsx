import { useState } from 'react';
import { Search, RotateCcw, Eye } from 'lucide-react';
import { usePaymentsListAdmin } from '../../hooks/usePayments';
import Input from '../../components/common/Input';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import RefundProcessModal from '../../components/admin/RefundProcessModal';
import PaymentVerifyModal from '../../components/admin/PaymentVerifyModal';
import { format } from 'date-fns';

export default function Payments() {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [refundModal, setRefundModal] = useState({ open: false, refundId: null });
  const [verifyModal, setVerifyModal] = useState({ open: false, payment: null });

  const { data, isLoading } = usePaymentsListAdmin({
    PageNumber: pageNumber,
    PageSize: 10,
    SearchTerm: searchTerm || undefined,
  });

  const columns = [
    {
      key: 'bookingReference',
      header: 'Booking Ref',
      render: (row) => <span className="font-mono font-medium">{row.bookingReference}</span>,
    },
    {
      key: 'method',
      header: 'Method',
      render: (row) => <span className="text-slate-600">{row.method}</span>,
    },
    {
      key: 'transactionId',
      header: 'Transaction ID',
      render: (row) => <span className="font-mono text-xs text-slate-600">{row.transactionId}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (row) => `${row.currencyCode} ${Number(row.amount).toFixed(2)}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge status={row.status} />,
    },
    {
      key: 'paidAt',
      header: 'Paid At',
      render: (row) => (row.paidAt ? format(new Date(row.paidAt), 'MMM d, yyyy · h:mm a') : '—'),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex items-center gap-1">
          {row.status === 'Pending' && (
            <Button
              variant="secondary"
              size="sm"
              icon={Eye}
              onClick={() => setVerifyModal({ open: true, payment: row })}
            >
              Review
            </Button>
          )}
          {row.status === 'Succeeded' && (
            <button
              title="Process refund"
              onClick={() => setRefundModal({ open: true, refundId: row.id })}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Payments & Refunds</h1>
        <p className="text-slate-500 text-sm mt-1">Review submitted payments and manage refund requests</p>
      </div>

      <div className="card !p-4">
        <div className="p-4 border-b border-slate-100">
          <Input
            icon={Search}
            placeholder="Search by booking reference..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPageNumber(1);
            }}
            containerClassName="max-w-sm"
          />
        </div>

        <Table columns={columns} data={data?.items || []} isLoading={isLoading} emptyMessage="No payments found" />

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

      <RefundProcessModal
        isOpen={refundModal.open}
        onClose={() => setRefundModal({ open: false, refundId: null })}
        refundId={refundModal.refundId}
      />

      <PaymentVerifyModal
        isOpen={verifyModal.open}
        onClose={() => setVerifyModal({ open: false, payment: null })}
        payment={verifyModal.payment}
      />
    </div>
  );
}