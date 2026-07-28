import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrders } from '../hooks/useOrders';
import { useOrderFilters } from '../hooks/useOrderFilters';
import { OrderTable } from '../components/orders/order-table';
import { OrderFilters } from '../components/orders/order-filters';
import { OrderDrawer } from '../components/orders/order-drawer';
import { NewOrderForm } from '../components/orders/new-order-form';
import { Button } from '../components/ui/button';
import { ClipboardList, Plus } from 'lucide-react';

export function OrdersPage() {
  const [showNewOrder, setShowNewOrder] = useState(false);
  const {
    filters,
    setSearch,
    setStatusFilter,
    setServiceFilter,
    setPaymentStatusFilter,
    setSort,
    setPage,
    setPageSize,
  } = useOrderFilters();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useOrders({
    page: filters.page,
    pageSize: filters.pageSize,
    search: filters.search || undefined,
    status: filters.status !== 'all' ? filters.status : undefined,
    service: filters.service !== 'all' ? filters.service : undefined,
    paymentStatus: filters.paymentStatus !== 'all' ? filters.paymentStatus : undefined,
    sortField: filters.sortField,
    sortDirection: filters.sortDirection,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Orders</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage and track all service orders
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {data && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-sm">
              <ClipboardList className="h-4 w-4" />
              <span className="font-medium">{data.total}</span>
              <span className="text-blue-500">total orders</span>
            </div>
          )}
          <Button onClick={() => setShowNewOrder(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* New Order Form */}
      <AnimatePresence>
        {showNewOrder && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="relative">
              <NewOrderForm onClose={() => setShowNewOrder(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      {!showNewOrder && (
        <OrderFilters
          searchValue={filters.search}
          statusValue={filters.status}
          serviceValue={filters.service}
          paymentStatusValue={filters.paymentStatus}
          sortField={filters.sortField}
          sortDirection={filters.sortDirection}
          onSearchChange={setSearch}
          onStatusChange={setStatusFilter}
          onServiceChange={setServiceFilter}
          onPaymentStatusChange={setPaymentStatusFilter}
          onSortChange={setSort}
        />
      )}

      {/* Table */}
      <OrderTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        sortField={filters.sortField}
        sortDirection={filters.sortDirection}
        onSortChange={setSort}
        onPageChange={setPage}
        pageSize={filters.pageSize}
        onPageSizeChange={setPageSize}
      />

      {/* Order Drawer */}
      <OrderDrawer />
    </div>
  );
}
