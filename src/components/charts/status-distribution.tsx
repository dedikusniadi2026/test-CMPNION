import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader } from '../ui/card';
import { ChartSkeleton } from '../ui/skeleton';
import type { StatusDistributionData } from '../../types';

interface StatusDistributionProps {
  data?: StatusDistributionData[];
  isLoading: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  'New': '#3b82f6',
  'Acknowledged': '#6366f1',
  'In Progress': '#f59e0b',
  'Completed': '#10b981',
  'Cancelled': '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
  'New': 'New',
  'Acknowledged': 'Acknowledged',
  'In Progress': 'In Progress',
  'Completed': 'Completed',
  'Cancelled': 'Cancelled',
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload?: { status: string; count: number; percentage: number } }> }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg p-3">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
        {STATUS_LABELS[data.status]}
      </p>
      <p className="text-xs text-gray-500">{data.count} orders ({data.percentage.toFixed(1)}%)</p>
    </div>
  );
};

export function StatusDistribution({ data, isLoading }: StatusDistributionProps) {
  if (isLoading) return <ChartSkeleton />;

  const chartData = data?.map(d => ({
    ...d,
    fill: STATUS_COLORS[d.status],
  }));

  return (
    <Card>
      <CardHeader
        title="Order Status"
        description="Current distribution"
      />
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-800" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="status"
              tickFormatter={(val) => STATUS_LABELS[val]}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              radius={[0, 4, 4, 0]}
              barSize={24}
            >
              {chartData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
