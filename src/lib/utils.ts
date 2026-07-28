import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date, format = 'MMM D, YYYY h:mm A'): string {
  return dayjs(date).format(format);
}

export function formatDateShort(date: string | Date): string {
  return dayjs(date).format('MMM D, YYYY');
}

export function formatTime(date: string | Date): string {
  return dayjs(date).format('h:mm A');
}

export function timeAgo(date: string | Date): string {
  return dayjs(date).fromNow();
}

export function getSLAStatus(createdAt: string): 'ok' | 'warning' | 'breached' {
  const created = dayjs(createdAt);
  const now = dayjs();
  const diffMinutes = now.diff(created, 'minute');
  if (diffMinutes >= 15) return 'breached';
  if (diffMinutes >= 10) return 'warning';
  return 'ok';
}

export function generateId(): string {
  return `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

export function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
