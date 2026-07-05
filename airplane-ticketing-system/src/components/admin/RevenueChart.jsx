import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

const formatCurrency = (value) => {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${value}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const revenue = payload.find((p) => p.dataKey === 'revenue')?.value ?? 0;
  const bookings = payload.find((p) => p.dataKey === 'bookings')?.value ?? 0;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-sm">
      <p className="font-semibold text-slate-800">{label}</p>
      <p className="text-primary-600">Revenue: ${revenue.toLocaleString()}</p>
      <p className="text-slate-500">Bookings: {bookings}</p>
    </div>
  );
};

export default function RevenueChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="h-72 flex items-center justify-center text-slate-400 text-sm">
        No revenue data available for this period.
      </div>
    );
  }

  const chartData = data.map((d) => ({
    day: d.day || d.date,
    revenue: d.revenue ?? 0,
    bookings: d.bookings ?? 0,
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 28, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.35} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickFormatter={formatCurrency}
            width={56}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />

          <Bar dataKey="revenue" fill="url(#barFill)" radius={[6, 6, 0, 0]} maxBarSize={48}>
            <LabelList
              dataKey="revenue"
              position="top"
              formatter={formatCurrency}
              style={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
            />
          </Bar>

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#ef4444"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}