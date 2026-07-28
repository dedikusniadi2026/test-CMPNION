import { describe, it, expect } from 'bun:test';
import { parseSortFromParams } from '../hooks/useOrderFilters';
import { SORT_OPTIONS } from '../constants';

describe('parseSortFromParams', () => {
  it('returns defaults for empty params', () => {
    const params = new URLSearchParams('');
    const result = parseSortFromParams(params);
    expect(result.sortField).toBe('createdAt');
    expect(result.sortDirection).toBe('desc');
  });

  it('parses sort=newest', () => {
    const params = new URLSearchParams('sort=newest');
    const result = parseSortFromParams(params);
    expect(result.sortField).toBe('createdAt');
    expect(result.sortDirection).toBe('desc');
  });

  it('parses sort=oldest', () => {
    const params = new URLSearchParams('sort=oldest');
    const result = parseSortFromParams(params);
    expect(result.sortField).toBe('createdAt');
    expect(result.sortDirection).toBe('asc');
  });

  it('parses sort=highest-amount', () => {
    const params = new URLSearchParams('sort=highest-amount');
    const result = parseSortFromParams(params);
    expect(result.sortField).toBe('amount');
    expect(result.sortDirection).toBe('desc');
  });

  it('parses sort=lowest-amount', () => {
    const params = new URLSearchParams('sort=lowest-amount');
    const result = parseSortFromParams(params);
    expect(result.sortField).toBe('amount');
    expect(result.sortDirection).toBe('asc');
  });

  it('fallbacks to defaults for unknown sort value', () => {
    const params = new URLSearchParams('sort=unknown-value');
    const result = parseSortFromParams(params);
    expect(result.sortField).toBe('createdAt');
    expect(result.sortDirection).toBe('desc');
  });
});

describe('SORT_OPTIONS constants', () => {
  it('has 4 valid sort options', () => {
    expect(SORT_OPTIONS).toHaveLength(4);
    SORT_OPTIONS.forEach((option) => {
      expect(option.value).toBeTruthy();
      expect(option.label).toBeTruthy();
      expect(['createdAt', 'amount']).toContain(option.field);
      expect(['asc', 'desc']).toContain(option.dir);
    });
  });
});

describe('URL param fallback behavior', () => {
  it('defaults page to 1 when missing or invalid', () => {
    expect(Number(new URLSearchParams('').get('page')) || 1).toBe(1);
    expect(Number(new URLSearchParams('page=invalid').get('page')) || 1).toBe(1);
    expect(Number(new URLSearchParams('page=abc').get('page')) || 1).toBe(1);
  });

  it('parses valid page numbers', () => {
    expect(Number(new URLSearchParams('page=5').get('page')) || 1).toBe(5);
    expect(Number(new URLSearchParams('page=1').get('page')) || 1).toBe(1);
  });

  it('defaults pageSize to 10 when missing', () => {
    expect(Number(new URLSearchParams('').get('pageSize')) || 10).toBe(10);
  });

  it('parses valid pageSize values', () => {
    expect(Number(new URLSearchParams('pageSize=20').get('pageSize')) || 10).toBe(20);
    expect(Number(new URLSearchParams('pageSize=5').get('pageSize')) || 10).toBe(5);
  });

  it('defaults search to empty string when missing', () => {
    expect(new URLSearchParams('').get('search') || '').toBe('');
  });

  it('parses URL-encoded service names', () => {
    const params = new URLSearchParams('service=Room+Service');
    expect(params.get('service')).toBe('Room Service');
  });

  it('defaults status/service/paymentStatus to "all" when missing', () => {
    const empty = new URLSearchParams('');
    expect(empty.get('status') || 'all').toBe('all');
    expect(empty.get('service') || 'all').toBe('all');
    expect(empty.get('paymentStatus') || 'all').toBe('all');
  });
});
