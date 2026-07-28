import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
        blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
        amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
        green: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
        red: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        cyan: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-[10px]',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  blinking?: boolean;
}

export function Badge({ className, variant, size, dot, blinking, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {(dot || blinking) && (
        <span
          className={cn(
            'mr-1.5 inline-block h-2 w-2 rounded-full',
            blinking && 'animate-pulse',
            {
              'bg-current': true,
            }
          )}
        />
      )}
      {children}
    </span>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { badgeVariants };
