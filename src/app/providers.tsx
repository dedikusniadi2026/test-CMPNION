import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { Toaster } from 'sonner';
import { Navigate } from 'react-router-dom';
import { Layout } from '../layouts/layout';
import { DashboardPage } from '../pages/dashboard';
import { OrdersPage } from '../pages/orders';
import { useUIStore } from '../store';
import { CommandPalette } from '../components/common/command-palette';
import { useRealtimeOrders } from '../hooks/useRealtimeOrders';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { theme, setTheme } = useUIStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme, setTheme]);

  useRealtimeOrders();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <CommandPalette />
    </BrowserRouter>
  );
}

export function Providers() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
          },
        }}
      />
    </QueryClientProvider>
  );
}
