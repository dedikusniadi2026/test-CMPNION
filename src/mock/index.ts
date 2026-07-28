import type { Order, OrdersResponse, DashboardStats, RevenueData, OrdersByServiceData, WeeklyOrderData } from '../types';
import { ORDERS, DASHBOARD_STATS, generateRevenueData, ORDERS_BY_SERVICE, generateWeeklyOrders, generateStatusDistribution } from './data';

let orders = [...ORDERS];
let _failMode = true;

export function setFailMode(enabled: boolean) {
  _failMode = enabled;
}

function delay(ms?: number): Promise<void> {
  const delayMs = ms ?? Math.random() * 400 + 200;
  return new Promise(resolve => setTimeout(resolve, delayMs));
}

function shouldFail(): boolean {
  return _failMode && Math.random() < 0.05;
}

interface FetchOrdersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  service?: string;
  paymentStatus?: string;
  sortField?: string;
  sortDirection?: string;
}

export async function fetchOrders(params: FetchOrdersParams = {}): Promise<OrdersResponse> {
  await delay();
  if (shouldFail()) {
    throw new Error('Failed to fetch orders. Please try again.');
  }

  let filtered = [...orders];

  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      o =>
        o.guestName.toLowerCase().includes(q) ||
        o.roomNumber.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
    );
  }

  if (params.status && params.status !== 'all') {
    filtered = filtered.filter(o => o.status === params.status);
  }

  if (params.service && params.service !== 'all') {
    filtered = filtered.filter(o => o.service === params.service);
  }

  if (params.paymentStatus && params.paymentStatus !== 'all') {
    filtered = filtered.filter(o => o.paymentStatus === params.paymentStatus);
  }

  const sortField = params.sortField || 'createdAt';
  const sortDirection = params.sortDirection || 'desc';
  filtered.sort((a, b) => {
    const aVal = a[sortField as keyof Order] as string | number;
    const bVal = b[sortField as keyof Order] as string | number;
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    }
    return sortDirection === 'desc' ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number);
  });

  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, totalPages, pageSize };
}

export async function fetchOrderById(id: string): Promise<Order> {
  await delay();
  if (shouldFail()) {
    throw new Error('Failed to fetch order details.');
  }
  const order = orders.find(o => o.id === id);
  if (!order) throw new Error('Order not found');
  return order;
}

export async function updateOrderStatus(id: string, newStatus: string): Promise<Order> {
  await delay(300);
  if (shouldFail()) {
    throw new Error('Failed to update order status.');
  }
  const order = orders.find(o => o.id === id);
  if (!order) throw new Error('Order not found');

  const now = new Date().toISOString();
  const updatedOrder = {
    ...order,
    status: newStatus,
    updatedAt: now,
    ...(newStatus === 'Acknowledged' && !order.acknowledgedAt ? { acknowledgedAt: now } : {}),
    ...(newStatus === 'In Progress' && !order.inProgressAt ? { inProgressAt: now } : {}),
    ...(newStatus === 'Completed' && !order.completedAt ? { completedAt: now } : {}),
    ...(newStatus === 'Cancelled' && !order.cancelledAt ? { cancelledAt: now } : {}),
  };
  orders = orders.map(o => (o.id === id ? updatedOrder : o));
  return updatedOrder;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  await delay();
  const pendingOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;
  const todayRevenue = orders
    .filter(o => o.status === 'Completed' && new Date(o.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + o.amount, 0);

  return {
    ...DASHBOARD_STATS,
    pendingOrders,
    completedOrders,
    revenueToday: todayRevenue || DASHBOARD_STATS.revenueToday,
  };
}

export async function fetchRevenueData(): Promise<RevenueData[]> {
  await delay();
  return generateRevenueData();
}

export async function fetchOrdersByService(): Promise<OrdersByServiceData[]> {
  await delay();
  return ORDERS_BY_SERVICE;
}

export async function fetchStatusDistribution() {
  await delay();
  return generateStatusDistribution();
}

export async function fetchWeeklyOrders(): Promise<WeeklyOrderData[]> {
  await delay();
  return generateWeeklyOrders();
}

export function addOrder(order: Order): void {
  orders.unshift(order);
}

export function getOrdersCount(): number {
  return orders.length;
}

export { generateNewOrder } from './data';
