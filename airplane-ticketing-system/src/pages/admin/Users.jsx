import { useState } from 'react';
import { Search, UserPlus, Trash2, Power, ShieldCheck, ShieldOff } from 'lucide-react';
import { useUsersList, useDeleteUser, useSetUserActive } from '../../hooks/useUsers';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import CreateAgentModal from '../../components/admin/CreateAgentModal';
import { format } from 'date-fns';

const ROLE_FILTER_OPTIONS = [
  { value: 'Passenger', label: 'Passengers' },
  { value: 'Agent', label: 'Agents' },
  { value: 'Admin', label: 'Admins' },
];

export default function Users() {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [agentModal, setAgentModal] = useState(false);

  const { data, isLoading } = useUsersList({
    PageNumber: pageNumber,
    PageSize: 10,
    SearchTerm: searchTerm || undefined,
  });

  const deleteUser = useDeleteUser();
  const setActive = useSetUserActive();

  const handleDelete = (user) => {
    if (window.confirm(`Delete user ${user.fullName}? This cannot be undone.`)) {
      deleteUser.mutate(user.id);
    }
  };

  const columns = [
    {
      key: 'fullName',
      header: 'Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center text-sm font-semibold">
            {row.firstName?.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-slate-800">{row.fullName}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (row) => <Badge status={row.role} />,
    },
    {
      key: 'isEmailVerified',
      header: 'Email Verified',
      render: (row) =>
        row.isEmailVerified ? (
          <span className="text-emerald-600 text-xs font-medium">Verified</span>
        ) : (
          <span className="text-amber-600 text-xs font-medium">Unverified</span>
        ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (row) =>
        row.isActive ? (
          <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
            <ShieldCheck size={14} /> Active
          </span>
        ) : (
          <span className="flex items-center gap-1 text-red-500 text-xs font-medium">
            <ShieldOff size={14} /> Inactive
          </span>
        ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (row) => format(new Date(row.createdAt), 'MMM d, yyyy'),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            title={row.isActive ? 'Deactivate' : 'Activate'}
            onClick={() => setActive.mutate({ id: row.id, isActive: !row.isActive })}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <Power size={16} />
          </button>
          <button
            title="Delete user"
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
          <h1 className="text-2xl font-bold text-slate-800">Users & Agents</h1>
          <p className="text-slate-500 text-sm mt-1">Manage platform users and create agent accounts</p>
        </div>
        <Button icon={UserPlus} onClick={() => setAgentModal(true)}>
          Create Agent
        </Button>
      </div>

      <div className="card !p-0">
        <div className="p-4 border-b border-slate-100 flex gap-3 flex-wrap">
          <Input
            icon={Search}
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPageNumber(1);
            }}
            containerClassName="max-w-sm flex-1"
          />
        </div>

        <Table columns={columns} data={data?.items} isLoading={isLoading} emptyMessage="No users found" />

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

      <CreateAgentModal isOpen={agentModal} onClose={() => setAgentModal(false)} />
    </div>
  );
}