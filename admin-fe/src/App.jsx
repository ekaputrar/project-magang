import React, { useState, useEffect } from 'react';
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
import { supabase } from './lib/supabaseClient';

// Helper function to check if the current session belongs to an admin
const checkAdminStatus = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return false;

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error || !data || data.role !== 'admin') {
    // If logged in but not an admin, sign out from the session
    await supabase.auth.signOut();
    return false;
  }
  return true;
};

// ProtectedRoute: check admin status, redirect to login if not authenticated or not an admin
const ProtectedRoute = () => {
  const [isAdmin, setIsAdmin] = useState(undefined); // undefined = loading

  useEffect(() => {
    const verify = async () => {
      const isAdm = await checkAdminStatus();
      setIsAdmin(isAdm);
    };
    verify();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
      } else if (session) {
        const isAdm = await checkAdminStatus();
        setIsAdmin(isAdm);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (isAdmin === undefined) {
    // Loading, show spinner
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return isAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

// LoginRoute: if already admin, redirect to dashboard, otherwise show login
const LoginRoute = () => {
  const [isAdmin, setIsAdmin] = useState(undefined);

  useEffect(() => {
    checkAdminStatus().then(isAdm => setIsAdmin(isAdm));
  }, []);

  if (isAdmin === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return isAdmin ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />;
};

// RootRoute: redirect to dashboard if admin, otherwise redirect to login
const RootRoute = () => {
  const [isAdmin, setIsAdmin] = useState(undefined);

  useEffect(() => {
    checkAdminStatus().then(isAdm => setIsAdmin(isAdm));
  }, []);

  if (isAdmin === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return <Navigate to={isAdmin ? "/admin/dashboard" : "/admin/login"} replace />;
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