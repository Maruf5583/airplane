import { Link } from 'react-router-dom';
import { PlusCircle, Ticket, TrendingUp, Clock } from 'lucide-react';
import { useBookingsList } from '../../hooks/useBookings';
import StatCard from '../../components/admin/StatCard';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

export default function AgentDashboard() {
  const { data, isLoading } = useBookingsList({ PageSize: 100 });

  const bookings = data?.items || [];
  const confirmed = bookings.filter((b) => b.status === 'Confirmed').length;
  const pending = bookings.filter((b) => b.status === 'PendingPayment').length;
  const totalRevenue = bookings
    .filter((b) => b.status === 'Confirmed')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Agent Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Manage bookings for your customers</p>
        </div>
        <Link to="/agent/create-booking">
          <Button icon={PlusCircle}>New Booking</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Bookings Made" value={bookings.length} icon={Ticket} color="primary" />
          <StatCard label="Confirmed" value={confirmed} icon={TrendingUp} color="emerald" />
          <StatCard label="Pending Payment" value={pending} icon={Clock} color="amber" />
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Total Revenue Generated</h3>
        </div>
        <p className="text-3xl font-bold text-primary-700">${totalRevenue.toFixed(2)}</p>
        <p className="text-sm text-slate-400 mt-1">From confirmed bookings</p>
      </div>
    </div>
  );
}