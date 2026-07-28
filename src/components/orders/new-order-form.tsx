import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { Button, Input, Select } from '../ui';
import { Card, CardHeader, CardContent } from '../ui/card';
import { SERVICE_CATEGORIES } from '../../constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { generateId } from '../../lib/utils';
import type { Order } from '../../types';

const orderSchema = z.object({
  guestName: z.string().min(2, 'Guest name must be at least 2 characters'),
  roomNumber: z.string().min(1, 'Room number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  serviceCategory: z.string().min(1, 'Please select a service category'),
  serviceName: z.string().min(2, 'Service name is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Price must be positive'),
  specialRequest: z.string().optional().or(z.literal('')),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface NewOrderFormProps {
  onClose: () => void;
}

export function NewOrderForm({ onClose }: NewOrderFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      quantity: 1,
      unitPrice: 0,
    },
  });

  const createOrder = useMutation({
    mutationFn: async (data: OrderFormData) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const { addOrder } = await import('../../mock');

      const now = new Date().toISOString();
      const order: Order = {
        id: generateId(),
        guestName: data.guestName,
        roomNumber: data.roomNumber,
        service: data.serviceName,
        quantity: data.quantity,
        amount: data.quantity * data.unitPrice,
        specialRequest: data.specialRequest || undefined,
        orderTime: now,
        status: 'New',
        paymentStatus: 'Pending',
        createdAt: now,
        updatedAt: now,
      };

      addOrder(order);
      return order;
    },
    onSuccess: () => {
      toast.success('Order created successfully');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      onClose();
    },
    onError: () => {
      toast.error('Failed to create order');
    },
  });

  const onSubmit = (data: OrderFormData) => {
    createOrder.mutate(data);
  };

  const quantity = watch('quantity', 1);
  const unitPrice = watch('unitPrice', 0);
  const total = quantity * unitPrice;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative max-w-lg mx-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close form"
        >
          <X className="h-4 w-4" />
        </button>
        <CardHeader
          title="New Service Order"
          description="Create a new order for a guest"
        />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Guest Name"
                placeholder="e.g. John Doe"
                error={errors.guestName?.message}
                {...register('guestName')}
              />
              <Input
                label="Room Number"
                placeholder="e.g. 301"
                error={errors.roomNumber?.message}
                {...register('roomNumber')}
              />
            </div>
            <Input
              label="Email (optional)"
              type="email"
              placeholder="guest@hotel.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Service Category"
                options={SERVICE_CATEGORIES.map((c) => ({
                  value: c.value,
                  label: c.label,
                }))}
                placeholder="Select category"
                error={errors.serviceCategory?.message}
                {...register('serviceCategory')}
              />
              <Input
                label="Service Name"
                placeholder="e.g. Continental Breakfast"
                error={errors.serviceName?.message}
                {...register('serviceName')}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Quantity"
                type="number"
                min="1"
                error={errors.quantity?.message}
                {...register('quantity', { valueAsNumber: true })}
              />
              <Input
                label="Unit Price ($)"
                type="number"
                min="0"
                step="0.01"
                error={errors.unitPrice?.message}
                {...register('unitPrice', { valueAsNumber: true })}
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                  Total
                </label>
                <div className="flex h-10 items-center px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  ${total.toFixed(2)}
                </div>
              </div>
            </div>
            <Input
              label="Special Request (optional)"
              placeholder="Any special instructions..."
              error={errors.specialRequest?.message}
              {...register('specialRequest')}
            />
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" loading={isSubmitting || createOrder.isPending} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Create Order
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
