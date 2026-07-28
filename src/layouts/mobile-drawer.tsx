import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Hotel } from 'lucide-react';
import { cn } from '../lib/utils';
import { useUIStore } from '../store';
import { NAV_ITEMS } from './nav-config';

export function MobileDrawer() {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 z-50 h-full w-64 bg-white dark:bg-gray-950 shadow-2xl lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Hotel className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Hotel Dashboard
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
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
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                    )}
                  >
                    <Icon className={cn(
                      'h-5 w-5',
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
                    )} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
