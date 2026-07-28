import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './sidebar';
import { TopNav } from './topnav';
import { MobileDrawer } from './mobile-drawer';
import { cn } from '../lib/utils';
import { useUIStore } from '../store';

export function Layout() {
  const { sidebarCollapsed } = useUIStore();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Sidebar />
      <MobileDrawer />

      <div
        className={cn(
          'transition-all duration-300 ml-0',
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
        )}
      >
        <TopNav />
        <main className="p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
