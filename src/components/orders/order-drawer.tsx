import { Drawer } from '../ui/drawer';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { OrderActions } from './order-actions';
import { useOrder } from '../../hooks/useOrders';
import { useUIStore } from '../../store';
import { formatDate, formatCurrency, timeAgo } from '../../lib/utils';
import {
  User,
  DoorOpen,
  Clock,
  MessageSquare,
  Package,
} from 'lucide-react';
import type { Order } from '../../types';
import { cn } from '../../lib/utils';

function getTimeline(order: Order) {
  const events = [
    { type: 'created', timestamp: order.createdAt, label: 'Order Created', description: `${order.guestName} placed an order` },
  ];

  if (order.acknowledgedAt) {
    events.push({ type: 'acknowledged', timestamp: order.acknowledgedAt, label: 'Acknowledged', description: 'Order was acknowledged by staff' });
  }
  if (order.inProgressAt) {
    events.push({ type: 'in-progress', timestamp: order.inProgressAt, label: 'In Progress', description: 'Order is being prepared' });
  }
  if (order.completedAt) {
    events.push({ type: 'completed', timestamp: order.completedAt, label: 'Completed', description: 'Order has been delivered' });
  }
  if (order.cancelledAt) {
    events.push({ type: 'cancelled', timestamp: order.cancelledAt, label: 'Cancelled', description: 'Order was cancelled' });
  }

  return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

const TIMELINE_COLORS: Record<string, string> = {
  created: 'bg-blue-500',
  acknowledged: 'bg-indigo-500',
  'in-progress': 'bg-amber-500',
  completed: 'bg-emerald-500',
  cancelled: 'bg-red-500',
};

export function OrderDrawer() {
  const { drawerOpen, closeDrawer, selectedOrderId } = useUIStore();
  const { data: order, isLoading } = useOrder(selectedOrderId);

  return (
    <Drawer
      open={drawerOpen}
      onClose={closeDrawer}
      title={order ? `Order ${order.id}` : 'Order Details'}
      description={order ? `${order.service} - Room ${order.roomNumber}` : undefined}
    >
      {isLoading ? (
        <div className="p-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton variant="rectangular" className="h-32 w-full" />
          <Skeleton variant="rectangular" className="h-48 w-full" />
        </div>
      ) : order ? (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {/* Status & Actions */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Badge
                variant={
                  order.status === 'Completed' ? 'green' :
                  order.status === 'Cancelled' ? 'red' :
                  order.status === 'In Progress' ? 'amber' :
                  order.status === 'Acknowledged' ? 'indigo' : 'blue'
                }
                size="lg"
              >
                {order.status}
              </Badge>
              <Badge
                variant={
                  order.paymentStatus === 'Paid' ? 'green' :
                  order.paymentStatus === 'Failed' ? 'red' : 'amber'
                }
              >
                {order.paymentStatus}
              </Badge>
            </div>
            <OrderActions order={order} showView={false} size="default" />
          </div>

          {/* Guest Information */}
          <div className="p-6 space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              Guest Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Name</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{order.guestName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Room</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
                  <DoorOpen className="h-3.5 w-3.5 text-gray-400" />
                  {order.roomNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="p-6 space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" />
              Service Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Service</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{order.service}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Quantity</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{order.quantity}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(order.amount)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Payment</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{order.paymentStatus}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Order Time</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{formatDate(order.orderTime)}</p>
              </div>
            </div>

            {order.specialRequest && (
              <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                <p className="text-xs font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1 mb-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Special Request
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400">{order.specialRequest}</p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="p-6 space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              Timeline
            </h4>
            <div className="space-y-0">
              {getTimeline(order).map((event, i) => (
                <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < getTimeline(order).length - 1 && (
                    <div className="absolute left-[11px] top-5 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                  )}
                  <div className="relative flex-shrink-0">
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center',
                      TIMELINE_COLORS[event.type] || 'bg-gray-400'
                    )}>
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{event.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{event.description}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{timeAgo(event.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </Drawer>
  );
}
