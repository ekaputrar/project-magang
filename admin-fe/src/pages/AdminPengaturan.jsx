import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { 
  User, 
  Building, 
  Lock, 
  Camera, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Settings 
} from 'lucide-react';

const AdminPengaturan = () => {
  const { adminProfile, refreshAdminProfile } = useOutletContext();
  const [activeTab, setActiveTab] = useState('profil');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' | 'error'

  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [savingSystem, setSavingSystem] = useState(false);
  const [loadingSystem, setLoadingSystem] = useState(false);

  useEffect(() => {
    const fetchSystemSettings = async () => {
      setLoadingSystem(true);
      try {
        const { data, error } = await supabase
          .from('system_settings')
          .select('*');
        if (!error && data && data.length > 0) {
          const instansi = data.find(s => s.key === 'instansi')?.value || 'Disdukcapil Kabupaten Sidoarjo';
          const kuota = parseInt(data.find(s => s.key === 'kuota_maks')?.value) || 50;
          const pendaftaranAktif = (data.find(s => s.key === 'pendaftaran_aktif')?.value === 'true');
          const jamMasuk = data.find(s => s.key === 'jam_masuk')?.value || '08:00';
          const jamPulang = data.find(s => s.key === 'jam_pulang')?.value || '16:00';

          setSystemData({
            instansi,
            kuota,
            pendaftaranAktif,
            jamMasuk,
            jamPulang
          });
        }
      } catch (err) {
        console.error('Error fetching system settings:', err);
      } finally {
        setLoadingSystem(false);
      }
    };
    fetchSystemSettings();
  }, []);

  // Profil States
  const [profileData, setProfileData] = useState({
    nama: '',
    email: '',
    telepon: '',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  });

  useEffect(() => {
    if (adminProfile) {
      setProfileData({
        nama: adminProfile.nama || '',
        email: adminProfile.email || '',
        telepon: adminProfile.telepon || '',
        avatar: adminProfile.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'
      });
    }
  }, [adminProfile]);

  // Sistem States
  const [systemData, setSystemData] = useState({
    instansi: 'Disdukcapil Kabupaten Sidoarjo',
    kuota: 50,
    pendaftaranAktif: true,
    jamMasuk: '08:00',
    jamPulang: '16:00'
  });

  // Keamanan States
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const triggerToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.nama || !profileData.email || !profileData.telepon) {
      triggerToast('Semua field profil wajib diisi!', 'error');
      return;
    }
    setSavingProfile(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Sesi user tidak ditemukan.');

      // 1. Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: profileData.nama,
          phone: profileData.telepon
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 2. If email changed, update auth.users
      if (profileData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email: profileData.email });
        if (emailError) throw emailError;
        triggerToast('Profil & link verifikasi email dikirim!');
      } else {
        triggerToast('Profil berhasil diperbarui!');
      }

      if (refreshAdminProfile) await refreshAdminProfile();
    } catch (err) {
      triggerToast('Gagal memperbarui profil: ' + err.message, 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSystemSubmit = async (e) => {
    e.preventDefault();
    if (!systemData.instansi || !systemData.kuota || !systemData.jamMasuk || !systemData.jamPulang) {
      triggerToast('Semua field konfigurasi wajib diisi!', 'error');
      return;
    }
    setSavingSystem(true);
    try {
      const updates = [
        { key: 'instansi', value: systemData.instansi },
        { key: 'kuota_maks', value: String(systemData.kuota) },
        { key: 'pendaftaran_aktif', value: String(systemData.pendaftaranAktif) },
        { key: 'jam_masuk', value: systemData.jamMasuk },
        { key: 'jam_pulang', value: systemData.jamPulang }
      ];

      const { error } = await supabase
        .from('system_settings')
        .upsert(updates);

      if (error) throw error;
      triggerToast('Konfigurasi sistem berhasil disimpan!');
    } catch (err) {
      triggerToast('Gagal menyimpan konfigurasi: ' + err.message, 'error');
    } finally {
      setSavingSystem(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      triggerToast('Semua field password wajib diisi!', 'error');
      return;
    }

    setSavingPassword(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Sesi user tidak ditemukan.');

      // Verify current password by signing in again
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });

      if (verifyError) {
        triggerToast('Password saat ini salah!', 'error');
        setSavingPassword(false);
        return;
      }

      if (newPassword.length < 6) {
        triggerToast('Password baru minimal 6 karakter!', 'error');
        setSavingPassword(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        triggerToast('Konfirmasi password tidak cocok!', 'error');
        setSavingPassword(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      triggerToast('Password berhasil diperbarui!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      triggerToast('Gagal memperbarui password: ' + err.message, 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      triggerToast('Ukuran foto maksimal 2MB.', 'error');
      return;
    }

    setUploadingAvatar(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Sesi user tidak ditemukan.');

      const ext = file.name.split('.').pop();
      const path = `avatars/admin_${user.id}.${ext}`;

      // Upload to berkas-pengajuan storage bucket
      const { error: uploadError } = await supabase.storage
        .from('berkas-pengajuan')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('berkas-pengajuan')
        .getPublicUrl(path);

      // Save to user metadata
      const { error: metaError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (metaError) throw metaError;

      triggerToast('Foto profil berhasil diperbarui!');
      if (refreshAdminProfile) await refreshAdminProfile();
    } catch (err) {
      triggerToast('Gagal mengunggah foto: ' + err.message, 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 relative">
      {/* Page Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pengaturan</h1>
          <p className="text-sm text-gray-500">Kelola informasi profil, konfigurasi aplikasi, dan keamanan akun Anda</p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar Cards */}
        <div className="md:col-span-1 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none whitespace-nowrap">
          <button 
            onClick={() => setActiveTab('profil')}
            className={`flex-shrink-0 md:w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'profil' 
                ? 'bg-blue-50 text-blue-600 shadow-[0_4px_12px_rgba(59,130,246,0.08)]' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Profil Admin</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('sistem')}
            className={`flex-shrink-0 md:w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'sistem' 
                ? 'bg-blue-50 text-blue-600 shadow-[0_4px_12px_rgba(59,130,246,0.08)]' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <Building className="w-5 h-5" />
            <span>Konfigurasi Sistem</span>
          </button>

          <button 
            onClick={() => setActiveTab('keamanan')}
            className={`flex-shrink-0 md:w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'keamanan' 
                ? 'bg-blue-50 text-blue-600 shadow-[0_4px_12px_rgba(59,130,246,0.08)]' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <Lock className="w-5 h-5" />
            <span>Keamanan</span>
          </button>
        </div>


        {/* Content Pane */}
        <div className="md:col-span-3 bg-white rounded-3xl border border-gray-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300">
          
          {/* Tab 1: Profil Admin */}
          {activeTab === 'profil' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6 animate-fade-in">
              <div className="border-b border-gray-100 pb-5">
                <h2 className="text-lg font-bold text-gray-800 mb-1">Informasi Profil</h2>
                <p className="text-xs text-gray-500">Perbarui data profil pribadi Anda di panel admin</p>
              </div>

              {/* Avatar Upload */}
              <div className="flex items-center space-x-6 py-4">
                <div className="relative group">
                  <img 
                    src={profileData.avatar} 
                    alt="Admin Avatar" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-inner group-hover:opacity-90 transition-opacity"
                  />
                  <label htmlFor="avatar-file" className={`absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-md transition-all hover:scale-105 ${uploadingAvatar ? 'opacity-50 cursor-wait' : ''}`}>
                    {uploadingAvatar ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                    <input 
                      type="file" 
                      id="avatar-file" 
                      className="hidden" 
                      accept="image/*"
                      disabled={uploadingAvatar}
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Foto Profil</h3>
                  <p className="text-xs text-gray-400 mt-1">Format PNG, JPG maks 2MB</p>
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-xs font-semibold mb-2" htmlFor="profile-nama">
                    Nama Lengkap
                  </label>
                  <input 
                    id="profile-nama"
                    type="text" 
                    className="w-full bg-gray-50 border border-gray-100 text-sm rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                    value={profileData.nama}
                    onChange={(e) => setProfileData({ ...profileData, nama: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-xs font-semibold mb-2" htmlFor="profile-email">
                    Alamat Email
                  </label>
                  <input 
                    id="profile-email"
                    type="email" 
                    className="w-full bg-gray-50 border border-gray-100 text-sm rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-xs font-semibold mb-2" htmlFor="profile-telp">
                    Nomor Telepon
                  </label>
                  <input 
                    id="profile-telp"
                    type="text" 
                    className="w-full bg-gray-50 border border-gray-100 text-sm rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                    value={profileData.telepon}
                    onChange={(e) => setProfileData({ ...profileData, telepon: e.target.value })}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button 
                  type="submit"
                  disabled={savingProfile}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-[0_4px_12px_rgba(59,130,246,0.12)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingProfile ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{savingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: Konfigurasi Sistem */}
          {activeTab === 'sistem' && (
            <form onSubmit={handleSystemSubmit} className="space-y-6 animate-fade-in">
              <div className="border-b border-gray-100 pb-5">
                <h2 className="text-lg font-bold text-gray-800 mb-1">Pengaturan Sistem</h2>
                <p className="text-xs text-gray-500">Konfigurasi parameter aplikasi magang dinas</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-xs font-semibold mb-2" htmlFor="system-instansi">
                    Nama Instansi/Dinas
                  </label>
                  <input 
                    id="system-instansi"
                    type="text" 
                    className="w-full bg-gray-50 border border-gray-100 text-sm rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                    value={systemData.instansi}
                    onChange={(e) => setSystemData({ ...systemData, instansi: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-xs font-semibold mb-2" htmlFor="system-kuota">
                      Kuota Maksimal Peserta Magang
                    </label>
                    <input 
                      id="system-kuota"
                      type="number" 
                      className="w-full bg-gray-50 border border-gray-100 text-sm rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                      value={systemData.kuota}
                      onChange={(e) => setSystemData({ ...systemData, kuota: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  {/* Toggle Registration */}
                  <div className="flex flex-col justify-center">
                    <span className="block text-gray-700 text-xs font-semibold mb-2">Status Pendaftaran Magang</span>
                    <label className="relative inline-flex items-center cursor-pointer mt-1">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={systemData.pendaftaranAktif}
                        onChange={(e) => setSystemData({ ...systemData, pendaftaranAktif: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {systemData.pendaftaranAktif ? 'Dibuka' : 'Ditutup'}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    Waktu Absensi Harian
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 text-xs font-semibold mb-2" htmlFor="system-masuk">
                        Batas Jam Masuk
                      </label>
                      <input 
                        id="system-masuk"
                        type="time" 
                        className="w-full bg-gray-50 border border-gray-100 text-sm rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                        value={systemData.jamMasuk}
                        onChange={(e) => setSystemData({ ...systemData, jamMasuk: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-xs font-semibold mb-2" htmlFor="system-pulang">
                        Jam Mulai Pulang
                      </label>
                      <input 
                        id="system-pulang"
                        type="time" 
                        className="w-full bg-gray-50 border border-gray-100 text-sm rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                        value={systemData.jamPulang}
                        onChange={(e) => setSystemData({ ...systemData, jamPulang: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button 
                  type="submit"
                  disabled={savingSystem || loadingSystem}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-[0_4px_12px_rgba(59,130,246,0.12)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingSystem ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{savingSystem ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Tab 3: Keamanan */}
          {activeTab === 'keamanan' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6 animate-fade-in">
              <div className="border-b border-gray-100 pb-5">
                <h2 className="text-lg font-bold text-gray-800 mb-1">Keamanan Akun</h2>
                <p className="text-xs text-gray-500">Perbarui kata sandi Anda secara berkala untuk menjaga keamanan akun</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 text-xs font-semibold mb-2" htmlFor="sec-current">
                    Password Saat Ini
                  </label>
                  <input 
                    id="sec-current"
                    type="password" 
                    placeholder="Masukkan password sekarang (default: admin)"
                    className="w-full bg-gray-50 border border-gray-100 text-sm rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
                  <div>
                    <label className="block text-gray-700 text-xs font-semibold mb-2" htmlFor="sec-new">
                      Password Baru
                    </label>
                    <input 
                      id="sec-new"
                      type="password" 
                      placeholder="Masukkan password baru"
                      className="w-full bg-gray-50 border border-gray-100 text-sm rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-xs font-semibold mb-2" htmlFor="sec-confirm">
                      Konfirmasi Password Baru
                    </label>
                    <input 
                      id="sec-confirm"
                      type="password" 
                      placeholder="Ulangi password baru"
                      className="w-full bg-gray-50 border border-gray-100 text-sm rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button 
                  type="submit"
                  disabled={savingPassword}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-[0_4px_12px_rgba(59,130,246,0.12)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingPassword ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{savingPassword ? 'Memperbarui...' : 'Perbarui Password'}</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* Floating Toast Notification */}
      {showToast && (
        <div className={`fixed bottom-8 right-8 flex items-center space-x-3 px-5 py-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border transition-all duration-300 z-50 animate-slide-up ${
          toastType === 'success' 
            ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
            : 'bg-red-50 border-red-100 text-red-700'
        }`}>
          {toastType === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default AdminPengaturan;
