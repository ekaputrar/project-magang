import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  Download,
  Plus,
  Users,
  CheckSquare,
  ArrowRightSquare,
  FileBadge,
  MoreVertical,
  TrendingUp,
  RefreshCw,
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
} from 'recharts';

// ─── Helpers ───────────────────────────────────────────────────────────────────
const COLORS = ['#0066FF', '#00A3FF', '#FFB800', '#94a3b8'];

const MONTH_NAMES_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

const fmtTanggal = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
};

const hitungDurasi = (mulai, selesai) => {
  if (!mulai || !selesai) return '-';
  const months = Math.round((new Date(selesai) - new Date(mulai)) / (1000 * 60 * 60 * 24 * 30));
  return months > 0 ? `${months} Bln` : '< 1 Bln';
};

const StatusBadge = ({ status }) => {
  const styles = {
    Menunggu: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    Disetujui: 'bg-green-50 text-green-600 border-green-100',
    Ditolak: 'bg-red-50 text-red-500 border-red-100',
  };
  const dots = {
    Menunggu: 'bg-yellow-400',
    Disetujui: 'bg-green-500',
    Ditolak: 'bg-red-500',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dots[status] || 'bg-gray-400'}`} />
      {status}
    </span>
  );
};

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
);

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, bg, color, sub, loading }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        {loading ? (
          <Skeleton className="h-9 w-16 mt-1" />
        ) : (
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        )}
      </div>
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="flex items-center text-xs">
      {loading ? <Skeleton className="h-5 w-28" /> : sub}
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();

  // State
  const [adminName, setAdminName] = useState('Admin');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState({
    pesertaAktif: 0,
    absensiHariIni: 0,
    tingkatKehadiran: 0,
    permohonanBaru: 0,
    suratTugas: 0,
  });

  const [areaChartData, setAreaChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [recentPengajuan, setRecentPengajuan] = useState([]);

  // ── Fetch admin name ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAdminName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .maybeSingle();
      if (profile?.name) setAdminName(profile.name);
    };
    fetchAdminName();
  }, []);

  // ── Fetch all dashboard data ──────────────────────────────────────────────────
  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time

      // 1. Total Peserta Aktif
      const { count: pesertaAktif } = await supabase
        .from('pesertas')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Aktif');

      // 2. Absensi Hari Ini
      const { data: absToday } = await supabase
        .from('absensis')
        .select('status')
        .eq('tanggal', todayStr);

      const hadirCount = (absToday || []).filter(a =>
        a.status === 'Hadir' || a.status === 'Terlambat'
      ).length;

      const tingkatKehadiran = pesertaAktif > 0
        ? Math.round((hadirCount / pesertaAktif) * 100)
        : 0;

      // 3. Permohonan Baru (Menunggu review)
      const { count: permohonanBaru } = await supabase
        .from('pengajuans')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Menunggu');

      // 4. Surat Tugas
      const { count: suratTugasCount } = await supabase
        .from('surat_tugas')
        .select('*', { count: 'exact', head: true });

      setStats({
        pesertaAktif: pesertaAktif || 0,
        absensiHariIni: hadirCount,
        tingkatKehadiran,
        permohonanBaru: permohonanBaru || 0,
        suratTugas: suratTugasCount || 0,
      });

      // 5. Tren Pendaftaran 6 Bulan Terakhir
      const { data: allPengajuans } = await supabase
        .from('pengajuans')
        .select('tanggal_daftar');

      const now = new Date();
      const trendMap = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        trendMap[key] = { name: MONTH_NAMES_ID[d.getMonth()], value: 0 };
      }

      (allPengajuans || []).forEach(row => {
        const d = new Date(row.tanggal_daftar);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (trendMap[key]) trendMap[key].value += 1;
      });

      setAreaChartData(Object.values(trendMap));

      // 6. Distribusi Instansi (Peserta Aktif)
      const { data: instansiRows } = await supabase
        .from('pesertas')
        .select('asal_instansi')
        .eq('status', 'Aktif');

      const instansiCount = {};
      (instansiRows || []).forEach(r => {
        const key = r.asal_instansi || 'Tidak Diketahui';
        instansiCount[key] = (instansiCount[key] || 0) + 1;
      });

      const sorted = Object.entries(instansiCount).sort((a, b) => b[1] - a[1]);
      const top3 = sorted.slice(0, 3);
      const lainnya = sorted.slice(3).reduce((sum, [, v]) => sum + v, 0);

      const pie = top3.map(([name, value]) => ({ name, value }));
      if (lainnya > 0) pie.push({ name: 'Lainnya', value: lainnya });
      setPieChartData(pie.length > 0 ? pie : [{ name: 'Belum Ada Data', value: 1 }]);

      // 7. 5 Pengajuan Terbaru
      const { data: recentData } = await supabase
        .from('pengajuans')
        .select('id, nama, asal_instansi, jurusan, bidang_tujuan, tanggal_mulai, tanggal_selesai, status, tanggal_daftar')
        .order('tanggal_daftar', { ascending: false })
        .limit(5);

      setRecentPengajuan(recentData || []);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    // Real-time subscription: refresh on any change to key tables
    const channel = supabase
      .channel('dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pengajuans' }, () => fetchDashboardData(true))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pesertas' }, () => fetchDashboardData(true))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'absensis' }, () => fetchDashboardData(true))
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [fetchDashboardData]);

  // ── Tanggal Hari Ini ─────────────────────────────────────────────────────────
  const todayLabel = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  // ── Export CSV ───────────────────────────────────────────────────────────────
  const handleExport = () => {
    const rows = [
      ['Metrik', 'Nilai'],
      ['Total Peserta Aktif', stats.pesertaAktif],
      ['Absensi Hari Ini', stats.absensiHariIni],
      ['Tingkat Kehadiran (%)', stats.tingkatKehadiran],
      ['Permohonan Menunggu', stats.permohonanBaru],
      ['Surat Tugas Terbit', stats.suratTugas],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard_${new Date().toLocaleDateString('en-CA')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Selamat Datang, {adminName}! <span className="inline-block">👋</span>
          </h2>
          <p className="text-sm text-gray-500">
            Berikut adalah ringkasan aktivitas peserta magang hari ini, {todayLabel}.
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={() => navigate('/admin/pengajuan')}
            className="flex items-center px-4 py-2 bg-[#0066FF] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Lihat Pengajuan
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Peserta Aktif"
          value={stats.pesertaAktif}
          icon={Users}
          bg="bg-blue-50"
          color="text-blue-600"
          loading={loading}
          sub={
            <span className="text-gray-400">peserta magang saat ini</span>
          }
        />
        <StatCard
          label="Absensi Hari Ini"
          value={stats.absensiHariIni}
          icon={CheckSquare}
          bg="bg-yellow-50"
          color="text-yellow-500"
          loading={loading}
          sub={
            <>
              <span className="font-semibold text-gray-700 mr-1">{stats.tingkatKehadiran}%</span>
              <span className="text-gray-400">tingkat kehadiran</span>
            </>
          }
        />
        <StatCard
          label="Permohonan Baru"
          value={stats.permohonanBaru}
          icon={ArrowRightSquare}
          bg="bg-blue-50"
          color="text-blue-500"
          loading={loading}
          sub={
            stats.permohonanBaru > 0 ? (
              <span className="flex items-center px-2 py-1 bg-yellow-50 text-yellow-600 font-medium rounded-md">
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1.5" />
                {stats.permohonanBaru} menunggu review
              </span>
            ) : (
              <span className="text-gray-400">tidak ada yang menunggu</span>
            )
          }
        />
        <StatCard
          label="Surat Tugas Terbit"
          value={stats.suratTugas}
          icon={FileBadge}
          bg="bg-purple-50"
          color="text-purple-500"
          loading={loading}
          sub={<span className="text-gray-400">total surat tugas</span>}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart — Tren Pendaftaran */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] lg:col-span-2">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-800">Tren Pendaftaran Magang</h3>
              <p className="text-xs text-gray-500 mt-1">Statistik pendaftaran 6 bulan terakhir</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>Data Langsung</span>
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex items-end gap-3 px-2">
              {[40, 60, 35, 80, 55, 70].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end">
                  <Skeleton className={`w-full`} style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066FF" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
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
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`${value} Pendaftar`, 'Jumlah']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#0066FF"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    dot={{ r: 4, fill: '#0066FF', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#0066FF', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Donut Chart — Distribusi Instansi */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] relative">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-base font-bold text-gray-800">Distribusi Instansi</h3>
              <p className="text-xs text-gray-500 mt-1">Peserta magang aktif</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center gap-3 mt-6">
              <Skeleton className="w-40 h-40 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>
          ) : (
            <>
              <div className="h-48 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={78}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value, name) => [`${value} peserta`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2">
                {pieChartData.map((entry, index) => (
                  <div key={`legend-${index}`} className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="truncate">{entry.name}</span>
                    </div>
                    <span className="font-semibold text-gray-700 ml-2">{entry.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-gray-800">Aktivitas Pendaftaran Terbaru</h3>
            <p className="text-xs text-gray-500 mt-1">5 permohonan magang terbaru yang masuk</p>
          </div>
          <button
            onClick={() => navigate('/admin/pengajuan')}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Lihat Semua →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 font-semibold">NAMA PESERTA</th>
                <th className="px-6 py-4 font-semibold">INSTANSI ASAL</th>
                <th className="px-6 py-4 font-semibold">BIDANG & DURASI</th>
                <th className="px-6 py-4 font-semibold">TGL DAFTAR</th>
                <th className="px-6 py-4 font-semibold">STATUS</th>
                <th className="px-6 py-4 font-semibold text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-6 py-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : recentPengajuan.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <ArrowRightSquare className="w-10 h-10 text-gray-200" />
                      <p className="font-medium text-gray-500">Belum ada pengajuan masuk</p>
                      <p className="text-xs">Pengajuan baru dari calon peserta akan muncul di sini</p>
                    </div>
                  </td>
                </tr>
              ) : (
                recentPengajuan.map((row) => {
                  const initials = (row.nama || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                  const avatarColors = ['bg-blue-400', 'bg-pink-400', 'bg-teal-400', 'bg-purple-400', 'bg-indigo-400'];
                  const avatarColor = avatarColors[row.nama?.charCodeAt(0) % avatarColors.length] || 'bg-gray-400';
                  return (
                    <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{row.nama}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{row.jurusan || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-700">{row.asal_instansi || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-700">{row.bidang_tujuan || '-'}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{hitungDurasi(row.tanggal_mulai, row.tanggal_selesai)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-gray-500">{fmtTanggal(row.tanggal_daftar)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate('/admin/pengajuan')}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Proses →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
