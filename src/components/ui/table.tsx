import { type ReactNode, type HTMLAttributes, type ThHTMLAttributes, type TdHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { PAGE_SIZE_OPTIONS } from '../../constants';

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  wrapperClassName?: string;
}

export function Table({ className, wrapperClassName, children, ...props }: TableProps) {
  return (
    <div className={cn('w-full overflow-auto [-webkit-overflow-scrolling:touch]', wrapperClassName)}>
      <table className={cn('w-full caption-bottom text-sm', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  sticky?: boolean;
}

export function TableHeader({ className, sticky, ...props }: TableHeaderProps) {
  return (
    <thead
      className={cn(
        '[&_tr]:border-b border-gray-200 dark:border-gray-800',
        sticky && 'sticky top-0 z-10',
        className
      )}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  );
}

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  clickable?: boolean;
}

export function TableRow({ className, clickable, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        'border-b border-gray-100 dark:border-gray-800 transition-colors duration-150',
        clickable && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50',
        className
      )}
      {...props}
    />
  );
}

interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | false;
  onSort?: () => void;
}

export function TableHead({ className, sortable, sortDirection, onSort, children, ...props }: TableHeadProps) {
  return (
    <th
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider whitespace-nowrap',
        sortable && 'cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-300',
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-1.5">
        {children}
        {sortable && (
          <span className="inline-flex flex-col -space-y-1">
            {sortDirection === 'asc' ? (
              <ChevronUp className="h-3 w-3 text-blue-600" />
            ) : sortDirection === 'desc' ? (
              <ChevronDown className="h-3 w-3 text-blue-600" />
            ) : (
              <ChevronsUpDown className="h-3 w-3 opacity-50" />
            )}
          </span>
        )}
      </div>
    </th>
  );
}

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  highlight?: boolean;
}

export function TableCell({ className, highlight, ...props }: TableCellProps) {
  return (
    <td
      className={cn(
        'p-4 align-middle whitespace-nowrap',
        highlight && 'font-medium text-gray-900 dark:text-gray-100',
        className
      )}
      {...props}
    />
  );
}

interface TableEmptyProps {
  colSpan: number;
  message?: string;
  icon?: ReactNode;
}

export function TableEmpty({ colSpan, message = 'No results found', icon }: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="h-60 text-center">
        <div className="flex flex-col items-center justify-center gap-3">
          {icon || (
            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          )}
          <p className="text-gray-500 dark:text-gray-400 text-sm">{message}</p>
        </div>
      </td>
    </tr>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
}

export function Pagination({ currentPage, totalPages, total, onPageChange, pageSize, onPageSizeChange }: PaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3">
        {pageSize !== undefined ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, total)} of {total}
          </p>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {total} {total === 1 ? 'result' : 'results'}
          </p>
        )}
        {pageSize !== undefined && onPageSizeChange && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400">Show</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-7 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              aria-label="Results per page"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {pages.map((page, i) =>
            page === '...' ? (
              <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">...</span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={cn(
                  'min-w-[2rem] h-8 rounded-lg text-sm font-medium transition-colors',
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                {page}
              </button>
            )
          )}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '...')[] = [];
  
  pages.push(1);

  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push('...');

  pages.push(total);

  return pages;
}
