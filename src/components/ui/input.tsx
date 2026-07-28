import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { Search, X } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, clearable, onClear, value, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            className={cn(
              'flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200',
              icon && 'pl-10',
              clearable && value && 'pr-10',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            ref={ref}
            value={value}
            {...props}
          />
          {clearable && value && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              tabIndex={-1}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface SearchInputProps extends Omit<InputProps, 'icon'> {
  placeholder?: string;
}

export function SearchInput({ placeholder = 'Search...', className, ...props }: SearchInputProps) {
  return (
    <Input
      icon={<Search className="h-4 w-4" />}
      placeholder={placeholder}
      className={cn('bg-gray-50 dark:bg-gray-800/50', className)}
      {...props}
    />
  );
}

export { Input };
