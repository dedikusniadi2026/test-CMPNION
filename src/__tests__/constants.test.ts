import { describe, it, expect } from 'bun:test';
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  SERVICE_CATEGORIES,
  SORT_OPTIONS,
  PAGE_SIZE,
  SLA_THRESHOLD_MINUTES,
} from '../constants';

describe('ORDER_STATUSES', () => {
  it('has all 5 statuses', () => {
    expect(ORDER_STATUSES).toHaveLength(5);
  });

  it('includes the complete lifecycle', () => {
    const values = ORDER_STATUSES.map((s) => s.value);
    expect(values).toContain('New');
    expect(values).toContain('Acknowledged');
    expect(values).toContain('In Progress');
    expect(values).toContain('Completed');
    expect(values).toContain('Cancelled');
  });

  it('each status has a color', () => {
    ORDER_STATUSES.forEach((s) => {
      expect(s.color).toBeTruthy();
      expect(s.label).toBeTruthy();
    });
  });
});

describe('PAYMENT_STATUSES', () => {
  it('has 3 payment statuses', () => {
    expect(PAYMENT_STATUSES).toHaveLength(3);
  });

  it('includes Paid, Pending, Failed', () => {
    const values = PAYMENT_STATUSES.map((s) => s.value);
    expect(values).toContain('Paid');
    expect(values).toContain('Pending');
    expect(values).toContain('Failed');
  });

  it('each status has a color', () => {
    PAYMENT_STATUSES.forEach((s) => {
      expect(s.color).toBeTruthy();
    });
  });
});

describe('SERVICE_CATEGORIES', () => {
  it('has all 13 service categories matching mock data', () => {
    expect(SERVICE_CATEGORIES).toHaveLength(13);
    const values = SERVICE_CATEGORIES.map((s) => s.value);
    expect(values).toContain('Room Service');
    expect(values).toContain('Housekeeping');
    expect(values).toContain('Laundry');
    expect(values).toContain('Extra Bed');
    expect(values).toContain('Spa & Massage');
    expect(values).toContain('Continental Breakfast');
    expect(values).toContain('Airport Transfer');
    expect(values).toContain('Mini Bar');
    expect(values).toContain('Dry Cleaning');
    expect(values).toContain('Turndown Service');
    expect(values).toContain('Wake-up Call');
    expect(values).toContain('Gym Access');
    expect(values).toContain('Pool Towels');
  });

  it('does not contain stale categories that have no matching data', () => {
    const values = SERVICE_CATEGORIES.map((s) => s.value);
    expect(values).not.toContain('Food & Beverage');
    expect(values).not.toContain('Concierge');
  });

  it('each category has a value and label', () => {
    SERVICE_CATEGORIES.forEach((c) => {
      expect(c.value).toBeTruthy();
      expect(c.label).toBeTruthy();
    });
  });
});

describe('SORT_OPTIONS', () => {
  it('has 4 sort options', () => {
    expect(SORT_OPTIONS).toHaveLength(4);
  });

  it('includes newest and oldest', () => {
    const values = SORT_OPTIONS.map((s) => s.value);
    expect(values).toContain('newest');
    expect(values).toContain('oldest');
    expect(values).toContain('highest-amount');
    expect(values).toContain('lowest-amount');
  });

  it('has correct field and direction for each sort', () => {
    const newest = SORT_OPTIONS.find((s) => s.value === 'newest')!;
    expect(newest.field).toBe('createdAt');
    expect(newest.dir).toBe('desc');

    const oldest = SORT_OPTIONS.find((s) => s.value === 'oldest')!;
    expect(oldest.field).toBe('createdAt');
    expect(oldest.dir).toBe('asc');
  });
});

describe('Config constants', () => {
  it('PAGE_SIZE is 10', () => {
    expect(PAGE_SIZE).toBe(10);
  });

  it('SLA_THRESHOLD_MINUTES is 15', () => {
    expect(SLA_THRESHOLD_MINUTES).toBe(15);
  });
});
