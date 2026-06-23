import clsx from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ label, value, icon: Icon, color = 'primary', trend }) {
  const colors = {
    primary: 'bg-primary-50 text-primary-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    violet: 'bg-violet-50 text-violet-600',
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center', colors[color])}>
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <span
            className={clsx(
              'flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-full',
              trend >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
            )}
          >
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-sm text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}