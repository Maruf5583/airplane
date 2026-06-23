import clsx from 'clsx';

const STATUS_STYLES = {
  // Booking statuses
  Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PendingPayment: 'bg-amber-50 text-amber-700 border-amber-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
  Expired: 'bg-slate-100 text-slate-600 border-slate-200',
  Refunded: 'bg-purple-50 text-purple-700 border-purple-200',
  // Flight statuses
  Scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  Delayed: 'bg-amber-50 text-amber-700 border-amber-200',
  Boarding: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  Departed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Arrived: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  // Payment statuses
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Succeeded: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Failed: 'bg-red-50 text-red-700 border-red-200',
  Processed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Denied: 'bg-red-50 text-red-700 border-red-200',
  // Roles
  Admin: 'bg-violet-50 text-violet-700 border-violet-200',
  Agent: 'bg-blue-50 text-blue-700 border-blue-200',
  Passenger: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function Badge({ status, children, className = '' }) {
  const style = STATUS_STYLES[status] || 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
        style,
        className
      )}
    >
      {children || status}
    </span>
  );
}