export type SortField = 'createdAt' | 'amount';
export type SortDirection = 'asc' | 'desc';

export interface Order {
  id: string;
  guestName: string;
  roomNumber: string;
  service: string;
  quantity: number;
  amount: number;
  specialRequest?: string;
  orderTime: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  acknowledgedAt?: string;
  inProgressAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}

export interface TimelineEvent {
  type: string;
  timestamp: string;
  label: string;
  description: string;
}

export interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardStats {
  activeGuests: number;
  activeGuestsTrend: number;
  pendingOrders: number;
  pendingOrdersTrend: number;
  revenueToday: number;
  revenueTodayTrend: number;
  completedOrders: number;
  completedOrdersTrend: number;
  averageOrderValue: number;
  averageOrderValueTrend: number;
  topSellingService: string;
  topSellingServiceCount: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface OrdersByServiceData {
  name: string;
  value: number;
  color: string;
}

export interface StatusDistributionData {
  status: string;
  count: number;
  percentage: number;
}

export interface WeeklyOrderData {
  day: string;
  orders: number;
  revenue: number;
}
