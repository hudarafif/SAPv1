export interface User {
  id: number;
  name: string;
  email: string;
  nik?: string;
  role?: string;
  avatar_url?: string;
}

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface Pegawai {
  id: number;
  nik: string;
  nama: string;
  gender: string;
  email: string;
  no_hp: string;
  status_karyawan: string;
  lokasi_kerja: string;
  level_id: number;
  division_id: number;
  company_id: number;
  division_name?: string;
  company_name?: string;
  job_history?: Array<{
    id: number;
    company: string;
    position: string;
    start_date: string;
    end_date: string;
  }>;
  family?: Array<{
    id: number;
    name: string;
    relationship: string;
    gender: string;
  }>;
  bpjs?: {
    id: number;
    no_bpjs_kesehatan: string;
    no_bpjs_ketenagakerjaan: string;
  };
  kpi?: Array<{
    id: number;
    period: string;
    score: number;
    grade: string;
  }>;
  competency?: Array<{
    id: number;
    skill_name: string;
    proficiency_level: string;
  }>;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface PegawaiStats {
  total_karyawan: number;
  gender_distribution: Array<{ gender: string; count: number }>;
  age_distribution: { [key: string]: number };
  company_distribution: Array<{ company: string; count: number }>;
}

export interface PosisiJob {
  id: number;
  nama_posisi: string;
  departemen: string;
  status: 'Aktif' | 'Nonaktif';
  jumlah_pelamar?: number;
  created_at?: string;
}

export interface Pelamar {
  id: string; // Composite ID "id_akun-id_posisi"
  id_akun: number;
  id_posisi: number;
  nama: string;
  email: string;
  telepon: string;
  posisi: string;
  status_akhir: 'Pelamar Baru' | 'CV Lolos' | 'Interview HR Lolos' | 'Interview User Lolos' | 'Pemberkasan' | 'Diterima' | 'Tidak Lolos';
  catatan_hr?: string;
  tanggal_melamar: string;
  cv_url?: string;
  psikotes_result?: {
    score: number;
    grade: string;
    summary?: string;
  };
}
