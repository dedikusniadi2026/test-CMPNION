import { Users, Clock, DollarSign, CheckCircle2, ShoppingCart, Star } from 'lucide-react';
import { StatCard } from './stat-card';
import { CardSkeleton } from '../ui/skeleton';
import type { DashboardStats } from '../../types';

interface StatsGridProps {
  stats?: DashboardStats;
  isLoading: boolean;
  onStatClick?: (stat: string) => void;
}

export function StatsGrid({ stats, isLoading, onStatClick }: StatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <CardSkeleton count={6} />
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Active Guests',
      value: stats.activeGuests,
      trend: stats.activeGuestsTrend,
      icon: <Users className="h-5 w-5" />,
      color: 'blue' as const,
      onClick: () => onStatClick?.('guests'),
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      trend: stats.pendingOrdersTrend,
      icon: <Clock className="h-5 w-5" />,
      color: 'amber' as const,
      onClick: () => onStatClick?.('pending'),
    },
    {
      title: 'Revenue Today',
      value: stats.revenueToday,
      trend: stats.revenueTodayTrend,
      icon: <DollarSign className="h-5 w-5" />,
      color: 'green' as const,
      format: 'currency' as const,
      onClick: () => onStatClick?.('revenue'),
    },
    {
      title: 'Completed Orders',
      value: stats.completedOrders,
      trend: stats.completedOrdersTrend,
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: 'green' as const,
      onClick: () => onStatClick?.('completed'),
    },
    {
      title: 'Avg Order Value',
      value: stats.averageOrderValue,
      trend: stats.averageOrderValueTrend,
      icon: <ShoppingCart className="h-5 w-5" />,
      color: 'purple' as const,
      format: 'currency' as const,
      onClick: () => onStatClick?.('avg-value'),
    },
    {
      title: 'Top Service',
      value: stats.topSellingServiceCount,
      trend: undefined,
      icon: <Star className="h-5 w-5" />,
      color: 'cyan' as const,
      format: 'number' as const,
      onClick: () => onStatClick?.('top-service'),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          trend={card.trend}
          icon={card.icon}
          color={card.color}
          format={card.format}
          onClick={card.onClick}
        />
      ))}
    </div>
  );
}
