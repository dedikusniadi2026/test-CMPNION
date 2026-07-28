import { describe, it, expect } from 'bun:test';
import {
  cn,
  formatCurrency,
  formatDate,
  formatDateShort,
  formatTime,
  getSLAStatus,
  generateId,
} from '../lib/utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    const showHidden = false;
    expect(cn('base', showHidden && 'hidden', 'visible')).toBe('base visible');
  });

  it('handles undefined and null', () => {
    expect(cn('a', undefined, null, 'b')).toBe('a b');
  });

  it('merges tailwind classes correctly', () => {
    expect(cn('px-4', 'px-2')).toBe('px-2');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });
});

describe('formatCurrency', () => {
  it('formats USD by default', () => {
    expect(formatCurrency(45)).toBe('$45.00');
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats with custom currency', () => {
    expect(formatCurrency(50, 'EUR')).toBe('€50.00');
  });

  it('handles large numbers', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
  });
});

describe('formatDate', () => {
  it('formats a date string', () => {
    const result = formatDate('2026-07-28T17:30:00Z', 'MMM D, YYYY');
    expect(result).toBe('Jul 28, 2026');
  });

  it('formats with time by default', () => {
    const result = formatDate('2026-07-28T17:30:00Z');
    expect(result).toContain('Jul 28, 2026');
    expect(result).toContain('5:30');
  });

  it('handles Date objects', () => {
    const result = formatDateShort(new Date('2026-07-28'));
    expect(result).toBe('Jul 28, 2026');
  });
});

describe('formatTime', () => {
  it('formats time correctly', () => {
    expect(formatTime('2026-07-28T17:30:00Z')).toContain('5:30');
    expect(formatTime('2026-07-28T08:00:00Z')).toContain('8:00');
  });
});

describe('getSLAStatus', () => {
  it('returns ok for recent orders', () => {
    const recent = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(getSLAStatus(recent)).toBe('ok');
  });

  it('returns warning for orders 10+ minutes old', () => {
    const warning = new Date(Date.now() - 12 * 60 * 1000).toISOString();
    expect(getSLAStatus(warning)).toBe('warning');
  });

  it('returns breached for orders 15+ minutes old', () => {
    const breached = new Date(Date.now() - 20 * 60 * 1000).toISOString();
    expect(getSLAStatus(breached)).toBe('breached');
  });

  it('returns breached for orders exactly 15 minutes old', () => {
    const exactly = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    expect(getSLAStatus(exactly)).toBe('breached');
  });
});

describe('generateId', () => {
  it('generates a string starting with ORD-', () => {
    const id = generateId();
    expect(id).toMatch(/^ORD-/);
  });

  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});
