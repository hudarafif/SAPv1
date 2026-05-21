import { create } from 'zustand';

export interface RealtimeEvent {
  id: string;
  time: string;
  type: 'karyawan' | 'lamaran' | 'posisi';
  action: string;
  message: string;
  data: any;
}

interface NotificationState {
  events: RealtimeEvent[];
  addEvent: (type: 'karyawan' | 'lamaran' | 'posisi', action: string, data: any) => void;
  clearEvents: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  events: [],
  addEvent: (type, action, data) => set((state) => {
    let message = '';
    if (type === 'karyawan') {
      const name = data?.nama || data?.karyawanData?.nama || 'Pegawai';
      message = `Pegawai [${name}] was ${action.toLowerCase()}`;
    } else if (type === 'lamaran') {
      const name = data?.nama || data?.lamaranData?.nama || 'Pelamar';
      const status = data?.status_akhir || data?.lamaranData?.status_akhir || 'Updated';
      const position = data?.posisi || data?.lamaranData?.posisi || 'Posisi';
      message = `Pelamar [${name}] status changed to "${status}" for positions [${position}] (${action})`;
    } else if (type === 'posisi') {
      const posName = data?.nama_posisi || data?.posisiData?.nama_posisi || 'Lowongan';
      const status = data?.status || data?.posisiData?.status || 'Aktif';
      message = `Posisi lowongan [${posName}] status updated to "${status}" (${action})`;
    }

    const newEvent: RealtimeEvent = {
      id: Math.random().toString(36).substring(7),
      time: new Date().toLocaleTimeString(),
      type,
      action,
      message,
      data,
    };

    return { events: [newEvent, ...state.events].slice(0, 50) };
  }),
  clearEvents: () => set({ events: [] }),
}));
