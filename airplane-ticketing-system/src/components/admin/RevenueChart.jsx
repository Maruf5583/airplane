import { format, parseISO } from 'date-fns';

export default function RevenueChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
        No revenue data available
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="flex items-end justify-between gap-2 h-64 pt-4">
      {data.map((day, idx) => {
        const heightPct = (day.revenue / maxRevenue) * 100;
        return (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full">
            <div className="flex-1 w-full flex items-end justify-center">
              <div className="relative group w-full max-w-[40px]">
                <div
                  className="w-full bg-primary-500 rounded-t-md hover:bg-primary-600 transition-colors cursor-pointer"
                  style={{ height: `${Math.max(heightPct, 3)}%`, minHeight: '4px' }}
                />
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  ${day.revenue.toLocaleString()}
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {format(parseISO(day.date), 'EEE')}
            </span>
          </div>
        );
      })}
    </div>
  );
}