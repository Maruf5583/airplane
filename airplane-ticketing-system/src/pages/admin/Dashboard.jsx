import {
  Ticket,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  Users,
  Plane,
  AlertTriangle,
} from 'lucide-react';
import { useDashboard } from '../../hooks/useAdmin';
import StatCard from '../../components/admin/StatCard';
import RevenueChart from '../../components/admin/RevenueChart';
import Spinner from '../../components/common/Spinner';

export default function Dashboard() {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card text-center py-12">
        <AlertTriangle className="mx-auto text-amber-500 mb-2" size={28} />
        <p className="text-slate-600">Couldn't load dashboard data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Welcome back — here's what's happening today.
        </p>
      </div>

      {/* Top stat row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Bookings"
          value={data.totalBookings.toLocaleString()}
          icon={Ticket}
          color="primary"
        />
        <StatCard
          label="Total Revenue"
          value={`$${data.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          label="Revenue Today"
          value={`$${data.revenueToday.toLocaleString()}`}
          icon={DollarSign}
          color="violet"
        />
        <StatCard
          label="Total Users"
          value={data.totalUsers.toLocaleString()}
          icon={Users}
          color="amber"
        />
      </div>

      {/* Booking breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Confirmed Bookings"
          value={data.confirmedBookings.toLocaleString()}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          label="Pending Bookings"
          value={data.pendingBookings.toLocaleString()}
          icon={Clock}
          color="amber"
        />
        <StatCard
          label="Cancelled Bookings"
          value={data.cancelledBookings.toLocaleString()}
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Flights status row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Active Flights"
          value={data.activeFlights.toLocaleString()}
          icon={Plane}
          color="primary"
        />
        <StatCard
          label="Delayed Flights"
          value={data.delayedFlights.toLocaleString()}
          icon={Clock}
          color="amber"
        />
        <StatCard
          label="Cancelled Flights"
          value={data.cancelledFlights.toLocaleString()}
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Revenue chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-semibold text-slate-800">Revenue — Last 7 Days</h3>
            <p className="text-sm text-slate-400">Daily revenue and booking volume</p>
          </div>
        </div>
        <RevenueChart data={data.revenueByLastSevenDays || []} />
      </div>
    </div>
  );
}