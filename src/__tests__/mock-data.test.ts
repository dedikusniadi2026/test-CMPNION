import { describe, it, expect } from 'bun:test';
import {
  ORDERS,
  DASHBOARD_STATS,
  generateNewOrder,
  generateRevenueData,
  generateStatusDistribution,
  generateWeeklyOrders,
  ORDERS_BY_SERVICE,
} from '../mock/data';

describe('Seed orders', () => {
  it('has exactly 50 orders total', () => {
    expect(ORDERS).toHaveLength(50);
  });

  it('all orders have required fields', () => {
    ORDERS.forEach((order) => {
      expect(order.id).toBeTruthy();
      expect(order.guestName).toBeTruthy();
      expect(order.roomNumber).toBeTruthy();
      expect(order.service).toBeTruthy();
      expect(order.quantity).toBeGreaterThanOrEqual(1);
      expect(typeof order.amount).toBe('number');
      expect(order.orderTime).toBeTruthy();
      expect(order.status).toBeTruthy();
      expect(order.paymentStatus).toBeTruthy();
    });
  });

  it('first 5 seed orders have correct guest names', () => {
    expect(ORDERS[0].guestName).toBe('John Smith');
    expect(ORDERS[1].guestName).toBe('Sarah Johnson');
    expect(ORDERS[2].guestName).toBe('Michael Tan');
    expect(ORDERS[3].guestName).toBe('Emma Wilson');
    expect(ORDERS[4].guestName).toBe('David Lee');
  });

  it('all seed orders have valid statuses', () => {
    const validStatuses = ['New', 'Acknowledged', 'In Progress', 'Completed', 'Cancelled'];
    ORDERS.forEach((order) => {
      expect(validStatuses).toContain(order.status);
    });
  });

  it('all seed orders have valid payment statuses', () => {
    const validPayments = ['Pending', 'Paid', 'Failed'];
    ORDERS.forEach((order) => {
      expect(validPayments).toContain(order.paymentStatus);
    });
  });

  it('cancelled orders have cancelledAt timestamp', () => {
    const cancelled = ORDERS.filter((o) => o.status === 'Cancelled');
    cancelled.forEach((order) => {
      expect(order.cancelledAt).toBeTruthy();
    });
  });

  it('completed orders have completedAt timestamp', () => {
    const completed = ORDERS.filter((o) => o.status === 'Completed');
    completed.forEach((order) => {
      expect(order.completedAt).toBeTruthy();
    });
  });

  it('each order has unique ID', () => {
    const ids = new Set(ORDERS.map((o) => o.id));
    expect(ids.size).toBe(ORDERS.length);
  });
});

describe('generateNewOrder', () => {
  it('returns a valid order', () => {
    const order = generateNewOrder();
    expect(order.id).toMatch(/^ORD-/);
    expect(order.guestName).toBeTruthy();
    expect(order.roomNumber).toBeTruthy();
    expect(order.service).toBeTruthy();
    expect(order.quantity).toBeGreaterThanOrEqual(1);
    expect(typeof order.amount).toBe('number');
    expect(['New', 'Acknowledged', 'In Progress', 'Completed', 'Cancelled']).toContain(order.status);
    expect(['Pending', 'Paid', 'Failed']).toContain(order.paymentStatus);
  });

  it('generates a valid order with correct structure', () => {
    const order = generateNewOrder();
    expect(order.id).toMatch(/^ORD-/);
    expect(order.guestName).toBeTruthy();
    expect(order.roomNumber).toBeTruthy();
    expect(order.service).toBeTruthy();
    expect(order.quantity).toBeGreaterThanOrEqual(1);
    expect(typeof order.amount).toBe('number');
    expect(order.createdAt).toBeTruthy();
    expect(order.orderTime).toBeTruthy();
  });
});

describe('generateRevenueData', () => {
  it('returns 30 days of data', () => {
    const data = generateRevenueData();
    expect(data).toHaveLength(30);
  });

  it('each entry has required fields', () => {
    const data = generateRevenueData();
    data.forEach((entry) => {
      expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(entry.revenue).toBeGreaterThan(0);
      expect(entry.orders).toBeGreaterThan(0);
    });
  });
});

describe('ORDERS_BY_SERVICE', () => {
  it('has service distribution data', () => {
    expect(ORDERS_BY_SERVICE.length).toBeGreaterThanOrEqual(5);
  });

  it('total value adds up to meaningful number', () => {
    const total = ORDERS_BY_SERVICE.reduce((sum, s) => sum + s.value, 0);
    expect(total).toBeGreaterThan(100);
  });

  it('each entry has a color', () => {
    ORDERS_BY_SERVICE.forEach((s) => {
      expect(s.color).toMatch(/^#/);
    });
  });
});

describe('generateStatusDistribution', () => {
  it('returns all 5 statuses', () => {
    const distribution = generateStatusDistribution();
    expect(distribution).toHaveLength(5);
  });

  it('percentages add up to ~100%', () => {
    const distribution = generateStatusDistribution();
    const totalPercentage = distribution.reduce((sum, d) => sum + d.percentage, 0);
    expect(totalPercentage).toBeCloseTo(100, 0);
  });
});

describe('generateWeeklyOrders', () => {
  it('returns 7 days', () => {
    const data = generateWeeklyOrders();
    expect(data).toHaveLength(7);
  });

  it('each day has orders and revenue', () => {
    const data = generateWeeklyOrders();
    data.forEach((day) => {
      expect(day.day).toBeTruthy();
      expect(day.orders).toBeGreaterThan(0);
      expect(day.revenue).toBeGreaterThan(0);
    });
  });
});

describe('DASHBOARD_STATS', () => {
  it('has all required fields', () => {
    expect(DASHBOARD_STATS.activeGuests).toBeGreaterThan(0);
    expect(DASHBOARD_STATS.pendingOrders).toBeGreaterThan(0);
    expect(DASHBOARD_STATS.revenueToday).toBeGreaterThan(0);
    expect(DASHBOARD_STATS.completedOrders).toBeGreaterThan(0);
    expect(DASHBOARD_STATS.averageOrderValue).toBeGreaterThan(0);
    expect(DASHBOARD_STATS.topSellingService).toBeTruthy();
  });
});
