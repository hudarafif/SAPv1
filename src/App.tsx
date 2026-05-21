import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PegawaiPage from './pages/Pegawai';
import RekrutmenPage from './pages/Rekrutmen';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />


      {/* Protected Routes (Wrapped in Layout) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pegawai" element={<PegawaiPage />} />
        <Route path="/rekrutmen" element={<RekrutmenPage />} />
      </Route>

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
