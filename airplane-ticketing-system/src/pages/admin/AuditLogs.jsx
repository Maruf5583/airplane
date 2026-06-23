import { useState } from 'react';
import { Search, ScrollText } from 'lucide-react';
import { useAuditLogs } from '../../hooks/useAdmin';
import Input from '../../components/common/Input';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import { format } from 'date-fns';

export default function AuditLogs() {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const { data, isLoading } = useAuditLogs({
    PageNumber: pageNumber,
    PageSize: 15,
    SearchTerm: searchTerm || undefined,
    EntityName: entityFilter || undefined,
    Action: actionFilter || undefined,
    SortBy: 'timestamp',
    SortDescending: true,
  });

  const columns = [
    {
      key: 'timestamp',
      header: 'Time',
      render: (row) => (
        <span className="text-xs text-slate-500">
          {format(new Date(row.timestamp), 'MMM d, yyyy · h:mm:ss a')}
        </span>
      ),
    },
    {
      key: 'entityName',
      header: 'Entity',
      render: (row) => (
        <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">{row.entityName}</span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            row.action === 'Create'
              ? 'bg-emerald-50 text-emerald-700'
              : row.action === 'Update'
              ? 'bg-amber-50 text-amber-700'
              : row.action === 'Delete'
              ? 'bg-red-50 text-red-700'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {row.action}
        </span>
      ),
    },
    { key: 'userEmail', header: 'Performed By' },
    { key: 'ipAddress', header: 'IP Address' },
    {
      key: 'correlationId',
      header: 'Correlation ID',
      render: (row) => (
        <span className="text-xs text-slate-400 font-mono">{row.correlationId?.slice(0, 8)}...</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Audit Logs</h1>
        <p className="text-slate-500 text-sm mt-1">Track every system action for compliance and security</p>
      </div>

      <div className="card !p-0">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3">
          <Input
            icon={Search}
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPageNumber(1);
            }}
            containerClassName="max-w-xs flex-1"
          />
          <Input
            placeholder="Filter by entity (e.g. Booking)"
            value={entityFilter}
            onChange={(e) => {
              setEntityFilter(e.target.value);
              setPageNumber(1);
            }}
            containerClassName="max-w-xs"
          />
          <Input
            placeholder="Filter by action (e.g. Update)"
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPageNumber(1);
            }}
            containerClassName="max-w-xs"
          />
        </div>

        <Table
          columns={columns}
          data={data?.items}
          isLoading={isLoading}
          emptyMessage="No audit log entries found"
        />

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
    </div>
  );
}