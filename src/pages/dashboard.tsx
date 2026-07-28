import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStats, useRevenueData, useOrdersByService, useStatusDistribution, useWeeklyOrders } from '../hooks/useOrders';
import { StatsGrid } from '../components/dashboard/stats-grid';
import { Card, CardHeader } from '../components/ui/card';
import { ChartSkeleton } from '../components/ui/skeleton';
import { useUIStore } from '../store';
import { Bell, ArrowRight } from 'lucide-react';
import { timeAgo, cn } from '../lib/utils';

const RevenueChart = lazy(() =>
  import('../components/charts/revenue-chart').then((m) => ({ default: m.RevenueChart }))
);
const OrdersByService = lazy(() =>
  import('../components/charts/orders-by-service').then((m) => ({ default: m.OrdersByService }))
);
const StatusDistribution = lazy(() =>
  import('../components/charts/status-distribution').then((m) => ({ default: m.StatusDistribution }))
);
const WeeklyOrders = lazy(() =>
  import('../components/charts/weekly-orders').then((m) => ({ default: m.WeeklyOrders }))
);

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: revenueData, isLoading: revenueLoading } = useRevenueData();
  const { data: ordersByService, isLoading: ordersByServiceLoading } = useOrdersByService();
  const { data: statusDistribution, isLoading: statusLoading } = useStatusDistribution();
  const { data: weeklyOrders, isLoading: weeklyLoading } = useWeeklyOrders();
  const { notifications, markNotificationRead } = useUIStore();

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Overview of today's hotel operations
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={stats} isLoading={statsLoading} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Suspense fallback={<ChartSkeleton />}>
            <RevenueChart data={revenueData} isLoading={revenueLoading} />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<ChartSkeleton />}>
            <OrdersByService data={ordersByService} isLoading={ordersByServiceLoading} />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<ChartSkeleton />}>
            <StatusDistribution data={statusDistribution} isLoading={statusLoading} />
          </Suspense>
        </div>
        <div className="lg:col-span-2">
          <Suspense fallback={<ChartSkeleton />}>
            <WeeklyOrders data={weeklyOrders} isLoading={weeklyLoading} />
          </Suspense>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader
            title="Recent Activity"
            description="Latest notifications and updates"
            action={
              <button
                onClick={() => navigate('/orders')}
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </button>
            }
          />
          <div className="space-y-1">
            {recentNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No recent activity</p>
              </div>
            ) : (
              recentNotifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={cn(
                    'w-full text-left px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30',
                    !notif.read && 'bg-blue-50/50 dark:bg-blue-950/20'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'flex-shrink-0 w-2 h-2 mt-1.5 rounded-full',
                      !notif.read ? 'bg-blue-600' : 'bg-transparent'
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-sm truncate',
                        !notif.read ? 'font-medium text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'
                      )}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{notif.message}</p>
                      <p className="text-[11px] text-gray-400 mt-1">{timeAgo(notif.timestamp)}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
            {recentNotifications.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-400">
                  {notifications.filter(n => !n.read).length} unread notifications
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
