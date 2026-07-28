import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, type FetchOrdersParams } from '../api/orders';
import type { Order, OrdersResponse } from '../types';
import { toast } from 'sonner';

export function useOrders(params: FetchOrdersParams) {
  return useQuery<OrdersResponse>({
    queryKey: ['orders', params],
    queryFn: () => ordersApi.getOrders(params),
  });
}

export function useOrder(id: string | null) {
  return useQuery<Order>({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getOrderById(id!),
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersApi.updateOrderStatus(id, status),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['orders'] });

      const previousQueries = queryClient.getQueriesData<OrdersResponse>({ queryKey: ['orders'] });

      queryClient.setQueriesData<OrdersResponse>({ queryKey: ['orders'] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((order) =>
            order.id === id ? { ...order, status, updatedAt: new Date().toISOString() } : order
          ),
        };
      });

      return { previousQueries };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to update order status. Please try again.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => ordersApi.getDashboardStats(),
  });
}

export function useRevenueData() {
  return useQuery({
    queryKey: ['revenue-data'],
    queryFn: () => ordersApi.getRevenueData(),
  });
}

export function useOrdersByService() {
  return useQuery({
    queryKey: ['orders-by-service'],
    queryFn: () => ordersApi.getOrdersByService(),
  });
}

export function useStatusDistribution() {
  return useQuery({
    queryKey: ['status-distribution'],
    queryFn: () => ordersApi.getStatusDistribution(),
  });
}

export function useWeeklyOrders() {
  return useQuery({
    queryKey: ['weekly-orders'],
    queryFn: () => ordersApi.getWeeklyOrders(),
  });
}
