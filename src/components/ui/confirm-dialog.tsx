import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './button';
import { cn } from '../../lib/utils';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  const variantStyles = {
    danger: {
      icon: 'text-red-500 bg-red-100 dark:bg-red-900/30',
      button: 'destructive',
    },
    warning: {
      icon: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
      button: 'default',
    },
    info: {
      icon: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
      button: 'default',
    },
  };

  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="w-full max-w-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="p-6">
                {/* Icon */}
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center mb-4', styles.icon)}>
                  <AlertTriangle className="h-5 w-5" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {title}
                </h3>

                {/* Message */}
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-950/50 border-t border-gray-100 dark:border-gray-800">
                <Button variant="outline" onClick={onClose} disabled={loading}>
                  {cancelLabel}
                </Button>
                <Button
                  variant={variant === 'danger' ? 'destructive' : 'default'}
                  onClick={onConfirm}
                  loading={loading}
                >
                  {confirmLabel}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
