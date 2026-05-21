import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import echo from '../utils/echo';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  LogOut, 
  User as UserIcon,
  Wifi, 
  WifiOff 
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [wsState, setWsState] = useState<string>('disconnected');

  useEffect(() => {
    const pusherInstance = echo.connector.pusher;
    if (pusherInstance) {
      setWsState(pusherInstance.connection.state);
      
      const handleStateChange = (states: { current: string }) => {
        setWsState(states.current);
      };

      pusherInstance.connection.bind('state_change', handleStateChange);
      
      return () => {
        pusherInstance.connection.unbind('state_change', handleStateChange);
      };
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getStatusColor = () => {
    switch (wsState) {
      case 'connected':
        return 'bg-emerald-500 shadow-emerald-500/50';
      case 'connecting':
        return 'bg-amber-500 shadow-amber-500/50';
      default:
        return 'bg-rose-500 shadow-rose-500/50';
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Pegawai', path: '/pegawai', icon: Users },
    { name: 'Rekrutmen', path: '/rekrutmen', icon: Briefcase },
  ];

  return (
    <aside className="w-64 glass border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-screen sticky top-0 shrink-0 z-30 transition-colors duration-300">
      {/* Brand Header */}
      <div className="p-6 border-b border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-2">
        <h1 className="text-xl font-bold bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent tracking-tight dark:from-brand-400 dark:to-indigo-400">
          OneData SPA
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="relative flex h-2 w-2">
            {wsState === 'connected' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            {wsState === 'connecting' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${getStatusColor()}`}></span>
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium capitalize flex items-center gap-1">
            {wsState === 'connected' ? <Wifi className="w-3 h-3 text-emerald-500" /> : <WifiOff className="w-3 h-3" />}
            Reverb: {wsState}
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25 glow-primary'
                  : 'text-zinc-600 hover:text-brand-600 dark:text-zinc-400 dark:hover:text-brand-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
              }`
            }
          >
            <item.icon className="w-5 h-5 transition-transform group-hover:scale-105" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30">
        <div className="flex items-center gap-3 p-2 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-400 border border-brand-200/50 dark:border-brand-800/50 overflow-hidden">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">
              {user?.name || 'User Account'}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {user?.nik || user?.role || user?.email || 'Pegawai'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:text-white hover:bg-rose-600 dark:hover:bg-rose-500/90 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
