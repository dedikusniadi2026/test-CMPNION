import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader } from '../ui/card';
import { ChartSkeleton } from '../ui/skeleton';
import { formatCurrency } from '../../lib/utils';
import type { RevenueData } from '../../types';

interface RevenueChartProps {
  data?: RevenueData[];
  isLoading: boolean;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value?: number; payload?: { orders?: number } }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value ?? 0;
  const ordersCount = payload[0]?.payload?.orders ?? 0;
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {formatCurrency(val)}
      </p>
      <p className="text-xs text-gray-400">{ordersCount} orders</p>
    </div>
  );
};

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  if (isLoading) return <ChartSkeleton />;

  return (
    <Card>
      <CardHeader
        title="Revenue Overview"
        description="Daily revenue for the last 30 days"
      />
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-800" />
            <XAxis
              dataKey="date"
              tickFormatter={(val) => {
                const d = new Date(val);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
