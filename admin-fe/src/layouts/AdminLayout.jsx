import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  FileText, 
  Settings, 
  LogOut,
  Search,
  Bell,
  ChevronDown,
  ClipboardCheck,
  CheckCheck,
  ClipboardCopy,
  UserCheck
} from 'lucide-react';

// ─── Helper ────────────────────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff} detik yang lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`;
  return `${Math.floor(diff / 86400)} hari yang lalu`;
};

const STORAGE_KEY = 'admin_notif_read_ids';

const getReadIds = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveReadIds = (ids) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
};

// ─── Notification Item ─────────────────────────────────────────────────────────
const NotifItem = ({ notif, isUnread, onClick }) => {
  const statusColor = {
    Menunggu: 'bg-yellow-100 text-yellow-700',
    Disetujui: 'bg-green-100 text-green-700',
    Ditolak: 'bg-red-100 text-red-600',
  };
  const statusIcon = {
    Menunggu: <ClipboardCopy className="w-3.5 h-3.5" />,
    Disetujui: <UserCheck className="w-3.5 h-3.5" />,
    Ditolak: <ClipboardList className="w-3.5 h-3.5" />,
  };

  return (
    <div
      onClick={() => onClick(notif)}
      className={`px-4 py-3.5 border-b border-gray-50 cursor-pointer transition-all hover:bg-blue-50/60 ${
        isUnread ? 'bg-blue-50/40' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar initials */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
          {(notif.nama || '?')
            .split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p className={`text-sm font-semibold truncate ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
              {notif.nama}
            </p>
            {isUnread && (
              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">{notif.asal_instansi}</p>
          <div className="flex items-center justify-between mt-1.5">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                statusColor[notif.status] || 'bg-gray-100 text-gray-600'
              }`}
            >
              {statusIcon[notif.status]}
              {notif.status}
            </span>
            <span className="text-[10px] text-gray-400">{timeAgo(notif.tanggal_daftar)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Admin Layout ──────────────────────────────────────────────────────────────
const AdminLayout = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const notifRef = useRef(null);

  // ── Notifications State ────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(getReadIds);

  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  // ── Admin Profile ──────────────────────────────────────────────────────────
  const [adminProfile, setAdminProfile] = useState({
    nama: 'Budi Santoso',
    email: 'admin@sidoarjo.go.id',
    telepon: '081234567890',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  });

  const fetchAdminProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      setAdminProfile({
        nama: profile?.name || user?.user_metadata?.name || 'Budi Santoso',
        email: user?.email || 'admin@sidoarjo.go.id',
        telepon: profile?.phone || user?.user_metadata?.phone || '081234567890',
        avatar: user?.user_metadata?.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg'
      });
    } catch (err) {
      console.error('Error fetching admin profile:', err);
    }
  }, []);

  // ── Fetch Notifications (latest 15 pengajuan) ──────────────────────────────
  const fetchNotifications = useCallback(async () => {
    const { data, error } = await supabase
      .from('pengajuans')
      .select('id, nama, asal_instansi, status, tanggal_daftar, bidang_tujuan')
      .order('tanggal_daftar', { ascending: false })
      .limit(15);

    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }
    setNotifications(data || []);
  }, []);

  useEffect(() => {
    fetchAdminProfile();
    fetchNotifications();

    // Supabase Realtime: listen for new pengajuan INSERT
    const channel = supabase
      .channel('layout-notif-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'pengajuans' },
        (payload) => {
          // Add new notification to top of list
          setNotifications((prev) => {
            const exists = prev.some((n) => n.id === payload.new.id);
            if (exists) return prev;
            const newItem = {
              id: payload.new.id,
              nama: payload.new.nama,
              asal_instansi: payload.new.asal_instansi,
              status: payload.new.status || 'Menunggu',
              tanggal_daftar: payload.new.tanggal_daftar,
              bidang_tujuan: payload.new.bidang_tujuan,
            };
            return [newItem, ...prev].slice(0, 15);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAdminProfile, fetchNotifications]);

  // Close notification panel on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Mark all as read ───────────────────────────────────────────────────────
  const markAllRead = () => {
    const allIds = notifications.map((n) => n.id);
    const merged = [...new Set([...readIds, ...allIds])];
    setReadIds(merged);
    saveReadIds(merged);
  };

  // ── Mark single as read and navigate ──────────────────────────────────────
  const handleNotifClick = (notif) => {
    const merged = [...new Set([...readIds, notif.id])];
    setReadIds(merged);
    saveReadIds(merged);
    setShowNotifications(false);
    navigate('/admin/pengajuan');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      alert(`Mencari: ${searchQuery}`);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9fb] font-poppins overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo */}
          <div className="h-24 flex items-center px-6 border-b border-gray-100 bg-white">
            <img src="/logo-sidoarjo.png" alt="Logo Sidoarjo" className="w-14 h-14 object-contain mr-3" />
            <img src="/logo-disdukcapil.png" alt="Disdukcapil" className="h-16 object-contain" />
          </div>

          {/* Navigation */}
          <div className="py-6 px-4">
            <p className="text-xs font-semibold text-gray-400 mb-4 px-2">MENU UTAMA</p>
            <nav className="space-y-1">
              <NavLink 
                to="/admin/dashboard" 
                className={({ isActive }) => 
                  `flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`
                }
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Dashboard
              </NavLink>
              <NavLink 
                to="/admin/peserta" 
                className={({ isActive }) => 
                  `flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`
                }
              >
                <Users className="w-5 h-5 mr-3" />
                Peserta Magang
              </NavLink>
              <NavLink 
                to="/admin/absensi" 
                className={({ isActive }) => 
                  `flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`
                }
              >
                <ClipboardList className="w-5 h-5 mr-3" />
                Absensi
              </NavLink>
              <NavLink 
                to="/admin/pengajuan" 
                className={({ isActive }) => 
                  `flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`
                }
              >
                <ClipboardCheck className="w-5 h-5 mr-3" />
                Pengajuan Magang
                {/* Unread badge on sidebar */}
                {unreadCount > 0 && (
                  <span className="ml-auto bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-tight">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </NavLink>
              <NavLink 
                to="/admin/surat-tugas" 
                className={({ isActive }) => 
                  `flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`
                }
              >
                <FileText className="w-5 h-5 mr-3" />
                Surat Tugas
              </NavLink>
            </nav>

            <p className="text-xs font-semibold text-gray-400 mt-8 mb-4 px-2">SISTEM</p>
            <nav className="space-y-1">
              <NavLink 
                to="/admin/pengaturan" 
                className={({ isActive }) => 
                  `flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`
                }
              >
                <Settings className="w-5 h-5 mr-3" />
                Pengaturan
              </NavLink>
            </nav>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={adminProfile.avatar} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-tight truncate max-w-[120px]">{adminProfile.nama}</p>
                <p className="text-xs text-gray-500">Admin Utama</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Keluar"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0">
          <div className="w-96 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari nama peserta, instansi, atau surat..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearching(true)}
              onBlur={() => setTimeout(() => setIsSearching(false), 200)}
              onKeyDown={handleSearch}
              className="w-full bg-gray-50 border border-gray-100 text-sm rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
            />
            {isSearching && searchQuery.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-50 p-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500">Hasil Pencarian untuk "{searchQuery}"</div>
                <div className="px-3 py-2 hover:bg-blue-50 cursor-pointer rounded-lg text-sm text-gray-700 transition-colors" onClick={() => alert('Membuka profil: Budi Santoso')}>
                  <p className="font-medium text-blue-600">Budi Santoso</p>
                  <p className="text-xs text-gray-500">Peserta Magang - Universitas Brawijaya</p>
                </div>
                <div className="px-3 py-2 hover:bg-blue-50 cursor-pointer rounded-lg text-sm text-gray-700 transition-colors mt-1" onClick={() => alert('Membuka surat: Surat Tugas #1234')}>
                  <p className="font-medium text-blue-600">Surat Tugas #1234</p>
                  <p className="text-xs text-gray-500">Pendampingan Peserta Magang</p>
                </div>
                <div className="px-3 py-2 hover:bg-blue-50 cursor-pointer rounded-lg text-sm text-gray-700 transition-colors mt-1" onClick={() => alert('Membuka instansi: Diskominfo Sidoarjo')}>
                  <p className="font-medium text-blue-600">Diskominfo Sidoarjo</p>
                  <p className="text-xs text-gray-500">Instansi / Penempatan</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-6">
            {/* ── Notification Bell ── */}
            <div className="relative" ref={notifRef}>
              <button
                id="notif-bell-btn"
                className="text-gray-400 hover:text-blue-500 transition-colors relative"
                onClick={() => {
                  setShowNotifications((prev) => !prev);
                  setShowProfileMenu(false);
                }}
                aria-label="Notifikasi"
              >
                <Bell className={`w-5 h-5 transition-transform duration-200 ${showNotifications ? 'text-blue-500 scale-110' : ''}`} />
                {/* Unread badge */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none shadow-sm animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
                {unreadCount === 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-gray-300 rounded-full border border-white" />
                )}
              </button>

              {/* ── Notification Dropdown ── */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-96 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  style={{ animation: 'fadeInDown 0.18s ease' }}>
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-white" />
                      <h3 className="font-semibold text-white text-sm">Notifikasi Pengajuan</h3>
                      {unreadCount > 0 && (
                        <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {unreadCount} baru
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="flex items-center gap-1 text-[11px] text-white/80 hover:text-white transition-colors"
                        title="Tandai semua sudah dibaca"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Baca semua
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <Bell className="w-10 h-10 text-gray-200 mb-3" />
                        <p className="text-sm text-gray-400 font-medium">Belum ada pengajuan masuk</p>
                        <p className="text-xs text-gray-300 mt-1">Notifikasi akan muncul saat ada pengajuan baru</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <NotifItem
                          key={notif.id}
                          notif={notif}
                          isUnread={!readIds.includes(notif.id)}
                          onClick={handleNotifClick}
                        />
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
                      <button
                        className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                        onClick={() => {
                          setShowNotifications(false);
                          navigate('/admin/pengajuan');
                        }}
                      >
                        Lihat Semua Pengajuan →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-gray-200"></div>

            <div className="relative">
              <button 
                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
              >
                {adminProfile.nama.split(' ')[0]}
                <ChevronDown className="w-4 h-4 ml-2 text-gray-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-2">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-sm font-semibold text-gray-800">{adminProfile.nama}</p>
                    <p className="text-xs text-gray-500 truncate">{adminProfile.email}</p>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors flex items-center" onClick={() => { navigate('/admin/pengaturan'); setShowProfileMenu(false); }}>
                    <Settings className="w-4 h-4 mr-2" /> Pengaturan
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center" 
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet context={{ adminProfile, refreshAdminProfile: fetchAdminProfile }} />
        </main>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
