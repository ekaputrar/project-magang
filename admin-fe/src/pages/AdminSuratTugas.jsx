import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Filter, 
  Edit, 
  Printer, 
  Plus, 
  FileText, 
  Maximize2, 
  User,
  Share2,
  CheckCircle2,
  X,
  Save,
  AlertTriangle,
  Trash2,
  ChevronDown,
  MapPin,
  Car,
  Coins,
  Calendar,
  Clock,
  RefreshCw,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

// ─── Status Badge ───────────────────────────────────────────────────────────────
const getStatusBadge = (status) => {
  switch (status) {
    case 'Aktif':
      return <span className="px-2 py-0.5 text-[10px] font-semibold text-blue-600 bg-blue-50 rounded-md border border-blue-100">Aktif</span>;
    case 'Selesai':
      return <span className="px-2 py-0.5 text-[10px] font-semibold text-green-600 bg-green-50 rounded-md border border-green-100">Selesai</span>;
    case 'Draft':
      return <span className="px-2 py-0.5 text-[10px] font-semibold text-yellow-600 bg-yellow-50 rounded-md border border-yellow-100">Draft</span>;
    case 'Dibatalkan':
      return <span className="px-2 py-0.5 text-[10px] font-semibold text-gray-500 bg-gray-100 rounded-md border border-gray-200">Dibatalkan</span>;
    default:
      return <span className="px-2 py-0.5 text-[10px] font-semibold text-gray-500 bg-gray-100 rounded-md border border-gray-200">{status || 'Draft'}</span>;
  }
};

// ─── Format date helper ─────────────────────────────────────────────────────────
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const formatDateLong = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

