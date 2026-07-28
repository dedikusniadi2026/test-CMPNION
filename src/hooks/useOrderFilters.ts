import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { SortField, SortDirection } from '../types';
import { SORT_OPTIONS } from '../constants';

export interface OrderFilters {
  search: string;
  status: string;
  service: string;
  paymentStatus: string;
  sortField: SortField;
  sortDirection: SortDirection;
  page: number;
  pageSize: number;
}

export function parseSortFromParams(searchParams: URLSearchParams): {
  sortField: SortField;
  sortDirection: SortDirection;
} {
  const sort = searchParams.get('sort');
  if (sort) {
    const option = SORT_OPTIONS.find((o) => o.value === sort);
    if (option) return { sortField: option.field, sortDirection: option.dir };
  }
  return { sortField: 'createdAt', sortDirection: 'desc' };
}

export function useOrderFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: OrderFilters = useMemo(() => {
    const { sortField, sortDirection } = parseSortFromParams(searchParams);
    return {
      search: searchParams.get('search') || '',
      status: searchParams.get('status') || 'all',
      service: searchParams.get('service') || 'all',
      paymentStatus: searchParams.get('paymentStatus') || 'all',
      sortField,
      sortDirection,
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 10,
    };
  }, [searchParams]);

  /**
   * Update URL params. When a filter/search/sort changes (not page/pageSize),
   * the page resets to 1 automatically.
   */
  const updateParams = useCallback(
    (updates: Record<string, string | null>, resetPage = false) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(updates)) {
            if (value === null || value === '' || value === 'all' || value === 'newest') {
              next.delete(key);
            } else {
              next.set(key, value);
            }
          }
          if (resetPage) {
            next.delete('page');
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setSearch = useCallback(
    (search: string) => updateParams({ search: search || null }, true),
    [updateParams]
  );

  const setStatusFilter = useCallback(
    (status: string) => updateParams({ status: status === 'all' ? null : status }, true),
    [updateParams]
  );

  const setServiceFilter = useCallback(
    (service: string) => updateParams({ service: service === 'all' ? null : service }, true),
    [updateParams]
  );

  const setPaymentStatusFilter = useCallback(
    (paymentStatus: string) =>
      updateParams({ paymentStatus: paymentStatus === 'all' ? null : paymentStatus }, true),
    [updateParams]
  );

  const setSort = useCallback(
    (sortValue: string) => updateParams({ sort: sortValue === 'newest' ? null : sortValue }, true),
    [updateParams]
  );

  const setPage = useCallback(
    (page: number) => updateParams({ page: page > 1 ? String(page) : null }),
    [updateParams]
  );

  const setPageSize = useCallback(
    (pageSize: number) =>
      updateParams({ pageSize: pageSize !== 10 ? String(pageSize) : null }, true),
    [updateParams]
  );

  const resetFilters = useCallback(
    () => setSearchParams({}, { replace: true }),
    [setSearchParams]
  );

  return {
    filters,
    setSearch,
    setStatusFilter,
    setServiceFilter,
    setPaymentStatusFilter,
    setSort,
    setPage,
    setPageSize,
    resetFilters,
  };
}
