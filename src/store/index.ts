import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  read: boolean;
}

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  selectedOrderId: string | null;
  drawerOpen: boolean;
  openDrawer: (orderId: string) => void;
  closeDrawer: () => void;

  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  unreadCount: () => number;

  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  theme: 'light',
  setTheme: (theme) => {
    set({ theme });
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  },
  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(next);
  },

  selectedOrderId: null,
  drawerOpen: false,
  openDrawer: (orderId) => set({ selectedOrderId: orderId, drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false, selectedOrderId: null }),

  notifications: [],
  addNotification: (notification) =>
    set(state => ({
      notifications: [
        {
          ...notification,
          id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: new Date().toISOString(),
          read: false,
        },
        ...state.notifications,
      ],
    })),
  markNotificationRead: (id) =>
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllNotificationsRead: () =>
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
    })),
  clearNotifications: () => set({ notifications: [] }),
  unreadCount: () => get().notifications.filter(n => !n.read).length,
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));
