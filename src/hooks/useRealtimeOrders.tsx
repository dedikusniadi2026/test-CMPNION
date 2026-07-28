import { useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { generateNewOrder, addOrder } from '../mock';
import { useUIStore } from '../store';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export function useRealtimeOrders() {
  const addNotification = useUIStore((s) => s.addNotification);
  const queryClient = useQueryClient();
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    const scheduleNext = () => {
      const delay = Math.random() * 10000 + 20000;

      intervalRef.current = setTimeout(() => {
        const newOrder = generateNewOrder();
        addOrder(newOrder);

        toast(`New order from ${newOrder.guestName}`, {
          description: `${newOrder.service} - Room ${newOrder.roomNumber}`,
          duration: 5000,
          position: 'top-right',
          icon: <Bell className="h-4 w-4" />,
        });

        addNotification({
          title: 'New Order Received',
          message: `${newOrder.guestName} ordered ${newOrder.service} (Room ${newOrder.roomNumber})`,
          type: 'info',
        });

        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        queryClient.invalidateQueries({ queryKey: ['status-distribution'] });

        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [addNotification, queryClient]);
}
