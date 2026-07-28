import { useState, useEffect, useCallback, useRef } from 'react';
import { SearchInput, Select } from '../ui';
import { ORDER_STATUSES, PAYMENT_STATUSES, SERVICE_CATEGORIES, SORT_OPTIONS } from '../../constants';
import type { SortField, SortDirection } from '../../types';

interface OrderFiltersProps {
  searchValue: string;
  statusValue: string;
  serviceValue: string;
  paymentStatusValue: string;
  sortField: SortField;
  sortDirection: SortDirection;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: string) => void;
  onServiceChange: (service: string) => void;
  onPaymentStatusChange: (paymentStatus: string) => void;
  onSortChange: (sortValue: string) => void;
}

export function OrderFilters({
  searchValue,
  statusValue,
  serviceValue,
  paymentStatusValue,
  sortField,
  sortDirection,
  onSearchChange,
  onStatusChange,
  onServiceChange,
  onPaymentStatusChange,
  onSortChange,
}: OrderFiltersProps) {
  const [localSearch, setLocalSearch] = useState(searchValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearch(value);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        onSearchChange(value);
      }, 300);
    },
    [onSearchChange]
  );

  const currentSort =
    SORT_OPTIONS.find((o) => o.field === sortField && o.dir === sortDirection)?.value || 'newest';

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <SearchInput
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          onClear={() => handleSearchChange('')}
          clearable
          placeholder="Search by guest, room, or order ID..."
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <Select
          value={statusValue}
          onChange={(e) => onStatusChange(e.target.value)}
          options={[
            { value: 'all', label: 'All Statuses' },
            ...ORDER_STATUSES.map((s) => ({ value: s.value, label: s.label })),
          ]}
          className="w-[140px]"
        />
        <Select
          value={serviceValue}
          onChange={(e) => onServiceChange(e.target.value)}
          options={[
            { value: 'all', label: 'All Services' },
            ...SERVICE_CATEGORIES.map((s) => ({ value: s.value, label: s.label })),
          ]}
          className="w-[150px]"
        />
        <Select
          value={paymentStatusValue}
          onChange={(e) => onPaymentStatusChange(e.target.value)}
          options={[
            { value: 'all', label: 'All Payments' },
            ...PAYMENT_STATUSES.map((s) => ({ value: s.value, label: s.label })),
          ]}
          className="w-[140px]"
        />
        <Select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          options={SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          className="w-[140px]"
        />
      </div>
    </div>
  );
}
