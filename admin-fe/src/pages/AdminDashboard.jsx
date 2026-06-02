import React from 'react';
import { 
  Download, 
  Plus, 
  Users, 
  CheckSquare, 
  ArrowRightSquare, 
  FileBadge,
  MoreVertical
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';

// Mock Data for Charts
const areaChartData = [
  { name: 'Mei', value: 45 },
  { name: 'Jun', value: 52 },
  { name: 'Jul', value: 38 },
  { name: 'Ags', value: 85 },
  { name: 'Sep', value: 64 },
  { name: 'Okt', value: 42 },
];

const pieChartData = [
  { name: 'Universitas Brawijaya', value: 45 },
  { name: 'UIN Sunan Ampel', value: 25 },
  { name: 'SMKN 1 Sidoarjo', value: 20 },
  { name: 'Lainnya', value: 10 },
];
const COLORS = ['#0066FF', '#00A3FF', '#FFB800', '#E2E8F0'];

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Selamat Datang, Budi! <span className="inline-block animate-wave">👋</span>
          </h2>
          <p className="text-sm text-gray-500">
            Berikut adalah ringkasan aktivitas peserta magang hari ini, 24 Oktober 2023.
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Laporan
          </button>
          <button className="flex items-center px-4 py-2 bg-[#0066FF] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Peserta
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Peserta Aktif</p>
              <h3 className="text-3xl font-bold text-gray-800">124</h3>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs">
            <span className="px-2 py-1 bg-green-50 text-green-600 font-medium rounded-md mr-2">
              +12%
            </span>
            <span className="text-gray-400">dari bulan lalu</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Absensi Hari Ini</p>
              <h3 className="text-3xl font-bold text-gray-800">118</h3>
            </div>
            <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-500">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs">
            <span className="font-semibold text-gray-700 mr-1">95%</span>
            <span className="text-gray-400">Tingkat kehadiran</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Permohonan Baru</p>
              <h3 className="text-3xl font-bold text-gray-800">15</h3>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
              <ArrowRightSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs">
            <span className="flex items-center px-2 py-1 bg-yellow-50 text-yellow-600 font-medium rounded-md mr-2">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1.5"></span>
              8
            </span>
            <span className="text-gray-400">Menunggu review</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Surat Tugas Terbit</p>
              <h3 className="text-3xl font-bold text-gray-800">42</h3>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
              <FileBadge className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs mt-1">
            <span className="text-gray-400">Sepanjang bulan ini</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] lg:col-span-2">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-800">Tren Pendaftaran Magang</h3>
              <p className="text-xs text-gray-500 mt-1">Statistik pendaftaran 6 bulan terakhir</p>
            </div>
            <select className="bg-gray-50 border border-gray-100 text-xs text-gray-600 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
              <option>Tahun 2023</option>
              <option>Tahun 2022</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0066FF" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] relative">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-base font-bold text-gray-800">Distribusi Instansi</h3>
              <p className="text-xs text-gray-500 mt-1">Berdasarkan asal Universitas/Sekolah</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          
          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1e293b', fontSize: '14px', fontWeight: 500 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Custom Legend to match design */}
          <div className="mt-4 grid grid-cols-1 gap-2">
            {pieChartData.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center text-xs text-gray-500">
                <span 
                  className="w-3 h-3 rounded-sm mr-2 flex-shrink-0" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></span>
                <span className="truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-gray-800">Aktivitas Pendaftaran Terbaru</h3>
            <p className="text-xs text-gray-500 mt-1">Daftar permohonan magang yang masuk hari ini</p>
          </div>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            Lihat Semua
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 font-semibold">NAMA PESERTA</th>
                <th className="px-6 py-4 font-semibold">INSTANSI ASAL</th>
                <th className="px-6 py-4 font-semibold">DURASI MAGANG</th>
                <th className="px-6 py-4 font-semibold">STATUS</th>
                <th className="px-6 py-4 font-semibold text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-800">Siti Aminah</p>
                  <p className="text-xs text-gray-400 mt-0.5">NIM: 19028374</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-700">Universitas Brawijaya</p>
                  <p className="text-xs text-gray-400 mt-0.5">Administrasi Publik</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-700">3 Bulan</p>
                  <p className="text-xs text-gray-400 mt-0.5">Nov '23 - Jan '24</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-600 border border-yellow-100">
                    Menunggu Review
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                    Proses
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
