import { fetchOrders, fetchOrderById, updateOrderStatus as mockUpdateStatus } from '../mock';
import type { Order, OrdersResponse, DashboardStats, RevenueData, OrdersByServiceData, WeeklyOrderData } from '../types';
import { fetchDashboardStats, fetchRevenueData, fetchOrdersByService, fetchStatusDistribution, fetchWeeklyOrders } from '../mock';

export interface FetchOrdersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  service?: string;
  paymentStatus?: string;
  sortField?: string;
  sortDirection?: string;
}

export const ordersApi = {
  getOrders(params: FetchOrdersParams): Promise<OrdersResponse> {
    return fetchOrders(params);
  },

  getOrderById(id: string): Promise<Order> {
    return fetchOrderById(id);
  },

  updateOrderStatus(id: string, status: string): Promise<Order> {
    return mockUpdateStatus(id, status);
  },

  getDashboardStats(): Promise<DashboardStats> {
    return fetchDashboardStats();
  },

  getRevenueData(): Promise<RevenueData[]> {
    return fetchRevenueData();
  },

  getOrdersByService(): Promise<OrdersByServiceData[]> {
    return fetchOrdersByService();
  },

  getStatusDistribution() {
    return fetchStatusDistribution();
  },

  getWeeklyOrders(): Promise<WeeklyOrderData[]> {
    return fetchWeeklyOrders();
  },
};
