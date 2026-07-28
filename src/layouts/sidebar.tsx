import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Hotel } from 'lucide-react';
import { cn } from '../lib/utils';
import { useUIStore } from '../store';
import { NAV_ITEMS } from './nav-config';

export function Sidebar() {
  const location = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-30 h-screen bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex-col',
        'hidden lg:flex',
        sidebarCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 border-b border-gray-200 dark:border-gray-800 px-4',
        sidebarCollapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <Hotel className="h-4 w-4 text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap overflow-hidden"
            >
              Hotel Dashboard
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className={cn(
                'h-5 w-5 flex-shrink-0',
                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
              )} />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-lg border border-blue-200 dark:border-blue-900/50"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full flex items-center justify-center h-9 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
