import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import api from '../utils/axios';
import { Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Harap masukkan NIK/Email dan Password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/spa/login', {
        login: username,
        password: password,
      });

      if (response.data && response.data.success) {
        login(response.data.token, response.data.user);
        navigate(from, { replace: true });
      } else {
        setError(response.data.message || 'Login gagal. Hubungi administrator.');
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        'Tidak dapat terhubung ke server Laravel API. Pastikan Laravel berjalan di http://127.0.0.1:8000'
      );
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (usr: string, pass: string) => {
    setUsername(usr);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-tr from-zinc-950 via-zinc-900 to-brand-950 p-4 font-sans text-zinc-100">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-600/10 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Glow Panel */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        
        {/* Glass Box */}
        <div className="relative glass-premium border border-zinc-800 rounded-2xl p-8 bg-zinc-950/70 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
              OneData Portal
            </h1>
            <p className="text-zinc-400 text-sm mt-2">
              Single Page Application Client
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-start gap-3 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Email atau NIK Karyawan
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="name@company.com atau NIK"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-brand-500 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-brand-500 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-brand-600/20 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-brand-600/30"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Masuk Portal
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Presets */}
          <div className="mt-8 border-t border-zinc-800/80 pt-6">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Quick Login Presets (Local Sandbox)
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => applyPreset('superadmin@company.com', 'password')}
                className="bg-zinc-900 border border-zinc-800 hover:border-brand-500 hover:bg-brand-500/5 text-zinc-400 hover:text-zinc-200 rounded-lg p-2.5 text-left transition-all cursor-pointer"
              >
                <span className="block font-semibold">Superadmin Email</span>
                <span className="text-[10px] text-zinc-600">superadmin@... / password</span>
              </button>
              <button
                type="button"
                onClick={() => applyPreset('superadmin', 'password')}
                className="bg-zinc-900 border border-zinc-800 hover:border-brand-500 hover:bg-brand-500/5 text-zinc-400 hover:text-zinc-200 rounded-lg p-2.5 text-left transition-all cursor-pointer"
              >
                <span className="block font-semibold">Superadmin NIK</span>
                <span className="text-[10px] text-zinc-600">superadmin / password</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
