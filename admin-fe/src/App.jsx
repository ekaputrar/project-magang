import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './index.css';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminPeserta from './pages/AdminPeserta';
import AdminAbsensi from './pages/AdminAbsensi';
import AdminSuratTugas from './pages/AdminSuratTugas';
import AdminSuratTugasPrint from './pages/AdminSuratTugasPrint';
import AdminSuratTugasCreate from './pages/AdminSuratTugasCreate';
import AdminPengajuan from './pages/AdminPengajuan';
import AdminPengaturan from './pages/AdminPengaturan';

// ProtectedRoute: checks if the admin is logged in
const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('adminToken') === 'true';
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

// LoginRoute: checks if the admin is already logged in, redirecting them to dashboard
const LoginRoute = () => {
  const isAuthenticated = localStorage.getItem('adminToken') === 'true';
  return isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />;
};

// RootRoute: redirects root to dashboard if logged in, otherwise to login
const RootRoute = () => {
  const isAuthenticated = localStorage.getItem('adminToken') === 'true';
  return <Navigate to={isAuthenticated ? "/admin/dashboard" : "/admin/login"} replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/admin/login" element={<LoginRoute />} />
        
        {/* Protected administrative routes */}
        <Route element={<ProtectedRoute />}>
          {/* Fullscreen Print Route */}
          <Route path="/print-spt" element={<AdminSuratTugasPrint />} />
          
          {/* Admin Routes with Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="peserta" element={<AdminPeserta />} />
            <Route path="absensi" element={<AdminAbsensi />} />
            <Route path="surat-tugas" element={<AdminSuratTugas />} />
            <Route path="surat-tugas/create" element={<AdminSuratTugasCreate />} />
            <Route path="pengajuan" element={<AdminPengajuan />} />
            <Route path="pengaturan" element={<AdminPengaturan />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;