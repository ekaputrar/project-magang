import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
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
  ClipboardCheck
} from 'lucide-react';

const AdminLayout = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
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
                className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
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
                className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
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
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-tight">Budi Santoso</p>
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
            <div className="relative">
              <button 
                className="text-gray-400 hover:text-gray-600 transition-colors relative"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full border border-white"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-semibold text-gray-800 text-sm">Notifikasi</h3>
                    <span className="text-xs text-blue-600 hover:underline cursor-pointer" onClick={() => alert('Semua notifikasi ditandai sudah dibaca')}>Tandai sudah dibaca</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => alert('Membuka detail peserta')}>
                      <p className="text-sm font-medium text-gray-800">Peserta Baru Mendaftar</p>
                      <p className="text-xs text-gray-500 mt-1">Siti Aminah dari UPN Veteran Jatim telah mendaftar.</p>
                      <p className="text-xs text-gray-400 mt-2">5 menit yang lalu</p>
                    </div>
                    <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => alert('Membuka form laporan')}>
                      <p className="text-sm font-medium text-gray-800">Laporan Bulanan</p>
                      <p className="text-xs text-gray-500 mt-1">Waktunya mengisi laporan evaluasi peserta magang.</p>
                      <p className="text-xs text-gray-400 mt-2">1 jam yang lalu</p>
                    </div>
                  </div>
                  <div className="p-2 border-t border-gray-100 text-center bg-gray-50">
                    <button className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors" onClick={() => alert('Membuka semua notifikasi')}>Lihat Semua</button>
                  </div>
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
                Admin Sidoarjo
                <ChevronDown className="w-4 h-4 ml-2 text-gray-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-2">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-sm font-semibold text-gray-800">Admin Sidoarjo</p>
                    <p className="text-xs text-gray-500">admin@sidoarjo.go.id</p>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors flex items-center" onClick={() => alert('Membuka Pengaturan')}>
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
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