// ─── Toast ──────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  const colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' };
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl text-white text-sm font-medium shadow-xl ${colors[type] || 'bg-gray-800'}`}>
      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white/70 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// ─── Edit Modal ─────────────────────────────────────────────────────────────────
const EditModal = ({ surat, onClose, onSave }) => {
  const [form, setForm] = useState({ ...surat });
  const [saving, setSaving] = useState(false);

  if (!surat) return null;

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
              <Edit className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Edit Surat Tugas</h2>
              <p className="text-xs text-gray-400">{surat.nomor_surat}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Nomor Surat *</label>
              <input
                value={form.nomor_surat || ''}
                onChange={set('nomor_surat')}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white text-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Tanggal Surat *</label>
              <input
                type="date"
                value={form.tanggal_surat || ''}
                onChange={set('tanggal_surat')}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white text-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Judul / Tujuan Tugas</label>
            <input
              value={form.judul || form.tujuan_tugas || ''}
              onChange={(e) => setForm(f => ({ ...f, judul: e.target.value, tujuan_tugas: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white text-gray-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Tanggal Mulai</label>
              <input type="date" value={form.tanggal_mulai || ''} onChange={set('tanggal_mulai')}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white text-gray-800" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Tanggal Selesai</label>
              <input type="date" value={form.tanggal_selesai || ''} onChange={set('tanggal_selesai')}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white text-gray-800" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Tempat Tugas</label>
            <input value={form.tempat_tugas || ''} onChange={set('tempat_tugas')}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white text-gray-800" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Status</label>
            <select value={form.status || 'Draft'} onChange={set('status')}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white text-gray-800">
              <option>Draft</option>
              <option>Aktif</option>
              <option>Selesai</option>
              <option>Dibatalkan</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors text-sm">
              Batal
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-[#0066FF] hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-70">
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
              ) : (
                <><Save className="w-4 h-4" /> Simpan Perubahan</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Delete Modal ───────────────────────────────────────────────────────────────
const DeleteModal = ({ surat, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);
  if (!surat) return null;

  const handleDelete = async () => {
    setDeleting(true);
    await onConfirm(surat.id);
    setDeleting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Hapus Surat Tugas?</h2>
          <p className="text-sm text-gray-500 mb-1">Anda akan menghapus surat:</p>
          <p className="text-sm font-semibold text-gray-800 mb-1">{surat.nomor_surat}</p>
          <p className="text-xs text-gray-400 mb-6">{surat.judul || surat.tujuan_tugas || '-'}</p>
          <p className="text-xs text-red-400 bg-red-50 rounded-lg px-3 py-2 mb-6 w-full">
            ⚠️ Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex gap-3 w-full">
            <button onClick={onClose} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors text-sm">
              Batal
            </button>
            <button onClick={handleDelete} disabled={deleting}
              className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-70">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4" /> Hapus</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────────
const AdminSuratTugas = () => {
  const navigate = useNavigate();

  // Data states
  const [suratList, setSuratList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSurat, setActiveSurat] = useState(null);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  // Filter / search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // Modal states
  const [editSurat, setEditSurat] = useState(null);
  const [deleteSurat, setDeleteSurat] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch from Supabase ──────────────────────────────────────────────────────
  const fetchSuratTugas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('surat_tugas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Gagal mengambil data surat tugas:', error);
      showToast('Gagal memuat data surat tugas', 'error');
      setLoading(false);
      return;
    }

    setSuratList(data || []);
    if (data && data.length > 0 && !activeSurat) {
      setActiveSurat(data[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSuratTugas();

    const channel = supabase
      .channel('surat-tugas-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'surat_tugas' }, () => {
        fetchSuratTugas();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // Close filter dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Filtered list ────────────────────────────────────────────────────────────
  const filtered = suratList.filter(surat => {
    const nomor = (surat.nomor_surat || '').toLowerCase();
    const judul = (surat.judul || surat.tujuan_tugas || '').toLowerCase();
    const pj = (surat.penandatangan_nama || '').toLowerCase();
    const matchSearch = !searchQuery ||
      nomor.includes(searchQuery.toLowerCase()) ||
      judul.includes(searchQuery.toLowerCase()) ||
      pj.includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'Semua' || surat.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSaveEdit = async (form) => {
    const { error } = await supabase
      .from('surat_tugas')
      .update({
        nomor_surat: form.nomor_surat,
        judul: form.judul || form.tujuan_tugas,
        tujuan_tugas: form.tujuan_tugas || form.judul,
        tanggal_surat: form.tanggal_surat || null,
        tanggal_mulai: form.tanggal_mulai || null,
        tanggal_selesai: form.tanggal_selesai || null,
        tempat_tugas: form.tempat_tugas,
        status: form.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', form.id);

    if (error) {
      showToast('Gagal memperbarui surat tugas: ' + error.message, 'error');
      return;
    }

    setEditSurat(null);
    setActiveSurat(prev => prev?.id === form.id ? { ...prev, ...form } : prev);
    showToast('Surat tugas berhasil diperbarui!');
    fetchSuratTugas();
  };

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('surat_tugas')
      .delete()
      .eq('id', id);

    if (error) {
      showToast('Gagal menghapus surat tugas: ' + error.message, 'error');
      return;
    }

    setDeleteSurat(null);
    if (activeSurat?.id === id) setActiveSurat(null);
    showToast('Surat tugas berhasil dihapus!');
    fetchSuratTugas();
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/print-spt/${activeSurat?.id}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast('Link berhasil disalin ke clipboard!', 'info');
    } catch {
      showToast('Gagal menyalin link', 'error');
    }
  };

  // ── Render pegawai tabel untuk preview ──────────────────────────────────────
  const renderPegawaiRows = (pegawai) => {
    if (!pegawai || !Array.isArray(pegawai) || pegawai.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="border border-gray-300 py-3 px-3 text-center text-gray-400 italic text-xs">
            Belum ada data pegawai
          </td>
        </tr>
      );
    }
    return pegawai.map((p, i) => (
      <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
        <td className="border border-gray-300 py-3 px-3 text-center">{i + 1}</td>
        <td className="border border-gray-300 py-3 px-3 font-semibold">{p.nama || '-'}</td>
        <td className="border border-gray-300 py-3 px-3">{p.nip || '-'}</td>
        <td className="border border-gray-300 py-3 px-3">{p.pangkat || '-'}</td>
        <td className="border border-gray-300 py-3 px-3">{p.jabatan || '-'}</td>
      </tr>
    ));
  };

  // ── Render dasar penugasan ───────────────────────────────────────────────────
  const renderDasar = (teks) => {
    if (!teks) return <p className="text-gray-400 italic text-xs">Belum diisi</p>;
    const lines = teks.split('\n').filter(l => l.trim());
    return (
      <ol className="list-decimal pl-4 space-y-1">
        {lines.map((line, i) => {
          const clean = line.replace(/^\d+\.\s*/, '');
          return <li key={i}>{clean}</li>;
        })}
      </ol>
    );
  };

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (!loading && suratList.length === 0) {
    return (
      <div className="flex h-[calc(100vh-2rem)] -m-6 bg-[#f8f9fb] font-poppins items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-blue-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">Belum ada Surat Tugas</h3>
          <p className="text-sm text-gray-400 mb-6">Mulai buat surat perintah tugas pertama Anda</p>
          <button
            onClick={() => navigate('/admin/surat-tugas/create')}
            className="px-5 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors flex items-center mx-auto shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            Buat SPT Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] -m-6 bg-[#f8f9fb] font-poppins relative">
      
      {/* LEFT PANEL */}
      <div className={`w-full lg:w-[360px] bg-white border-r border-gray-100 flex flex-col h-full flex-shrink-0 z-10 shadow-[2px_0_10px_rgba(0,0,0,0.02)] ${activeSurat && showPreviewMobile ? 'hidden lg:flex' : 'flex'}`}>
        
        {/* Search & Filter */}
        <div className="p-4 border-b border-gray-100 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari surat tugas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg py-2 pl-9 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`px-3 py-2 border rounded-lg flex items-center justify-center transition-colors ${filterOpen ? 'bg-blue-50 border-blue-300 text-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              <Filter className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{filterStatus === 'Semua' ? 'Filter' : filterStatus}</span>
              <ChevronDown className={`w-3.5 h-3.5 ml-1.5 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
            {filterOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                {['Semua', 'Draft', 'Aktif', 'Selesai', 'Dibatalkan'].map(s => (
                  <button
                    key={s}
                    onClick={() => { setFilterStatus(s); setFilterOpen(false); }}
                    className={`w-full px-4 py-2.5 text-sm text-left flex items-center gap-2 transition-colors ${filterStatus === s ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
                    {filterStatus === s && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* List Header */}
        <div className="px-5 py-3 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-[11px] font-bold text-gray-400 tracking-wider">DAFTAR SURAT TUGAS</h3>
          <span className="text-[11px] font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
            {filtered.length} dokumen
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
        )}

        {/* List Items */}
        {!loading && (
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Tidak ada hasil</p>
              </div>
            ) : (
              filtered.map((surat) => (
                <div
                  key={surat.id}
                  onClick={() => {
                    setActiveSurat(surat);
                    setShowPreviewMobile(true);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    activeSurat?.id === surat.id
                      ? 'border-blue-500 bg-white shadow-sm ring-1 ring-blue-500/20'
                      : 'border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    {getStatusBadge(surat.status)}
                    <span className="text-[11px] text-gray-400 font-medium">{formatDate(surat.tanggal_surat)}</span>
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1 truncate">{surat.nomor_surat}</h4>
                  <p className="text-[12px] text-gray-500 mb-3 truncate">{surat.judul || surat.tujuan_tugas || 'Tanpa judul'}</p>
                  <div className="flex items-center text-gray-400">
                    <User className="w-3.5 h-3.5 mr-1.5" />
                    <span className="text-[11px] font-medium truncate">{surat.penandatangan_nama || '-'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className={`flex-1 flex flex-col h-full overflow-hidden relative ${!activeSurat || !showPreviewMobile ? 'hidden lg:flex' : 'flex'}`}>
        
        {/* Top Actions Bar */}
        <div className="h-auto min-h-[4rem] px-4 md:px-6 py-3 bg-white border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between flex-shrink-0 z-10 shadow-sm">
          <div className="flex items-center text-blue-600 min-w-0">
            <button
              onClick={() => setShowPreviewMobile(false)}
              className="p-1.5 -ml-1 mr-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg lg:hidden transition-colors flex-shrink-0"
              aria-label="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <FileText className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="font-semibold text-sm truncate">
              {activeSurat ? `Preview: ${activeSurat.nomor_surat}` : 'Pilih surat untuk preview'}
            </span>
            {activeSurat && (
              <div className="ml-3 pl-3 border-l border-gray-200 flex-shrink-0">
                {getStatusBadge(activeSurat.status)}
              </div>
            )}
          </div>
          <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
            {activeSurat && (
              <>
                <button
                  onClick={() => setEditSurat(activeSurat)}
                  className="flex-1 sm:flex-none px-3 py-2 bg-white border border-gray-200 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center shadow-sm">
                  <Edit className="w-4 h-4 mr-1.5" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteSurat(activeSurat)}
                  className="flex-1 sm:flex-none px-3 py-2 bg-white border border-red-200 text-red-500 text-xs sm:text-sm font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center shadow-sm">
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Hapus
                </button>
                <button
                  onClick={() => navigate(`/print-spt/${activeSurat.id}`)}
                  className="flex-1 sm:flex-none px-3 py-2 bg-[#0066FF] text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center shadow-sm">
                  <Printer className="w-4 h-4 mr-1.5" />
                  Cetak
                </button>
              </>
            )}
            <button
              onClick={() => navigate('/admin/surat-tugas/create')}
              className="w-full sm:w-auto px-3 py-2 bg-orange-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center shadow-sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Buat SPT
            </button>
          </div>
        </div>

        {/* Document Area */}
        {!activeSurat ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">Pilih surat tugas untuk melihat preview</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-8 pb-32">
            {/* A4 Paper */}
            <div className="min-w-[760px] max-w-[800px] mx-auto bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-200 px-6 sm:px-12 py-8 sm:py-14 relative min-h-[1000px]">
              
              {/* KOP SURAT */}
              <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-8">
                <div className="w-20 h-24 flex items-center justify-center">
                  <img src="/logo-sidoarjo.png" alt="Logo Sidoarjo" className="w-[72px] h-[72px] object-contain" />
                </div>
                <div className="flex-1 text-center px-4">
                  <h2 className="text-[17px] font-bold text-gray-800 tracking-wide">PEMERINTAH KABUPATEN SIDOARJO</h2>
                  <h1 className="text-[22px] font-bold text-[#1e3a8a] tracking-wider my-1">
                    DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL
                  </h1>
                  <p className="text-[11px] text-gray-600 mt-2 font-serif">
                    Jl. Jaksa Agung Suprapto No. 5, Sidoarjo 61218 — Telp. (031) 8921234 — Fax. (031) 8921235<br/>
                    Website: dukcapil.sidoarjokab.go.id — Email: dukcapil@sidoarjokab.go.id
                  </p>
                </div>
                <div className="w-20 h-24 flex items-center justify-center">
                  <img src="/logo-disdukcapil.png" alt="Logo Disdukcapil" className="w-[80px] h-[72px] object-contain" />
                </div>
              </div>

              {/* TITLE */}
              <div className="text-center mb-8">
                <h3 className="font-bold text-[17px] underline underline-offset-4 tracking-widest text-gray-900">SURAT PERINTAH TUGAS</h3>
                <p className="text-[13px] text-gray-700 mt-2">Nomor: <span className="font-bold">{activeSurat.nomor_surat}</span></p>
              </div>

              {/* DETAILS GRID */}
              <div className="grid grid-cols-[150px_20px_1fr] text-[13px] text-gray-800 mb-8 gap-y-3 font-serif">
                <div>Tanggal Surat</div>
                <div className="text-center">:</div>
                <div>{formatDateLong(activeSurat.tanggal_surat)}</div>

                <div>Dasar Penugasan</div>
                <div className="text-center">:</div>
                <div>{renderDasar(activeSurat.dasar_penugasan)}</div>
              </div>

              {/* PEGAWAI TABLE */}
              <div className="mb-8">
                <p className="text-[13px] font-bold text-gray-800 mb-3 font-serif tracking-wide">MENUGASKAN KEPADA:</p>
                <table className="w-full border-collapse text-[12px] font-serif">
                  <thead>
                    <tr className="bg-[#1e3a8a] text-white">
                      <th className="border border-gray-300 py-2 px-3 font-semibold text-center w-12">No.</th>
                      <th className="border border-gray-300 py-2 px-3 font-semibold text-left">Nama Pegawai</th>
                      <th className="border border-gray-300 py-2 px-3 font-semibold text-left">NIP</th>
                      <th className="border border-gray-300 py-2 px-3 font-semibold text-left">Pangkat/Gol</th>
                      <th className="border border-gray-300 py-2 px-3 font-semibold text-left">Jabatan</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-800">
                    {renderPegawaiRows(activeSurat.pegawai)}
                  </tbody>
                </table>
              </div>

              {/* TUGAS DETAILS */}
              <div className="mb-10">
                <p className="text-[13px] font-bold text-gray-800 mb-3 font-serif tracking-wide">UNTUK MELAKSANAKAN TUGAS:</p>
                <div className="grid grid-cols-[150px_20px_1fr] text-[13px] text-gray-800 gap-y-3 font-serif">
                  <div>Tujuan Tugas</div>
                  <div className="text-center">:</div>
                  <div>{activeSurat.tujuan_tugas || activeSurat.judul || '-'}</div>

                  <div>Tempat Tugas</div>
                  <div className="text-center">:</div>
                  <div>{activeSurat.tempat_tugas || '-'}</div>

                  <div>Tanggal Mulai</div>
                  <div className="text-center">:</div>
                  <div>{formatDateLong(activeSurat.tanggal_mulai)}</div>

                  <div>Tanggal Selesai</div>
                  <div className="text-center">:</div>
                  <div>{formatDateLong(activeSurat.tanggal_selesai)}</div>

                  <div>Kendaraan</div>
                  <div className="text-center">:</div>
                  <div>{activeSurat.kendaraan_dinas || '-'}</div>

                  <div>Biaya Perjalanan</div>
                  <div className="text-center">:</div>
                  <div>{activeSurat.sumber_biaya || '-'}</div>
                </div>
              </div>

              {/* PENUTUP */}
              <p className="text-[13px] text-gray-800 mb-12 font-serif text-justify leading-relaxed">
                Demikian Surat Perintah Tugas ini dibuat untuk dapat dilaksanakan dengan penuh tanggung jawab. Setelah selesai melaksanakan tugas, pegawai yang bersangkutan diwajibkan membuat laporan pelaksanaan tugas kepada Kepala Dinas.
              </p>

              {/* TANDA TANGAN */}
              <div className="flex justify-between text-[13px] text-gray-800 font-serif">
                <div className="w-[250px] text-center pt-8">
                  <p className="mb-1">Mengetahui,</p>
                  <p className="font-bold mb-20">{activeSurat.mengetahui_jabatan || 'Sekretaris Dinas'}</p>
                  <div className="border-b border-gray-400 mb-1">
                    <p className="font-bold">{activeSurat.mengetahui_nama || '-'}</p>
                  </div>
                  <p className="text-[11px] text-gray-600">NIP. {activeSurat.mengetahui_nip || '-'}</p>
                </div>

                <div className="w-[280px] text-center">
                  <p className="mb-1">Sidoarjo, {formatDateLong(activeSurat.tanggal_surat)}</p>
                  <p className="font-bold mb-4">Kepala Dinas Kependudukan<br/>dan Pencatatan Sipil<br/>Kabupaten Sidoarjo,</p>
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center opacity-50 border border-gray-200">
                    <User className="w-8 h-8 text-gray-300" />
                  </div>
                  <div className="border-b border-gray-400 mb-1">
                    <p className="font-bold">{activeSurat.penandatangan_nama || '-'}</p>
                  </div>
                  <p className="text-[11px] text-gray-600">NIP. {activeSurat.penandatangan_nip || '-'}</p>
                  <p className="text-[11px] text-gray-600">{activeSurat.penandatangan_jabatan || ''}</p>
                </div>
              </div>

              {/* WATERMARK/FOOTER */}
              <div className="absolute bottom-8 left-12 right-12 flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-100 pt-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-50 rounded flex items-center justify-center mr-2">
                    <FileText className="w-2.5 h-2.5 text-blue-400" />
                  </div>
                  Dokumen ini dicetak melalui SIPPMIT Dukcapil Sidoarjo
                </div>
                <div>Halaman 1 dari 1</div>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM ACTION BAR */}
        {activeSurat && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 md:px-6 py-3.5 flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-center text-xs sm:text-sm font-medium text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{activeSurat.status === 'Aktif' ? 'Dokumen telah diverifikasi sistem' : `Status: ${activeSurat.status}`}</span>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={handleShare}
                className="flex-1 sm:flex-none px-3 py-2 bg-white border border-gray-200 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center shadow-sm">
                <Share2 className="w-4 h-4 mr-1.5" />
                Bagikan
              </button>
              <button
                onClick={() => setEditSurat(activeSurat)}
                className="flex-1 sm:flex-none px-3 py-2 bg-white border border-gray-200 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center shadow-sm">
                <Edit className="w-4 h-4 mr-1.5" />
                Edit
              </button>
              <button
                onClick={() => navigate(`/print-spt/${activeSurat.id}`)}
                className="flex-1 sm:flex-none px-4 py-2 bg-[#0066FF] text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center shadow-sm">
                <Printer className="w-4 h-4 mr-1.5" />
                Cetak PDF
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {editSurat && (
        <EditModal surat={editSurat} onClose={() => setEditSurat(null)} onSave={handleSaveEdit} />
      )}
      {deleteSurat && (
        <DeleteModal surat={deleteSurat} onClose={() => setDeleteSurat(null)} onConfirm={handleDelete} />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};


export default AdminSuratTugas;
