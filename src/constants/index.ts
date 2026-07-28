export const ORDER_STATUSES: { value: string; label: string; color: string }[] = [
  { value: 'New', label: 'New', color: 'blue' },
  { value: 'Acknowledged', label: 'Acknowledged', color: 'indigo' },
  { value: 'In Progress', label: 'In Progress', color: 'amber' },
  { value: 'Completed', label: 'Completed', color: 'green' },
  { value: 'Cancelled', label: 'Cancelled', color: 'red' },
];

export const PAYMENT_STATUSES: { value: string; label: string; color: string }[] = [
  { value: 'Pending', label: 'Pending', color: 'amber' },
  { value: 'Paid', label: 'Paid', color: 'green' },
  { value: 'Failed', label: 'Failed', color: 'red' },
];

export const SERVICE_CATEGORIES: { value: string; label: string }[] = [
  { value: 'Room Service', label: 'Room Service' },
  { value: 'Housekeeping', label: 'Housekeeping' },
  { value: 'Laundry', label: 'Laundry' },
  { value: 'Extra Bed', label: 'Extra Bed' },
  { value: 'Spa & Massage', label: 'Spa & Massage' },
  { value: 'Continental Breakfast', label: 'Continental Breakfast' },
  { value: 'Airport Transfer', label: 'Airport Transfer' },
  { value: 'Mini Bar', label: 'Mini Bar' },
  { value: 'Turndown Service', label: 'Turndown Service' },
  { value: 'Dry Cleaning', label: 'Dry Cleaning' },
  { value: 'Wake-up Call', label: 'Wake-up Call' },
  { value: 'Gym Access', label: 'Gym Access' },
  { value: 'Pool Towels', label: 'Pool Towels' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest', field: 'createdAt' as const, dir: 'desc' as const },
  { value: 'oldest', label: 'Oldest', field: 'createdAt' as const, dir: 'asc' as const },
  { value: 'highest-amount', label: 'Highest Amount', field: 'amount' as const, dir: 'desc' as const },
  { value: 'lowest-amount', label: 'Lowest Amount', field: 'amount' as const, dir: 'asc' as const },
];

export const PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 15, 20] as const;
export const SLA_THRESHOLD_MINUTES = 15;
export const REALTIME_INTERVAL_MIN = 20000;
export const REALTIME_INTERVAL_MAX = 30000;
