import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
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
          <Route path="pengaturan" element={<div className="p-8">Halaman Pengaturan</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;