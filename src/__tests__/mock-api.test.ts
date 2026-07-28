import { describe, it, expect, beforeAll } from 'bun:test';
import { setFailMode } from '../mock/index';

beforeAll(() => setFailMode(false));
import {
  fetchOrders,
  fetchOrderById,
  updateOrderStatus,
  fetchDashboardStats,
  addOrder,
} from '../mock/index';
import { generateNewOrder } from '../mock/data';

const TIMEOUT = 10000;

describe('fetchOrders', () => {
  it(
    'returns paginated orders with default params',
    async () => {
      const result = await fetchOrders({ page: 1, pageSize: 10 });
      expect(result.data).toHaveLength(10);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.total).toBeGreaterThanOrEqual(50);
      expect(result.totalPages).toBeGreaterThanOrEqual(5);
    },
    TIMEOUT
  );

  it(
    'returns correct page 2 results',
    async () => {
      const page1 = await fetchOrders({ page: 1, pageSize: 10 });
      const page2 = await fetchOrders({ page: 2, pageSize: 10 });
      expect(page2.page).toBe(2);
      expect(page2.data).toHaveLength(10);
      const page1Ids = new Set(page1.data.map((o) => o.id));
      const hasOverlap = page2.data.some((o) => page1Ids.has(o.id));
      expect(hasOverlap).toBe(false);
    },
    TIMEOUT
  );

  it(
    'filters by status',
    async () => {
      const result = await fetchOrders({ status: 'Completed', pageSize: 50 });
      result.data.forEach((order) => {
        expect(order.status).toBe('Completed');
      });
    },
    TIMEOUT
  );

  it(
    'filters by service',
    async () => {
      const result = await fetchOrders({ service: 'Room Service', pageSize: 50 });
      result.data.forEach((order) => {
        expect(order.service).toBe('Room Service');
      });
    },
    TIMEOUT
  );

  it(
    'filters by payment status',
    async () => {
      const result = await fetchOrders({ paymentStatus: 'Failed', pageSize: 50 });
      result.data.forEach((order) => {
        expect(order.paymentStatus).toBe('Failed');
      });
    },
    TIMEOUT
  );

  it(
    'searches by guest name',
    async () => {
      const result = await fetchOrders({ search: 'John', pageSize: 50 });
      result.data.forEach((order) => {
        expect(
          order.guestName.toLowerCase().includes('john') ||
          order.id.toLowerCase().includes('john') ||
          order.roomNumber.toLowerCase().includes('john')
        ).toBe(true);
      });
    },
    TIMEOUT
  );

  it(
    'searches by room number',
    async () => {
      const result = await fetchOrders({ search: '204', pageSize: 50 });
      result.data.forEach((order) => {
        expect(
          order.guestName.toLowerCase().includes('204') ||
          order.id.toLowerCase().includes('204') ||
          order.roomNumber.toLowerCase().includes('204')
        ).toBe(true);
      });
    },
    TIMEOUT
  );

  it(
    'searches by order ID',
    async () => {
      const result = await fetchOrders({ search: 'ORD-1001', pageSize: 50 });
      expect(result.data.length).toBeGreaterThanOrEqual(1);
      expect(result.data[0].id).toContain('ORD-1001');
    },
    TIMEOUT
  );

  it(
    'returns empty array for no results',
    async () => {
      const result = await fetchOrders({ search: 'zzzzzznonexistent', pageSize: 50 });
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    },
    TIMEOUT
  );

  it(
    'sorts by newest first (default)',
    async () => {
      const result = await fetchOrders({ sortField: 'createdAt', sortDirection: 'desc', pageSize: 50 });
      for (let i = 1; i < result.data.length; i++) {
        expect(
          new Date(result.data[i - 1].createdAt).getTime() >=
          new Date(result.data[i].createdAt).getTime()
        ).toBe(true);
      }
    },
    TIMEOUT
  );

  it(
    'sorts by oldest first',
    async () => {
      const result = await fetchOrders({ sortField: 'createdAt', sortDirection: 'asc', pageSize: 50 });
      for (let i = 1; i < result.data.length; i++) {
        expect(
          new Date(result.data[i - 1].createdAt).getTime() <=
          new Date(result.data[i].createdAt).getTime()
        ).toBe(true);
      }
    },
    TIMEOUT
  );

  it(
    'combines search and filter',
    async () => {
      const result = await fetchOrders({
        search: 'John',
        status: 'New',
        pageSize: 50,
      });
      result.data.forEach((order) => {
        expect(order.status).toBe('New');
      });
    },
    TIMEOUT
  );
});

describe('fetchOrderById', () => {
  it(
    'returns a specific order',
    async () => {
      const order = await fetchOrderById('ORD-1001');
      expect(order.id).toBe('ORD-1001');
      expect(order.guestName).toBe('John Smith');
    },
    TIMEOUT
  );

  it(
    'throws for non-existent order',
    async () => {
      expect(fetchOrderById('NONEXISTENT')).rejects.toThrow('Order not found');
    },
    TIMEOUT
  );
});

describe('updateOrderStatus', () => {
  it(
    'updates order status and timestamps',
    async () => {
      const updated = await updateOrderStatus('ORD-1008', 'Acknowledged');
      expect(updated.status).toBe('Acknowledged');
      expect(updated.acknowledgedAt).toBeTruthy();
      expect(updated.updatedAt).toBeTruthy();
    },
    TIMEOUT
  );

  it(
    'sets inProgressAt when moving to In Progress',
    async () => {
      const updated = await updateOrderStatus('ORD-1008', 'In Progress');
      expect(updated.status).toBe('In Progress');
      expect(updated.inProgressAt).toBeTruthy();
    },
    TIMEOUT
  );

  it(
    'throws for non-existent order',
    async () => {
      expect(updateOrderStatus('NONEXISTENT', 'Completed')).rejects.toThrow('Order not found');
    },
    TIMEOUT
  );
});

describe('fetchDashboardStats', () => {
  it(
    'returns dashboard stats',
    async () => {
      const stats = await fetchDashboardStats();
      expect(stats.activeGuests).toBeGreaterThan(0);
      expect(stats.pendingOrders).toBeGreaterThan(0);
      expect(stats.completedOrders).toBeGreaterThan(0);
      expect(stats.revenueToday).toBeGreaterThanOrEqual(0);
      expect(stats.averageOrderValue).toBeGreaterThan(0);
      expect(stats.topSellingService).toBeTruthy();
    },
    TIMEOUT
  );
});

describe('addOrder', () => {
  it(
    'adds an order to the list',
    async () => {
      const before = await fetchOrders({ pageSize: 100 });
      const beforeCount = before.total;

      const newOrder = generateNewOrder();
      addOrder(newOrder);

      const after = await fetchOrders({ pageSize: 100 });
      expect(after.total).toBe(beforeCount + 1);
    },
    TIMEOUT
  );
});
