import { useNotificationStore } from '../stores/notificationStore';
import { Bell, Trash2, Calendar, User, Briefcase, FileSpreadsheet } from 'lucide-react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { events, clearEvents } = useNotificationStore();

  if (!isOpen) return null;

  const getEventIcon = (type: 'karyawan' | 'lamaran' | 'posisi') => {
    switch (type) {
      case 'karyawan':
        return <User className="w-4 h-4 text-sky-500" />;
      case 'lamaran':
        return <FileSpreadsheet className="w-4 h-4 text-purple-500" />;
      case 'posisi':
        return <Briefcase className="w-4 h-4 text-amber-500" />;
    }
  };

  const getEventColor = (type: 'karyawan' | 'lamaran' | 'posisi') => {
    switch (type) {
      case 'karyawan':
        return 'bg-sky-500/10 text-sky-500 border border-sky-500/20';
      case 'lamaran':
        return 'bg-purple-500/10 text-purple-500 border border-purple-500/20';
      case 'posisi':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-80 max-w-xs glass-premium border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 flex flex-col transition-all duration-300 animate-slide-in">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            {events.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-500 rounded-full animate-pulse"></span>
            )}
          </div>
          <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
            Real-time Feed
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {events.length > 0 && (
            <button
              onClick={clearEvents}
              className="p-1.5 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
              title="Clear all events"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <Bell className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-2 stroke-[1.5]" />
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              No realtime events yet
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
              Mutations on the Laravel server will appear here instantly.
            </p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="p-3 bg-white/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl flex gap-3 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className={`p-2 rounded-lg shrink-0 h-fit ${getEventColor(event.type)}`}>
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-1">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/30 dark:border-zinc-700/30">
                    {event.type}
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1 font-medium">
                    <Calendar className="w-2.5 h-2.5" />
                    {event.time}
                  </span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1.5 leading-relaxed font-medium">
                  {event.message}
                </p>
                <div className="mt-2 text-[10px] font-mono bg-zinc-50 dark:bg-zinc-950/50 p-1.5 rounded border border-zinc-100 dark:border-zinc-900 overflow-x-auto text-zinc-500 dark:text-zinc-400 max-h-24">
                  {JSON.stringify(event.data, null, 2)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
