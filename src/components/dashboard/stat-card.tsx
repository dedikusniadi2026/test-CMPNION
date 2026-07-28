import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  trend?: number;
  icon: React.ReactNode;
  format?: 'number' | 'currency';
  color?: 'blue' | 'green' | 'amber' | 'purple' | 'red' | 'cyan';
  onClick?: () => void;
}

const colorMap = {
  blue: 'from-blue-500/10 to-blue-600/5 border-blue-200/50 dark:border-blue-900/50',
  green: 'from-emerald-500/10 to-emerald-600/5 border-emerald-200/50 dark:border-emerald-900/50',
  amber: 'from-amber-500/10 to-amber-600/5 border-amber-200/50 dark:border-amber-900/50',
  purple: 'from-purple-500/10 to-purple-600/5 border-purple-200/50 dark:border-purple-900/50',
  red: 'from-red-500/10 to-red-600/5 border-red-200/50 dark:border-red-900/50',
  cyan: 'from-cyan-500/10 to-cyan-600/5 border-cyan-200/50 dark:border-cyan-900/50',
};

const iconColorMap = {
  blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
  green: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30',
  amber: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30',
  purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
  red: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
  cyan: 'text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/30',
};

export function StatCard({ title, value, trend, icon, format = 'number', color = 'blue', onClick }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const startValue = prevValue.current;
    const endValue = value;
    const increment = (endValue - startValue) / steps;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayValue(endValue);
        prevValue.current = endValue;
        clearInterval(timer);
      } else {
        setDisplayValue(startValue + increment * currentStep);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value]);

  const formattedValue = format === 'currency'
    ? formatCurrency(Math.round(displayValue))
    : format === 'number'
    ? Math.round(displayValue).toLocaleString()
    : String(Math.round(displayValue));

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={cn(
        'relative rounded-xl border bg-gradient-to-br p-5 cursor-pointer transition-shadow duration-300 hover:shadow-lg',
        colorMap[color],
        'bg-white dark:bg-gray-900'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={cn(
          'p-2 rounded-lg',
          iconColorMap[color]
        )}>
          {icon}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
          {formattedValue}
        </div>

        {trend !== undefined && (
          <div className="flex items-center gap-1.5">
            {trend > 0 ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            ) : trend < 0 ? (
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
            ) : (
              <Minus className="h-3.5 w-3.5 text-gray-400" />
            )}
            <span
              className={cn(
                'text-xs font-medium',
                trend > 0 ? 'text-emerald-600 dark:text-emerald-400' : 
                trend < 0 ? 'text-red-600 dark:text-red-400' : 
                'text-gray-400'
              )}
            >
              {Math.abs(trend).toFixed(1)}%
            </span>
            <span className="text-xs text-gray-400">vs yesterday</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
