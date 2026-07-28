import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader } from '../ui/card';
import { ChartSkeleton } from '../ui/skeleton';
import { formatCurrency } from '../../lib/utils';
import type { WeeklyOrderData } from '../../types';

interface WeeklyOrdersProps {
  data?: WeeklyOrderData[];
  isLoading: boolean;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name?: string; value?: number; color?: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg p-3">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{label}</p>
      {payload.map((entry, i: number) => {
        const val = entry.value ?? 0;
        return (
          <p key={i} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.name === 'Revenue' ? formatCurrency(val) : val}
          </p>
        );
      })}
    </div>
  );
};

export function WeeklyOrders({ data, isLoading }: WeeklyOrdersProps) {
  if (isLoading) return <ChartSkeleton />;

  return (
    <Card>
      <CardHeader
        title="Weekly Orders"
        description="Orders and revenue by day"
      />
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-800" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value: string) => (
                <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>
              )}
            />
            <Bar
              yAxisId="left"
              dataKey="orders"
              name="Orders"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar
              yAxisId="right"
              dataKey="revenue"
              name="Revenue"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
