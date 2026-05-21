import { useQuery } from '@tanstack/react-query';
import api from '../utils/axios';
import type { PegawaiStats } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNotificationStore } from '../stores/notificationStore';
import { 
  Users, 
  Activity, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  Layers 
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  Legend
} from 'recharts';

export default function Dashboard() {
  const { events } = useNotificationStore();

  const { data: stats, isLoading, error } = useQuery<PegawaiStats>({
    queryKey: ['pegawaiStats'],
    queryFn: async () => {
      const response = await api.get('/api/spa/pegawai/stats');
      return response.data.data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner message="Mengambil data statistik pegawai..." />;
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-start gap-4">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold">Gagal memuat statistik</h3>
          <p className="text-sm mt-1">
            Gagal mengambil data dari API backend. Pastikan server Laravel Anda berjalan dan modul Pegawai aktif.
          </p>
        </div>
      </div>
    );
  }

  // Parse Gender Distribution
  const genderData = stats?.gender_distribution?.map((item: any) => ({
    name: item.gender === 'L' || item.gender === 'Laki-laki' ? 'Laki-laki' : 'Perempuan',
    value: parseInt(item.count || item.total || '0', 10),
  })) || [];

  // Parse Age Distribution
  const ageData = stats?.age_distribution
    ? Object.entries(stats.age_distribution).map(([range, count]) => ({
        name: range,
        karyawan: count,
      }))
    : [];

  // Parse Company Distribution
  const companyData = stats?.company_distribution?.map((item: any) => ({
    name: item.company || item.company_name || 'Perusahaan',
    value: parseInt(item.count || item.total || '0', 10),
  })) || [];

  // Recharts Premium Color Palettes
  const GENDER_COLORS = ['#8b5cf6', '#ec4899'];
  const COMPANY_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  const recentEvent = events[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Real-time WebSockets Alert Banner */}
      {recentEvent && (
        <div className="relative overflow-hidden p-4 rounded-2xl bg-brand-500/10 border border-brand-500/25 flex items-center justify-between gap-4 animate-slide-down">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-brand-500/5 rounded-full blur-xl"></div>
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-3 w-3 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
            </span>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider block">
                Live Broadcast Event
              </span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium truncate mt-0.5">
                {recentEvent.message}
              </p>
            </div>
          </div>
          <span className="text-[10px] text-zinc-500 shrink-0 font-semibold bg-zinc-200/50 dark:bg-zinc-800 px-2 py-1 rounded">
            {recentEvent.time}
          </span>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Employees */}
        <div className="relative overflow-hidden p-6 rounded-2xl glass-premium border border-zinc-200/50 dark:border-zinc-800/50 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-brand-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Total Karyawan Aktif
              </p>
              <h3 className="text-4xl font-extrabold text-zinc-800 dark:text-zinc-100 tracking-tight mt-2 animate-pulse-light">
                {stats?.total_karyawan ?? 0}
              </h3>
            </div>
            <div className="p-3 bg-brand-500/10 text-brand-500 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            Terintegrasi Real-time via Laravel Echo
          </div>
        </div>

        {/* Card 2: WebSockets Feed Status */}
        <div className="relative overflow-hidden p-6 rounded-2xl glass-premium border border-zinc-200/50 dark:border-zinc-800/50 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Broadcast Terproses
              </p>
              <h3 className="text-4xl font-extrabold text-zinc-800 dark:text-zinc-100 tracking-tight mt-2">
                {events.length}
              </h3>
            </div>
            <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-2xl">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400 truncate">
            {recentEvent ? `Terakhir: ${recentEvent.type} (${recentEvent.action})` : 'Menunggu perubahan data server...'}
          </p>
        </div>

        {/* Card 3: Realtime Status */}
        <div className="relative overflow-hidden p-6 rounded-2xl glass-premium border border-zinc-200/50 dark:border-zinc-800/50 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-purple-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Sinkronisasi Modul
              </p>
              <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mt-3 flex items-center gap-1.5">
                <UserCheck className="w-5 h-5 text-purple-500" />
                Sanctum
              </h3>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400">
            Sesi terautentikasi dan token aman
          </p>
        </div>
      </div>

      {/* Visual Analytics Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart: Gender Distribution */}
        <div className="p-6 rounded-2xl glass-premium border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col h-[380px]">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-500" />
            Distribusi Gender
          </h3>
          <div className="flex-1 min-h-0">
            {genderData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-zinc-500">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genderData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(9, 9, 11, 0.9)', 
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Bar Chart: Age Distribution */}
        <div className="p-6 rounded-2xl glass-premium border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col h-[380px] lg:col-span-2">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            Distribusi Usia Karyawan
          </h3>
          <div className="flex-1 min-h-0">
            {ageData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-zinc-500">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorKaryawan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.1)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(128, 128, 128, 0.5)" 
                    fontSize={11} 
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="rgba(128, 128, 128, 0.5)" 
                    fontSize={11} 
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'rgba(9, 9, 11, 0.9)', 
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="karyawan" 
                    name="Karyawan"
                    stroke="#6366f1" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorKaryawan)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Company Distribution & Console Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Distribution */}
        <div className="p-6 rounded-2xl glass-premium border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col h-[350px] lg:col-span-2">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500" />
            Distribusi Perusahaan (Entitas)
          </h3>
          <div className="flex-1 min-h-0">
            {companyData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-zinc-500">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companyData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(128, 128, 128, 0.1)" />
                  <XAxis type="number" stroke="rgba(128, 128, 128, 0.5)" fontSize={11} tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="rgba(128, 128, 128, 0.5)" fontSize={11} width={80} tickLine={false} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'rgba(9, 9, 11, 0.9)', 
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="value" name="Karyawan" radius={[0, 4, 4, 0]}>
                    {companyData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COMPANY_COLORS[index % COMPANY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Real-time Mini Terminal Console Logs */}
        <div className="p-6 rounded-2xl glass-premium border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col h-[350px]">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
              Live Events Stream
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">WebSockets Console</span>
          </h3>
          <div className="flex-1 bg-zinc-950 dark:bg-black/80 rounded-xl p-4 font-mono text-[10px] text-zinc-400 overflow-y-auto space-y-3.5 border border-zinc-900/50 select-none">
            {events.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-600 text-center select-none p-4">
                Listening for real-time notifications from Laravel Reverb host...
              </div>
            ) : (
              events.slice(0, 8).map((evt) => (
                <div key={evt.id} className="border-b border-zinc-900 pb-2">
                  <div className="flex justify-between text-zinc-500 text-[9px] mb-1">
                    <span className="text-brand-400 font-semibold">{evt.type.toUpperCase()}</span>
                    <span>{evt.time}</span>
                  </div>
                  <p className="text-zinc-200 font-medium leading-relaxed">{evt.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
