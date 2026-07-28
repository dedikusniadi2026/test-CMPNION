import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  Bell,
  Menu,
  Command,
  CheckCheck,
  Trash2,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useUIStore } from '../store';
import { timeAgo } from '../lib/utils';

export function TopNav() {
  const {
    theme,
    toggleTheme,
    toggleSidebar,
    notifications,
    unreadCount,
    markAllNotificationsRead,
    clearNotifications,
    markNotificationRead,
    setCommandPaletteOpen,
  } = useUIStore();

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setCommandPaletteOpen]);

  const count = unreadCount();

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 text-xs">
            <Command className="h-3 w-3" />
            <span>K</span>
            <span className="text-gray-500">to search</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ''}`}
            >
              <Bell className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Notifications
                    </h3>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={markAllNotificationsRead}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Mark all as read"
                        title="Mark all as read"
                      >
                        <CheckCheck className="h-4 w-4" />
                      </button>
                      <button
                        onClick={clearNotifications}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Clear notifications"
                        title="Clear all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-sm text-gray-400">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={cn(
                            'w-full text-left px-4 py-3 border-b border-gray-50 dark:border-gray-800/50 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30',
                            !notif.read && 'bg-blue-50/50 dark:bg-blue-950/20'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              'flex-shrink-0 w-2 h-2 mt-2 rounded-full',
                              !notif.read ? 'bg-blue-600' : 'bg-transparent'
                            )} />
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                'text-sm truncate',
                                !notif.read ? 'font-medium text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'
                              )}>
                                {notif.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 truncate">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{timeAgo(notif.timestamp)}</p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Avatar */}
          <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
              HS
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
              Hotel Staff
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
