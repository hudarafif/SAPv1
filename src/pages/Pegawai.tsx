import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/axios';
import type { Pegawai, Pagination as PaginationType } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Eye, 
  User, 
  Briefcase, 
  Users as FamilyIcon, 
  ShieldCheck, 
  Award, 
  TrendingUp,
  MapPin,
  Mail,
  Phone,
  Users
} from 'lucide-react';

export default function PegawaiPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [filterLocation, setFilterLocation] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedPegawaiId, setSelectedPegawaiId] = useState<number | null>(null);

  // Fetch list of Pegawai
  const { data: pegawaiData, isLoading, error } = useQuery<{
    data: Pegawai[];
    pagination: PaginationType;
  }>({
    queryKey: ['pegawai', page, search, filterLocation, filterStatus],
    queryFn: async () => {
      const response = await api.get('/api/spa/pegawai', {
        params: {
          page,
          per_page: perPage,
          search: search || undefined,
          lokasi_kerja: filterLocation || undefined,
          status_karyawan: filterStatus || undefined,
        },
      });
      return response.data;
    },
  });

  // Fetch detail of selected Pegawai
  const { data: pegawaiDetail, isLoading: isLoadingDetail } = useQuery<Pegawai>({
    queryKey: ['pegawaiDetail', selectedPegawaiId],
    queryFn: async () => {
      const response = await api.get(`/api/spa/pegawai/${selectedPegawaiId}`);
      return response.data.data;
    },
    enabled: selectedPegawaiId !== null,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterLocation(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setFilterLocation('');
    setFilterStatus('');
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Daftar karyawan aktif perusahaan beserta pencarian detail terintegrasi
          </p>
        </div>
      </div>

      {/* Filters Card */}
      <div className="p-5 rounded-2xl glass-premium border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Cari berdasarkan nama atau NIK..."
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-brand-500 rounded-xl py-2 pl-10 pr-4 text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none transition-all"
          />
        </div>

        {/* Location Filter */}
        <div className="relative w-full md:w-48">
          <select
            value={filterLocation}
            onChange={handleLocationChange}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-brand-500 rounded-xl py-2 px-3 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="">Semua Lokasi</option>
            <option value="Head Office">Head Office</option>
            <option value="Bandung Office">Bandung Office</option>
            <option value="Jakarta Office">Jakarta Office</option>
            <option value="Surabaya Office">Surabaya Office</option>
            <option value="Remote">Remote</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-400">
            <Filter className="w-4 h-4" />
          </div>
        </div>

        {/* Status Filter */}
        <div className="relative w-full md:w-48">
          <select
            value={filterStatus}
            onChange={handleStatusChange}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-brand-500 rounded-xl py-2 px-3 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="Tetap">Karyawan Tetap</option>
            <option value="Kontrak">Karyawan Kontrak</option>
            <option value="Magang">Magang (Intern)</option>
            <option value="Probation">Probation</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-400">
            <Filter className="w-4 h-4" />
          </div>
        </div>

        {/* Reset button */}
        {(search || filterLocation || filterStatus) && (
          <button
            onClick={clearFilters}
            className="text-xs font-semibold px-4 py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-xl transition-all cursor-pointer whitespace-nowrap"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Employee List Table */}
      {isLoading ? (
        <LoadingSpinner message="Mengambil daftar pegawai..." />
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
          Gagal mengambil data pegawai.
        </div>
      ) : pegawaiData?.data?.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/30 dark:bg-zinc-900/10">
          <Users className="w-10 h-10 text-zinc-400 mx-auto stroke-[1.5] mb-2" />
          <p className="font-semibold text-zinc-600 dark:text-zinc-400">Tidak ada pegawai ditemukan</p>
          <p className="text-xs text-zinc-500 mt-1">Coba gunakan kata kunci pencarian atau filter yang berbeda.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 glass bg-white/40 dark:bg-zinc-900/20 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-950/30 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Karyawan</th>
                  <th className="py-4 px-6">NIK</th>
                  <th className="py-4 px-6">Divisi & Perusahaan</th>
                  <th className="py-4 px-6">Lokasi</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/30 dark:divide-zinc-800/30 text-sm">
                {pegawaiData?.data?.map((p) => (
                  <tr 
                    key={p.id} 
                    className="hover:bg-zinc-100/50 dark:hover:bg-zinc-800/35 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs uppercase">
                          {p.nama.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-800 dark:text-zinc-200 leading-snug">{p.nama}</p>
                          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-zinc-500 dark:text-zinc-400 font-mono text-xs">{p.nik}</td>
                    <td className="py-4 px-6">
                      <p className="text-zinc-700 dark:text-zinc-300 font-medium">{p.division_name || 'Divisi -'}</p>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">{p.company_name || 'Perusahaan'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        {p.lokasi_kerja}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        p.status_karyawan === 'Tetap'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                      }`}>
                        {p.status_karyawan}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedPegawaiId(p.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-100 hover:bg-brand-600 dark:bg-zinc-800 dark:hover:bg-brand-600 text-zinc-700 hover:text-white dark:text-zinc-300 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination bar */}
          {pegawaiData?.pagination && (
            <div className="py-4 px-6 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-950/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <p>
                Menampilkan <span className="font-semibold text-zinc-800 dark:text-zinc-200">{pegawaiData.pagination.from}</span> sampai{' '}
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{pegawaiData.pagination.to}</span> dari{' '}
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{pegawaiData.pagination.total}</span> data
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1.5 bg-brand-500 text-white rounded-lg font-semibold">
                  {page}
                </span>
                <button
                  disabled={page >= (pegawaiData.pagination.last_page || 1)}
                  onClick={() => setPage(p => p + 1)}
                  className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Employee Detail Modal */}
      {selectedPegawaiId !== null && (
        <DetailPegawaiModal 
          isOpen={selectedPegawaiId !== null} 
          onClose={() => setSelectedPegawaiId(null)} 
          pegawai={pegawaiDetail}
          isLoading={isLoadingDetail}
        />
      )}
    </div>
  );
}

// Modal Component defined locally for convenience
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  pegawai?: Pegawai;
  isLoading: boolean;
}

function DetailPegawaiModal({ onClose, pegawai, isLoading }: ModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'kpi'>('profile');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Modal Card */}
      <div className="relative glass-premium border border-zinc-200 dark:border-zinc-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-zinc-950/90 flex flex-col max-h-[85vh] animate-scale-up">
        {/* Modal Header */}
        <div className="p-6 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-lg border border-brand-500/20">
              {isLoading ? '...' : pegawai?.nama.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-800 dark:text-zinc-100">
                {isLoading ? 'Memuat Detail...' : pegawai?.nama}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {isLoading ? 'Sedang sinkronisasi data dari server' : `NIK: ${pegawai?.nik}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading / Content */}
        {isLoading ? (
          <div className="p-12">
            <LoadingSpinner message="Menghubungkan ke API detail pegawai..." />
          </div>
        ) : !pegawai ? (
          <div className="p-8 text-center text-sm text-zinc-500">Data detail tidak ditemukan.</div>
        ) : (
          <>
            {/* Tabs */}
            <div className="px-6 bg-zinc-50/50 dark:bg-zinc-950/40 border-b border-zinc-200/50 dark:border-zinc-800/50 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-thin">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-3 px-3 text-xs font-semibold tracking-wider uppercase border-b-2 flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
                  activeTab === 'profile'
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                <User className="w-4 h-4" />
                Profil & BPJS
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-3 px-3 text-xs font-semibold tracking-wider uppercase border-b-2 flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
                  activeTab === 'history'
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Riwayat & Skill
              </button>
              <button
                onClick={() => setActiveTab('kpi')}
                className={`py-3 px-3 text-xs font-semibold tracking-wider uppercase border-b-2 flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
                  activeTab === 'kpi'
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                <Award className="w-4 h-4" />
                KPI & Keluarga
              </button>
            </div>

            {/* Modal Body scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Tab 1: Profile & BPJS */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* General Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">Email</span>
                      <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 mt-1">
                        <Mail className="w-3.5 h-3.5 text-zinc-400" />
                        {pegawai.email}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">Telepon</span>
                      <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 mt-1">
                        <Phone className="w-3.5 h-3.5 text-zinc-400" />
                        {pegawai.no_hp}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">Gender</span>
                      <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mt-1">
                        {pegawai.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">Lokasi Kerja</span>
                      <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mt-1">{pegawai.lokasi_kerja}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">Divisi</span>
                      <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mt-1">{pegawai.division_name || '-'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">Perusahaan</span>
                      <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mt-1">{pegawai.company_name || '-'}</p>
                    </div>
                  </div>

                  {/* BPJS Card */}
                  <div className="p-4 rounded-xl bg-brand-50/20 dark:bg-brand-950/10 border border-brand-500/10">
                    <h4 className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" />
                      Registrasi Jaminan Sosial (BPJS)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500">BPJS Kesehatan</span>
                        <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300 mt-1">
                          {pegawai.bpjs?.no_bpjs_kesehatan || 'Tidak Terdaftar'}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500">BPJS Ketenagakerjaan</span>
                        <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300 mt-1">
                          {pegawai.bpjs?.no_bpjs_ketenagakerjaan || 'Tidak Terdaftar'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Job History & Competence */}
              {activeTab === 'history' && (
                <div className="space-y-6">
                  {/* Job History */}
                  <div>
                    <h4 className="text-xs font-bold text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                      <Briefcase className="w-4 h-4 text-brand-500" />
                      Riwayat Pekerjaan
                    </h4>
                    {!pegawai.job_history || pegawai.job_history.length === 0 ? (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Tidak ada riwayat pekerjaan.</p>
                    ) : (
                      <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-2 space-y-4">
                        {pegawai.job_history.map((job) => (
                          <div key={job.id} className="relative pl-5">
                            <span className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-brand-500 border border-white dark:border-zinc-950"></span>
                            <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{job.position}</h5>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{job.company}</p>
                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                              {job.start_date} s/d {job.end_date}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Competencies */}
                  <div>
                    <h4 className="text-xs font-bold text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                      <Award className="w-4 h-4 text-brand-500" />
                      Kompetensi & Keahlian
                    </h4>
                    {!pegawai.competency || pegawai.competency.length === 0 ? (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Tidak ada kompetensi terdaftar.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {pegawai.competency.map((comp) => (
                          <span
                            key={comp.id}
                            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50"
                          >
                            {comp.skill_name} •{' '}
                            <span className="text-brand-600 dark:text-brand-400 font-bold">{comp.proficiency_level}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: KPI & Family */}
              {activeTab === 'kpi' && (
                <div className="space-y-6">
                  {/* KPI History */}
                  <div>
                    <h4 className="text-xs font-bold text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                      <TrendingUp className="w-4 h-4 text-brand-500" />
                      Penilaian Kinerja (KPI)
                    </h4>
                    {!pegawai.kpi || pegawai.kpi.length === 0 ? (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Tidak ada riwayat KPI.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {pegawai.kpi.map((k) => (
                          <div 
                            key={k.id} 
                            className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/30 dark:border-zinc-800/30 rounded-xl flex items-center justify-between"
                          >
                            <div>
                              <p className="text-[10px] text-zinc-400 font-bold uppercase">{k.period}</p>
                              <p className="text-base font-bold text-zinc-800 dark:text-zinc-100 mt-1">{k.score}</p>
                            </div>
                            <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-brand-500 text-white shadow-sm shadow-brand-500/20">
                              {k.grade}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Family Members */}
                  <div>
                    <h4 className="text-xs font-bold text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                      <FamilyIcon className="w-4 h-4 text-brand-500" />
                      Susunan Keluarga
                    </h4>
                    {!pegawai.family || pegawai.family.length === 0 ? (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Tidak ada susunan keluarga.</p>
                    ) : (
                      <div className="overflow-hidden rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/20 dark:bg-zinc-900/10">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-zinc-100/50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 font-bold uppercase">
                              <th className="py-2.5 px-4">Nama</th>
                              <th className="py-2.5 px-4">Hubungan</th>
                              <th className="py-2.5 px-4">Gender</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200/20 dark:divide-zinc-800/20 text-zinc-700 dark:text-zinc-300">
                            {pegawai.family.map((fam) => (
                              <tr key={fam.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                                <td className="py-2.5 px-4 font-semibold">{fam.name}</td>
                                <td className="py-2.5 px-4">{fam.relationship}</td>
                                <td className="py-2.5 px-4">
                                  {fam.gender === 'L' || fam.gender === 'Laki-laki' ? 'Laki-laki' : 'Perempuan'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
