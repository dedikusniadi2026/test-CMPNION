import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardHeader } from '../ui/card';
import { ChartSkeleton } from '../ui/skeleton';
import type { OrdersByServiceData } from '../../types';

interface OrdersByServiceProps {
  data?: OrdersByServiceData[];
  isLoading: boolean;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name?: string; value?: number; color?: string; payload?: { color?: string } }> }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0]?.payload?.color }} />
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{payload[0].name}</p>
      </div>
      <p className="text-xs text-gray-500">{payload[0].value} orders</p>
    </div>
  );
};

export function OrdersByService({ data, isLoading }: OrdersByServiceProps) {
  if (isLoading) return <ChartSkeleton />;

  return (
    <Card>
      <CardHeader
        title="Orders by Service"
        description="Distribution across service categories"
      />
      <div className="h-75">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string) => (
                <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
