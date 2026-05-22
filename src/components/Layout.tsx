import { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useQueryClient } from '@tanstack/react-query';
import echo from '../utils/echo';
import Sidebar from './Sidebar';
import NotificationPanel from './NotificationPanel';
import { Bell, Sun, Moon, Menu } from 'lucide-react';

export default function Layout() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const { addEvent, events } = useNotificationStore();
  const queryClient = useQueryClient();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Check auth state on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle unauthorized event redirect
  useEffect(() => {
    const handleUnauthorized = () => {
      window.location.href = '/login';
    };
    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, []);

  // Sync theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Register real-time WebSockets listeners
  useEffect(() => {
    if (!isAuthenticated) return;

    console.log('Connecting to WebSocket channels...');

    const pegawaiChannel = echo.channel('pegawai')
      .listen('.KaryawanChanged', (e: any) => {
        console.log('Echo event KaryawanChanged received:', e);
        addEvent('karyawan', e.action || 'Updated', e);
        queryClient.invalidateQueries();
      });

    const rekrutmenChannel = echo.channel('rekrutmen')
      .listen('.LamaranChanged', (e: any) => {
        console.log('Echo event LamaranChanged received:', e);
        addEvent('lamaran', e.action || 'Updated', e);
        queryClient.invalidateQueries();
      })
      .listen('.PosisiChanged', (e: any) => {
        console.log('Echo event PosisiChanged received:', e);
        addEvent('posisi', e.action || 'Updated', e);
        queryClient.invalidateQueries();
      });

    return () => {
      console.log('Disconnecting WebSocket channels...');
      pegawaiChannel.stopListening('.KaryawanChanged');
      rekrutmenChannel.stopListening('.LamaranChanged');
      rekrutmenChannel.stopListening('.PosisiChanged');
    };
  }, [isAuthenticated, addEvent, queryClient]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-dark-bg transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard Analytics';
      case '/pegawai':
        return 'Pegawai Management';
      case '/rekrutmen':
        return 'Rekrutmen Hub';
      default:
        return 'OneData SPA';
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-dark-bg text-zinc-800 dark:text-zinc-200 transition-colors duration-300">
      {/* Sidebar navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 px-4 sm:px-8 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between sticky top-0 bg-white/70 dark:bg-dark-bg/70 backdrop-blur-md z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all lg:hidden cursor-pointer"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold tracking-tight text-zinc-800 dark:text-zinc-100 truncate">
              {getPageTitle()}
            </h2>
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notification Drawer Toggle */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="p-2 relative text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all cursor-pointer"
              title="Open Realtime Feed"
            >
              <Bell className="w-5 h-5" />
              {events.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-rose-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center ring-2 ring-white dark:ring-dark-bg animate-bounce">
                  {events.length}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Slide-out notification panel */}
      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
}
