import { useState } from 'react';
import { Button } from '../ui/button';
import { ConfirmDialog } from '../ui/confirm-dialog';
import {
  CheckCircle2,
  XCircle,
  Play,
  Eye,
  ArrowRight,
} from 'lucide-react';
import type { Order } from '../../types';
import { useUpdateOrderStatus } from '../../hooks/useOrders';
import { useUIStore } from '../../store';
import { toast } from 'sonner';

interface OrderActionsProps {
  order: Order;
  showView?: boolean;
  size?: 'sm' | 'default';
}

export function OrderActions({ order, showView = true, size = 'sm' }: OrderActionsProps) {
  const updateStatus = useUpdateOrderStatus();
  const openDrawer = useUIStore((s) => s.openDrawer);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const handleStatusUpdate = (newStatus: string) => {
    setPendingAction(newStatus);

    if (newStatus === 'Cancelled') {
      setShowCancelConfirm(true);
      return;
    }

    executeUpdate(newStatus);
  };

  const executeUpdate = (newStatus: string) => {
    updateStatus.mutate(
      { id: order.id, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Order ${order.id} marked as ${newStatus}`);
        },
        onSettled: () => {
          setPendingAction(null);
          setShowCancelConfirm(false);
        },
      }
    );
  };

  const handleConfirmCancel = () => {
    executeUpdate('Cancelled');
  };

  const canAcknowledge = order.status === 'New';
  const canStart = order.status === 'Acknowledged';
  const canComplete = order.status === 'In Progress';
  const canCancel = !['Completed', 'Cancelled'].includes(order.status);

  return (
    <>
      <div className="flex items-center gap-1.5">
        {showView && (
          <Button
            variant="ghost"
            size={size === 'sm' ? 'icon-sm' : 'icon'}
            onClick={(e) => {
              e.stopPropagation();
              openDrawer(order.id);
            }}
            aria-label="View order details"
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}

        {canAcknowledge && (
          <Button
            variant="outline"
            size={size === 'sm' ? 'icon-sm' : 'icon'}
            onClick={(e) => {
              e.stopPropagation();
              handleStatusUpdate('Acknowledged');
            }}
            loading={updateStatus.isPending && pendingAction === 'Acknowledged'}
            aria-label="Acknowledge order"
            title="Acknowledge"
            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:bg-indigo-950"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}

        {canStart && (
          <Button
            variant="outline"
            size={size === 'sm' ? 'icon-sm' : 'icon'}
            onClick={(e) => {
              e.stopPropagation();
              handleStatusUpdate('In Progress');
            }}
            loading={updateStatus.isPending && pendingAction === 'In Progress'}
            aria-label="Start order"
            title="Start processing"
            className="text-amber-600 border-amber-200 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-950"
          >
            <Play className="h-4 w-4" />
          </Button>
        )}

        {canComplete && (
          <Button
            variant="outline"
            size={size === 'sm' ? 'icon-sm' : 'icon'}
            onClick={(e) => {
              e.stopPropagation();
              handleStatusUpdate('Completed');
            }}
            loading={updateStatus.isPending && pendingAction === 'Completed'}
            aria-label="Complete order"
            title="Mark as completed"
            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950"
          >
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        )}

        {canCancel && (
          <Button
            variant="ghost"
            size={size === 'sm' ? 'icon-sm' : 'icon'}
            onClick={(e) => {
              e.stopPropagation();
              handleStatusUpdate('Cancelled');
            }}
            loading={updateStatus.isPending && pendingAction === 'Cancelled'}
            aria-label="Cancel order"
            title="Cancel order"
            className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={showCancelConfirm}
        onClose={() => {
          setShowCancelConfirm(false);
          setPendingAction(null);
        }}
        onConfirm={handleConfirmCancel}
        title="Cancel Order"
        message={`Are you sure you want to cancel order ${order.id} for ${order.guestName} (${order.service})? This action cannot be undone.`}
        confirmLabel="Yes, Cancel Order"
        cancelLabel="Keep Order"
        variant="danger"
        loading={updateStatus.isPending}
      />
    </>
  );
}
