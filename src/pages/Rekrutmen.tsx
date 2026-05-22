import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/axios';
import type { PosisiJob, Pelamar, Pagination as PaginationType } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Briefcase, 
  UserCheck, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Mail, 
  Phone, 
  Calendar,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  FileText
} from 'lucide-react';

export default function RekrutmenPage() {
  const [activeTab, setActiveTab] = useState<'positions' | 'applicants'>('applicants');
  
  // States for positions module
  const [posSearch, setPosSearch] = useState('');
  const [posStatus, setPosStatus] = useState('');

  // States for applicants module
  const [appSearch, setAppSearch] = useState('');
  const [appStatus, setAppStatus] = useState('');
  const [appPosition, setAppPosition] = useState('');
  const [appPage, setAppPage] = useState(1);
  const [appPerPage] = useState(8);
  const [selectedPelamarId, setSelectedPelamarId] = useState<string | null>(null);

  // Fetch Positions
  const { data: positionsData, isLoading: isLoadingPos } = useQuery<PosisiJob[]>({
    queryKey: ['positions', posSearch, posStatus],
    queryFn: async () => {
      const response = await api.get('/api/spa/rekrutmen/posisi', {
        params: {
          search: posSearch || undefined,
          status: posStatus || undefined
        }
      });
      return response.data.data;
    }
  });

  // Fetch Applicants
  const { data: applicantsData, isLoading: isLoadingApp } = useQuery<{
    data: Pelamar[];
    pagination: PaginationType;
  }>({
    queryKey: ['applicants', appPage, appSearch, appStatus, appPosition],
    queryFn: async () => {
      const response = await api.get('/api/spa/rekrutmen/pelamar', {
        params: {
          page: appPage,
          per_page: appPerPage,
          search: appSearch || undefined,
          status_akhir: appStatus || undefined,
          posisi_id: appPosition || undefined
        }
      });
      return response.data;
    }
  });

  // Fetch Applicant detail
  const { data: applicantDetail, isLoading: isLoadingAppDetail } = useQuery<Pelamar>({
    queryKey: ['applicantDetail', selectedPelamarId],
    queryFn: async () => {
      const response = await api.get(`/api/spa/rekrutmen/pelamar/${selectedPelamarId}`);
      return response.data.data;
    },
    enabled: selectedPelamarId !== null
  });



  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-2 overflow-x-auto whitespace-nowrap scrollbar-thin">
        <button
          onClick={() => setActiveTab('applicants')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 shrink-0 cursor-pointer transition-all ${
            activeTab === 'applicants'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          <UserCheck className="w-5 h-5" />
          Kandidat & Pipeline Pelamar
        </button>
        <button
          onClick={() => setActiveTab('positions')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 shrink-0 cursor-pointer transition-all ${
            activeTab === 'positions'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          Posisi Pekerjaan ({positionsData?.length || 0})
        </button>
      </div>

      {/* POSITIONS MODULE */}
      {activeTab === 'positions' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="p-4 rounded-2xl glass border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={posSearch}
                onChange={(e) => setPosSearch(e.target.value)}
                placeholder="Cari nama posisi lowongan..."
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-brand-500 rounded-xl py-2 pl-10 pr-4 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none"
              />
            </div>
            <select
              value={posStatus}
              onChange={(e) => setPosStatus(e.target.value)}
              className="w-full md:w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-brand-500 rounded-xl py-2 px-3 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>

          {/* Grid Layout */}
          {isLoadingPos ? (
            <LoadingSpinner message="Mengambil daftar posisi..." />
          ) : !positionsData || positionsData.length === 0 ? (
            <div className="p-12 text-center text-zinc-500">Tidak ada posisi pekerjaan ditemukan.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {positionsData.map((pos) => (
                <div 
                  key={pos.id}
                  className="p-5 rounded-2xl glass-premium border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col justify-between hover:shadow-lg transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-12 h-12 bg-brand-500/5 rounded-full blur-lg group-hover:scale-150 transition-transform"></div>
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        pos.status === 'Aktif'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                      }`}>
                        {pos.status}
                      </span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                        ID: {pos.id}
                      </span>
                    </div>
                    <h4 className="font-bold text-zinc-800 dark:text-zinc-100 text-base mt-2.5 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {pos.nama_posisi}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{pos.departemen}</p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-zinc-200/30 dark:border-zinc-800/30 flex justify-between items-center text-xs">
                    <span className="text-zinc-400 dark:text-zinc-500 font-medium">Kandidat Terdaftar</span>
                    <span className="font-extrabold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-lg border border-brand-500/15 text-sm">
                      {pos.jumlah_pelamar || 0} orang
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* APPLICANTS MODULE */}
      {activeTab === 'applicants' && (
        <div className="space-y-6">
          {/* Filters Card */}
          <div className="p-4 rounded-2xl glass-premium border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={appSearch}
                onChange={(e) => { setAppSearch(e.target.value); setAppPage(1); }}
                placeholder="Cari nama pelamar..."
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-brand-500 rounded-xl py-2 pl-10 pr-4 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none"
              />
            </div>
            
            <select
              value={appStatus}
              onChange={(e) => { setAppStatus(e.target.value); setAppPage(1); }}
              className="w-full md:w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-brand-500 rounded-xl py-2 px-3 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="">Semua Status</option>
              <option value="Pelamar Baru">Pelamar Baru</option>
              <option value="CV Lolos">CV Lolos</option>
              <option value="Interview HR Lolos">Interview HR Lolos</option>
              <option value="Interview User Lolos">Interview User Lolos</option>
              <option value="Pemberkasan">Pemberkasan</option>
              <option value="Diterima">Diterima</option>
              <option value="Tidak Lolos">Tidak Lolos</option>
            </select>

            <select
              value={appPosition}
              onChange={(e) => { setAppPosition(e.target.value); setAppPage(1); }}
              className="w-full md:w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-brand-500 rounded-xl py-2 px-3 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="">Semua Posisi</option>
              {positionsData?.map((pos) => (
                <option key={pos.id} value={pos.id}>
                  {pos.nama_posisi}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          {isLoadingApp ? (
            <LoadingSpinner message="Mengambil daftar pelamar..." />
          ) : !applicantsData || applicantsData.data.length === 0 ? (
            <div className="p-12 text-center text-zinc-500">Tidak ada kandidat pelamar ditemukan.</div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 glass bg-white/40 dark:bg-zinc-900/20 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-950/30 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      <th className="py-4 px-6">Pelamar</th>
                      <th className="py-4 px-6">Posisi Lamaran</th>
                      <th className="py-4 px-6">Tanggal Daftar</th>
                      <th className="py-4 px-6">Status Pipeline</th>
                      <th className="py-4 px-6 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/30 dark:divide-zinc-800/30 text-sm">
                    {applicantsData.data.map((app) => (
                      <tr key={app.id} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-800/35 transition-colors">
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-semibold text-zinc-800 dark:text-zinc-200">{app.nama}</p>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{app.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-zinc-700 dark:text-zinc-300">
                          {app.posisi}
                        </td>
                        <td className="py-4 px-6">
                          <span className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                            {app.tanggal_melamar}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(app.status_akhir)}`}>
                            {app.status_akhir}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedPelamarId(app.id)}
                            className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {applicantsData.pagination && (
                <div className="py-4 px-6 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-950/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  <p>
                    Menampilkan <span className="font-semibold text-zinc-800 dark:text-zinc-200">{applicantsData.pagination.from}</span> sampai{' '}
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{applicantsData.pagination.to}</span> dari{' '}
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{applicantsData.pagination.total}</span> pelamar
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={appPage <= 1}
                      onClick={() => setAppPage(p => Math.max(1, p - 1))}
                      className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1.5 bg-brand-500 text-white rounded-lg font-semibold">
                      {appPage}
                    </span>
                    <button
                      disabled={appPage >= (applicantsData.pagination.last_page || 1)}
                      onClick={() => setAppPage(p => p + 1)}
                      className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Applicant Detail Modal */}
      {selectedPelamarId !== null && (
        <ApplicantDetailModal
          isOpen={selectedPelamarId !== null}
          onClose={() => setSelectedPelamarId(null)}
          applicant={applicantDetail}
          isLoading={isLoadingAppDetail}
        />
      )}
    </div>
  );
}

// Applicant Detail Modal local definition
interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant?: Pelamar;
  isLoading: boolean;
}

function ApplicantDetailModal({ onClose, applicant, isLoading }: AppModalProps) {
  const getStatusIcon = (st: string) => {
    switch (st) {
      case 'Diterima':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'Tidak Lolos':
        return <XCircle className="w-5 h-5 text-rose-500" />;
      default:
        return <Clock className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"></div>

      <div className="relative glass-premium border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-zinc-950/90 flex flex-col max-h-[85vh] animate-scale-up">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
              Detail Kandidat Pelamar
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Detail resume dan status tahapan rekrutmen pelamar
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {isLoading ? (
          <div className="p-12">
            <LoadingSpinner message="Mengambil berkas pelamar..." />
          </div>
        ) : !applicant ? (
          <div className="p-8 text-center text-sm text-zinc-500">Berkas pelamar tidak ditemukan.</div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Applicant Bio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-zinc-200/40 dark:border-zinc-800/40 pb-5">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Nama Pelamar</span>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mt-1">{applicant.nama}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Melamar Posisi</span>
                <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 mt-1">{applicant.posisi}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Email</span>
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 mt-1">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  {applicant.email}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Telepon</span>
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 mt-1">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" />
                  {applicant.telepon}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Tanggal Melamar</span>
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  {applicant.tanggal_melamar}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500">CV Pelamar</span>
                <p className="text-xs font-medium mt-1">
                  <a
                    href={applicant.cv_url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 font-bold"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Unduh / Lihat CV
                  </a>
                </p>
              </div>
            </div>

            {/* Psychometric Results */}
            {applicant.psikotes_result && (
              <div className="p-4 rounded-xl bg-brand-50/20 dark:bg-brand-950/10 border border-brand-500/10">
                <h4 className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-2 mb-2 uppercase tracking-wider">
                  <FileSpreadsheet className="w-4 h-4" />
                  Hasil Tes Psikometrik (OneData AI)
                </h4>
                <div className="flex items-center justify-between gap-4 border-b border-brand-500/5 pb-3">
                  <div>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">Skor Total</span>
                    <p className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-0.5">
                      {applicant.psikotes_result.score} / 100
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">Predikat Kelulusan</span>
                    <p className="text-base font-extrabold text-zinc-800 dark:text-zinc-200 mt-0.5 uppercase">
                      Grade {applicant.psikotes_result.grade}
                    </p>
                  </div>
                </div>
                {applicant.psikotes_result.summary && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Rekomendasi Sistem:</span>{' '}
                    {applicant.psikotes_result.summary}
                  </p>
                )}
              </div>
            )}

            {/* Pipeline Status (Read Only) */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                {getStatusIcon(applicant.status_akhir)}
                Tahapan Pipeline Pelamar
              </h4>
              
              <div className="space-y-3 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200/30 dark:border-zinc-800/30">
                <div>
                  <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Status Saat Ini
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(applicant.status_akhir)}`}>
                    {applicant.status_akhir}
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Catatan Review HRD
                  </span>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/50 rounded-xl p-3 leading-relaxed whitespace-pre-line">
                    {applicant.catatan_hr || 'Tidak ada catatan review.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs font-semibold cursor-pointer transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Pelamar Baru':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    case 'CV Lolos':
      return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
    case 'Interview HR Lolos':
    case 'Interview User Lolos':
      return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
    case 'Pemberkasan':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    case 'Diterima':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    case 'Tidak Lolos':
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    default:
      return 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20';
  }
};
