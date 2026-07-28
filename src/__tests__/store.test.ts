import { describe, it, expect, beforeEach } from 'bun:test';
import { useUIStore } from '../store';

beforeEach(() => {
  useUIStore.setState({
    sidebarOpen: false,
    sidebarCollapsed: false,
    selectedOrderId: null,
    drawerOpen: false,
    notifications: [],
    commandPaletteOpen: false,
    theme: 'light',
  });
});

describe('Sidebar', () => {
  it('starts closed and not collapsed', () => {
    const state = useUIStore.getState();
    expect(state.sidebarOpen).toBe(false);
    expect(state.sidebarCollapsed).toBe(false);
  });

  it('toggles sidebar open/close', () => {
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(true);

    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(false);
  });

  it('sets sidebar open', () => {
    useUIStore.getState().setSidebarOpen(true);
    expect(useUIStore.getState().sidebarOpen).toBe(true);
  });

  it('sets sidebar collapsed', () => {
    useUIStore.getState().setSidebarCollapsed(true);
    expect(useUIStore.getState().sidebarCollapsed).toBe(true);
  });
});

describe('Theme', () => {
  it('starts with light theme by default', () => {
    expect(useUIStore.getState().theme).toBe('light');
  });

  it('toggles theme', () => {
    useUIStore.getState().toggleTheme();
    expect(useUIStore.getState().theme).toBe('dark');

    useUIStore.getState().toggleTheme();
    expect(useUIStore.getState().theme).toBe('light');
  });

  it('sets theme directly', () => {
    useUIStore.getState().setTheme('dark');
    expect(useUIStore.getState().theme).toBe('dark');

    useUIStore.getState().setTheme('light');
    expect(useUIStore.getState().theme).toBe('light');
  });
});

describe('Order Drawer', () => {
  it('starts closed with no selection', () => {
    const state = useUIStore.getState();
    expect(state.drawerOpen).toBe(false);
    expect(state.selectedOrderId).toBeNull();
  });

  it('opens drawer with order ID', () => {
    useUIStore.getState().openDrawer('ORD-1001');
    const state = useUIStore.getState();
    expect(state.drawerOpen).toBe(true);
    expect(state.selectedOrderId).toBe('ORD-1001');
  });

  it('closes drawer and clears selection', () => {
    useUIStore.getState().openDrawer('ORD-1001');
    useUIStore.getState().closeDrawer();
    const state = useUIStore.getState();
    expect(state.drawerOpen).toBe(false);
    expect(state.selectedOrderId).toBeNull();
  });
});



describe('Notifications', () => {
  it('starts with empty notifications', () => {
    expect(useUIStore.getState().notifications).toHaveLength(0);
    expect(useUIStore.getState().unreadCount()).toBe(0);
  });

  it('adds a notification', () => {
    useUIStore.getState().addNotification({
      title: 'New Order',
      message: 'Test notification',
      type: 'info',
    });

    const notifications = useUIStore.getState().notifications;
    expect(notifications).toHaveLength(1);
    expect(notifications[0].title).toBe('New Order');
    expect(notifications[0].message).toBe('Test notification');
    expect(notifications[0].read).toBe(false);
    expect(notifications[0].id).toBeTruthy();
    expect(notifications[0].timestamp).toBeTruthy();
  });

  it('marks a notification as read', () => {
    useUIStore.getState().addNotification({
      title: 'New Order',
      message: 'Test',
      type: 'info',
    });

    const id = useUIStore.getState().notifications[0].id;
    useUIStore.getState().markNotificationRead(id);

    expect(useUIStore.getState().notifications[0].read).toBe(true);
    expect(useUIStore.getState().unreadCount()).toBe(0);
  });

  it('marks all notifications as read', () => {
    useUIStore.getState().addNotification({ title: 'A', message: '1', type: 'info' });
    useUIStore.getState().addNotification({ title: 'B', message: '2', type: 'warning' });

    useUIStore.getState().markAllNotificationsRead();

    useUIStore.getState().notifications.forEach((n) => {
      expect(n.read).toBe(true);
    });
    expect(useUIStore.getState().unreadCount()).toBe(0);
  });

  it('clears all notifications', () => {
    useUIStore.getState().addNotification({ title: 'A', message: '1', type: 'info' });
    useUIStore.getState().addNotification({ title: 'B', message: '2', type: 'warning' });

    useUIStore.getState().clearNotifications();

    expect(useUIStore.getState().notifications).toHaveLength(0);
  });

  it('adds multiple notifications in order', () => {
    useUIStore.getState().addNotification({ title: 'First', message: '1', type: 'info' });
    useUIStore.getState().addNotification({ title: 'Second', message: '2', type: 'info' });

    const notifications = useUIStore.getState().notifications;
    expect(notifications[0].title).toBe('Second');
    expect(notifications[1].title).toBe('First');
  });
});

describe('Command Palette', () => {
  it('starts closed', () => {
    expect(useUIStore.getState().commandPaletteOpen).toBe(false);
  });

  it('opens and closes', () => {
    useUIStore.getState().setCommandPaletteOpen(true);
    expect(useUIStore.getState().commandPaletteOpen).toBe(true);

    useUIStore.getState().setCommandPaletteOpen(false);
    expect(useUIStore.getState().commandPaletteOpen).toBe(false);
  });
});
