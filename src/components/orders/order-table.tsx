import { motion, AnimatePresence } from 'framer-motion';
import { useCallback } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty, Pagination } from '../ui/table';
import { Badge } from '../ui/badge';
import { TableSkeleton } from '../ui/skeleton';
import { OrderActions } from './order-actions';
import { formatDate, formatTime, getSLAStatus, formatCurrency } from '../../lib/utils';
import { useUIStore } from '../../store';
import { AlertTriangle, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { OrdersResponse, SortField, SortDirection } from '../../types';

interface OrderTableProps {
  data?: OrdersResponse;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (sortValue: string) => void;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
}

const STATUS_BADGE_VARIANTS: Record<string, 'blue' | 'indigo' | 'amber' | 'green' | 'red'> = {
  'New': 'blue',
  'Acknowledged': 'indigo',
  'In Progress': 'amber',
  'Completed': 'green',
  'Cancelled': 'red',
};

const PAYMENT_BADGE_VARIANTS: Record<string, 'amber' | 'green' | 'red'> = {
  'Pending': 'amber',
  'Paid': 'green',
  'Failed': 'red',
};

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.2 },
  }),
};

export function OrderTable({ data, isLoading, isError, onRetry, sortField, sortDirection, onSortChange, onPageChange, pageSize, onPageSizeChange }: OrderTableProps) {
  const openDrawer = useUIStore((s) => s.openDrawer);

  const handleSortToggle = useCallback(
    (field: SortField) => {
      if (field === sortField) {
        const newSortValue = sortDirection === 'desc'
          ? (field === 'createdAt' ? 'oldest' : 'lowest-amount')
          : (field === 'createdAt' ? 'newest' : 'highest-amount');
        onSortChange(newSortValue);
      } else {
        onSortChange(field === 'createdAt' ? 'newest' : 'highest-amount');
      }
    },
    [sortField, sortDirection, onSortChange]
  );

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-12">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Failed to load orders
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Something went wrong. Please try again.
            </p>
          </div>
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Service</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Order Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableEmpty colSpan={10} message="No orders found" />
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <Table>
        <TableHeader sticky>
          <TableRow>
            <TableHead className="w-[110px]">Order ID</TableHead>
            <TableHead className="w-[160px]">Guest</TableHead>
            <TableHead className="w-[70px]">Room</TableHead>
            <TableHead className="w-[160px]">Service</TableHead>
            <TableHead className="w-[50px] text-center">Qty</TableHead>
            <TableHead
              sortable
              sortDirection={sortField === 'amount' ? sortDirection : false}
              onSort={() => handleSortToggle('amount')}
              className="w-[90px] text-right"
            >
              Amount
            </TableHead>
            <TableHead
              sortable
              sortDirection={sortField === 'createdAt' ? sortDirection : false}
              onSort={() => handleSortToggle('createdAt')}
              className="w-[130px]"
            >
              Order Time
            </TableHead>
            <TableHead className="w-[110px]">Status</TableHead>
            <TableHead className="w-[90px]">Payment</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence mode="popLayout">
            {data.data.map((order, i) => {
              const slaStatus = getSLAStatus(order.createdAt);
              const isSLABreached = slaStatus === 'breached';

              return (
                <motion.tr
                  key={order.id}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                  layout
                  onClick={() => openDrawer(order.id)}
                  className={cn(
                    'border-b border-gray-100 dark:border-gray-800 transition-colors duration-150 cursor-pointer',
                    'hover:bg-gray-50 dark:hover:bg-gray-800/40',
                    isSLABreached && 'bg-red-50/50 dark:bg-red-950/20 sla-breached'
                  )}
                >
                  <TableCell className="font-mono text-xs font-medium text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      {isSLABreached && (
                        <Clock className="h-3 w-3 text-red-500 flex-shrink-0 animate-pulse" />
                      )}
                      {order.id}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                        {order.guestName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[120px]">
                        {order.guestName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                      {order.roomNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate block max-w-[140px]">
                      {order.service}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                    {order.quantity}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatCurrency(order.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(order.orderTime)}
                      </span>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">
                        {formatTime(order.orderTime)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_BADGE_VARIANTS[order.status] || 'default'} size="sm">
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={PAYMENT_BADGE_VARIANTS[order.paymentStatus] || 'default'} size="sm">
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                      <OrderActions order={order} />
                    </div>
                  </TableCell>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </TableBody>
      </Table>

      <Pagination
        currentPage={data.page}
        totalPages={data.totalPages}
        total={data.total}
        onPageChange={onPageChange}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
