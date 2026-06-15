import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, 
  Calendar, 
  Save, 
  Printer, 
  X, 
  User, 
  FileText,
  CheckCircle2,
  AlertTriangle,
  Minus,
  Plus,
  Maximize2,
  Search,
  MapPin,
  Car,
  Coins,
  Clock,
  RefreshCw,
  Loader2,
  Shield,
  Building
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

// ─── Format date helper ──────────────────────────────────────────────────────
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const calcDuration = (start, end) => {
  if (!start || !end) return null;
  const diff = new Date(end) - new Date(start);
  if (diff <= 0) return null;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 7) return `${days} Hari`;
  const weeks = Math.floor(days / 7);
  return days >= 30 ? `${Math.round(days / 30)} Bulan` : `${weeks} Minggu (${days} Hari)`;
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

// ─── Main Component ──────────────────────────────────────────────────────────
const AdminSuratTugasCreate = () => {
  const navigate = useNavigate();
  
  // Step control
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Seksi 1: Informasi Dasar ─────────────────────────────────────────────
  // Auto-generate tanggal surat = hari ini
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0]; // YYYY-MM-DD
  const bulanRomawiList = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
  const todayBulanRomawi = bulanRomawiList[today.getMonth()];
  const todayTahun = today.getFullYear().toString();

  const [nomorUrut, setNomorUrut] = useState('');
  const [nomorLoading, setNomorLoading] = useState(true);
  const [bulanRomawi, setBulanRomawi] = useState(todayBulanRomawi);
  const [tahun, setTahun] = useState(todayTahun);
  const [tanggalSurat, setTanggalSurat] = useState(todayISO);
  const [dasarPenugasan, setDasarPenugasan] = useState(
    '1. Peraturan Bupati Sidoarjo Nomor 23 Tahun 2024 tentang Pengelolaan Peserta Magang;\n2. Surat Keputusan Kepala Dinas Nomor 01/SK/DUKCAPIL/2025 tentang Program Magang Terintegrasi.'
  );

  const nomorLengkap = `SPT/${nomorUrut || '...'} /${bulanRomawi}/${tahun}`;

  // ── Seksi 4: Pejabat list (untuk dropdown) ──────────────────────────────
  const [pejabatList, setPejabatList] = useState([]);
  const [pejabatLoading, setPejabatLoading] = useState(true);

  // ── Seksi 2: Pegawai ─────────────────────────────────────────────────────
  const [pegawaiList, setPegawaiList] = useState([
    { nama: '', nip: '', pangkat: '', jabatan: '' }
  ]);
  const [pegawaiSearch, setPegawaiSearch] = useState('');
  const [pegawaiSuggestions, setPegawaiSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);
  const searchTimeout = useRef(null);
  const [activePegawaiIndex, setActivePegawaiIndex] = useState(null);

  // ── Seksi 3: Detail Tugas ────────────────────────────────────────────────
  const [tujuanTugas, setTujuanTugas] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [tempatTugas, setTempatTugas] = useState('Kantor Dinas Dukcapil Sidoarjo');
  const [kendaraanDinas, setKendaraanDinas] = useState('');
  const [sumberBiaya, setSumberBiaya] = useState('Dibebankan pada DPA Dinas Dukcapil Sidoarjo');

  // ── Seksi 4: Pengesahan ──────────────────────────────────────────────────
  const [penandatanganNama, setPenandatanganNama] = useState('');
  const [penandatanganNip, setPenandatanganNip] = useState('');
  const [penandatanganJabatan, setPenandatanganJabatan] = useState('Kepala Dinas Dukcapil Kab. Sidoarjo');
  const [penandatanganPangkat, setPenandatanganPangkat] = useState('');
  const [mengetahuiNama, setMengetahuiNama] = useState('');
  const [mengetahuiNip, setMengetahuiNip] = useState('');
  const [mengetahuiJabatan, setMengetahuiJabatan] = useState('Sekretaris Dinas');

  // Dropdown search states for Seksi 4
  const [penandatanganSearch, setPenandatanganSearch] = useState('');
  const [penandatanganOpen, setPenandatanganOpen] = useState(false);
  const [mengetahuiSearch, setMengetahuiSearch] = useState('');
  const [mengetahuiOpen, setMengetahuiOpen] = useState(false);
  const penandatanganRef = useRef(null);
  const mengetahuiRef = useRef(null);

  // ── Step helpers ─────────────────────────────────────────────────────────
  const getStepStatusClass = (step) => {
    if (currentStep === step) return 'bg-[#1e3a8a] text-white shadow-md';
    if (currentStep > step) return 'bg-[#1e3a8a] text-white opacity-50';
    return 'bg-gray-100 text-gray-500 border border-gray-200';
  };
  const getStepTextClass = (step) => {
    if (currentStep === step) return 'text-[#1e3a8a] font-bold';
    if (currentStep > step) return 'text-[#1e3a8a] font-bold opacity-50';
    return 'text-gray-500 font-bold';
  };

  // ── Auto-generate nomor surat dari Supabase ───────────────────────────────
  useEffect(() => {
    const generateNomor = async () => {
      setNomorLoading(true);
      // Hitung jumlah surat bulan ini untuk nomor urut
      const startOfMonth = `${tahun}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
      const { count } = await supabase
        .from('surat_tugas')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startOfMonth)
        .lte('created_at', endOfMonth + 'T23:59:59');
      const nextNum = String((count || 0) + 1).padStart(3, '0');
      setNomorUrut(nextNum);
      setNomorLoading(false);
    };
    generateNomor();
  }, []);

  // ── Fetch daftar pejabat untuk dropdown Seksi 4 ───────────────────────────
  useEffect(() => {
    const fetchPejabat = async () => {
      setPejabatLoading(true);
      // Coba dari tabel profiles (role admin) terlebih dahulu
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name, nama, nip, jabatan, pangkat, role')
        .in('role', ['admin', 'pejabat', 'kepala'])
        .order('full_name');

      if (profileData && profileData.length > 0) {
        setPejabatList(profileData.map(p => ({
          id: p.id,
          nama: p.full_name || p.nama || '',
          nip: p.nip || '',
          jabatan: p.jabatan || '',
          pangkat: p.pangkat || '',
        })));
      } else {
        // Fallback: data pejabat statis Dukcapil Sidoarjo
        setPejabatList([
          { id: '1', nama: 'Siti Rahayu, S.STP., M.Si', nip: '19750620 199603 2 001', jabatan: 'Kepala Dinas Dukcapil Kab. Sidoarjo', pangkat: 'Pembina Utama Muda / IV-c' },
          { id: '2', nama: 'Drs. Hendra Wijaya, M.M', nip: '19720815 199803 1 004', jabatan: 'Sekretaris Dinas', pangkat: 'Pembina Tk. I / IV-b' },
          { id: '3', nama: 'Drs. Ahmad Fauzi, M.Si', nip: '19780512 200501 1 003', jabatan: 'Kabid Pelayanan Pendaftaran', pangkat: 'Pembina / IV-a' },
          { id: '4', nama: 'Ir. Dewi Kusuma, M.T', nip: '19830721 201001 2 007', jabatan: 'Kabid TI dan Jaringan', pangkat: 'Penata Tk. I / III-d' },
          { id: '5', nama: 'Novi Arisandi, S.H', nip: '19860505 200901 2 004', jabatan: 'Kabid Pencatatan Sipil', pangkat: 'Penata / III-c' },
        ]);
      }
      setPejabatLoading(false);
    };
    fetchPejabat();
  }, []);

  // ── Close dropdown on outside click ──────────────────────────────────────
  useEffect(() => {
    const handleClick = (e) => {
      if (penandatanganRef.current && !penandatanganRef.current.contains(e.target)) {
        setPenandatanganOpen(false);
      }
      if (mengetahuiRef.current && !mengetahuiRef.current.contains(e.target)) {
        setMengetahuiOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);


  // ── Pegawai: search from Supabase (pesertas) ─────────────────────────────
  const searchPegawai = async (q) => {
    if (!q || q.length < 2) { setPegawaiSuggestions([]); return; }
    setSearchLoading(true);
    const { data, error } = await supabase
      .from('pesertas')
      .select('id, nama, no_hp, email, asal_instansi, bidang_tujuan')
      .ilike('nama', `%${q}%`)
      .limit(6);

    if (!error && data) {
      setPegawaiSuggestions(data);
    }
    setSearchLoading(false);
  };

  const handlePegawaiSearchChange = (e) => {
    const val = e.target.value;
    setPegawaiSearch(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => searchPegawai(val), 300);
  };

  const selectPegawai = (p) => {
    if (activePegawaiIndex !== null) {
      const updated = [...pegawaiList];
      updated[activePegawaiIndex] = {
        ...updated[activePegawaiIndex],
        nama: p.nama || '',
        nip: p.no_hp || '',
        jabatan: p.bidang_tujuan || '',
        pangkat: p.asal_instansi || '',
      };
      setPegawaiList(updated);
    } else {
      setPegawaiList(prev => [
        ...prev.slice(0, -1),
        { nama: p.nama || '', nip: p.no_hp || '', jabatan: p.bidang_tujuan || '', pangkat: p.asal_instansi || '' }
      ]);
    }
    setPegawaiSearch('');
    setPegawaiSuggestions([]);
    setActivePegawaiIndex(null);
  };

  const addPegawai = () => {
    setPegawaiList(prev => [...prev, { nama: '', nip: '', pangkat: '', jabatan: '' }]);
  };

  const removePegawai = (index) => {
    if (pegawaiList.length === 1) return;
    setPegawaiList(prev => prev.filter((_, i) => i !== index));
  };

  const updatePegawai = (index, field, value) => {
    const updated = [...pegawaiList];
    updated[index][field] = value;
    setPegawaiList(updated);
  };

  // ── Validation check ─────────────────────────────────────────────────────
  const isStep1Valid = nomorUrut.trim() && tanggalSurat;
  const isStep2Valid = pegawaiList.some(p => p.nama.trim());
  const isStep3Valid = tujuanTugas.trim() && tanggalMulai && tanggalSelesai;
  const allValid = isStep1Valid && isStep2Valid && isStep3Valid;

  // ── Save to Supabase ─────────────────────────────────────────────────────
  const handleSave = async (status) => {
    if (!isStep1Valid) {
      showToast('Nomor surat belum di-generate, tunggu sebentar!', 'error');
      setCurrentStep(1);
      return;
    }

    setSaving(true);
    const payload = {
      nomor_surat: nomorLengkap,
      judul: tujuanTugas || 'Surat Perintah Tugas',
      tanggal_surat: tanggalSurat || null,
      dasar_penugasan: dasarPenugasan,
      tujuan_tugas: tujuanTugas,
      tempat_tugas: tempatTugas,
      tanggal_mulai: tanggalMulai || null,
      tanggal_selesai: tanggalSelesai || null,
      kendaraan_dinas: kendaraanDinas,
      sumber_biaya: sumberBiaya,
      penandatangan_nama: penandatanganNama,
      penandatangan_nip: penandatanganNip,
      penandatangan_jabatan: penandatanganJabatan,
      mengetahui_nama: mengetahuiNama,
      mengetahui_nip: mengetahuiNip,
      mengetahui_jabatan: mengetahuiJabatan,
      pegawai: pegawaiList.filter(p => p.nama.trim()),
      status: status,
    };

    const { data, error } = await supabase
      .from('surat_tugas')
      .insert([payload])
      .select()
      .single();

    setSaving(false);

    if (error) {
      showToast('Gagal menyimpan: ' + error.message, 'error');
      return;
    }

    if (status === 'Draft') {
      showToast('Draft berhasil disimpan!');
      setTimeout(() => navigate('/admin/surat-tugas'), 1500);
    } else {
      showToast('Surat tugas berhasil disimpan!');
      setTimeout(() => navigate(`/print-spt/${data.id}`), 1200);
    }
  };

  const duration = calcDuration(tanggalMulai, tanggalSelesai);

  const bulanRomawiOptions = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];

  // ── PejabatDropdown component (inline) ───────────────────────────────────
  const PejabatDropdown = ({ label, required, description, searchVal, setSearchVal, isOpen, setIsOpen, dropRef, onSelect, selectedNama, selectedNip, selectedJabatan, selectedPangkat, placeholder }) => {
    const filtered = pejabatList.filter(p =>
      p.nama.toLowerCase().includes(searchVal.toLowerCase()) ||
      p.nip.includes(searchVal) ||
      (p.jabatan || '').toLowerCase().includes(searchVal.toLowerCase())
    );
    return (
      <div className="space-y-3">
        <div>
          <h4 className="text-xs font-bold text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</h4>
          <p className="text-[10px] text-gray-400">{description}</p>
        </div>

        {/* Dropdown trigger / search */}
        <div className="relative" ref={dropRef}>
          <label className="block text-[11px] text-gray-500 mb-1.5">Nama Lengkap {required && <span className="text-red-400">*</span>}</label>
          <div
            className={`w-full flex items-center border rounded-xl px-4 py-2.5 cursor-pointer transition-colors ${
              isOpen ? 'border-blue-400 ring-2 ring-blue-100 bg-white' : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {selectedNama ? (
              <div className="flex items-center flex-1 gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                  {selectedNama[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{selectedNama}</p>
                  <p className="text-[10px] text-gray-400 truncate">{selectedJabatan}</p>
                </div>
              </div>
            ) : (
              <span className="text-sm text-gray-400 flex-1">{placeholder}</span>
            )}
            <ChevronRight className={`w-4 h-4 text-gray-400 ml-2 flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          </div>

          {/* Dropdown panel */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
              {/* Search inside dropdown */}
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Cari nama atau jabatan..."
                    value={searchVal}
                    onChange={e => setSearchVal(e.target.value)}
                    onClick={e => e.stopPropagation()}
                    className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              </div>
              {/* List */}
              <div className="max-h-52 overflow-y-auto">
                {pejabatLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="py-6 text-center text-sm text-gray-400">Tidak ada data ditemukan</div>
                ) : (
                  filtered.map(p => (
                    <button
                      key={p.id}
                      onClick={(e) => { e.stopPropagation(); onSelect(p); setIsOpen(false); setSearchVal(''); }}
                      className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0 ${
                        selectedNama === p.nama ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                          {p.nama?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">{p.nama}</p>
                          <p className="text-[11px] text-gray-400">{p.jabatan}</p>
                        </div>
                        {selectedNama === p.nama && (
                          <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* NIP (auto-fill, readonly) */}
        <div>
          <label className="block text-[11px] text-gray-500 mb-1.5">NIP</label>
          <div className="relative">
            <input
              readOnly
              value={selectedNip}
              placeholder="Terisi otomatis setelah memilih nama"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
            />
            {selectedNip && (
              <CheckCircle2 className="w-4 h-4 text-green-500 absolute right-3 top-1/2 -translate-y-1/2" />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-full font-poppins gap-6">
      
      {/* LEFT PANEL: Form Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Breadcrumbs & Title */}
        <div className="mb-6">
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/admin')}>Home</span>
            <ChevronRight className="w-3 h-3 mx-1" />
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/admin/surat-tugas')}>Surat Tugas</span>
            <ChevronRight className="w-3 h-3 mx-1" />
            <span className="font-semibold text-blue-600">Buat Baru</span>
          </div>
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-gray-800 mr-3">Form Pembuatan Surat Perintah Tugas</h2>
            <span className="px-2.5 py-1 text-[11px] font-semibold text-green-700 bg-green-100 rounded-full border border-green-200">Baru</span>
          </div>
        </div>

        {/* Stepper */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-gray-100 -translate-y-1/2 z-0"></div>
          {[
            { step: 1, label: 'Informasi Dasar', sub: 'Nomor & tanggal' },
            { step: 2, label: 'Detail Pegawai', sub: 'Data penugasan' },
            { step: 3, label: 'Detail Tugas', sub: 'Tujuan & jadwal' },
            { step: 4, label: 'Pengesahan', sub: 'Penandatangan' },
          ].map(({ step, label, sub }) => (
            <div key={step} className="flex items-center bg-white px-2 z-10 cursor-pointer" onClick={() => setCurrentStep(step)}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all ${getStepStatusClass(step)}`}>{step}</div>
              <div className="ml-3">
                <p className={`text-xs transition-all ${getStepTextClass(step)}`}>{label}</p>
                <p className="text-[10px] text-gray-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* SECTIONS */}
        <div className="flex-1 overflow-y-auto mb-6 pr-2">

          {/* SEKSI 1: Informasi Dasar */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-[#1e3a8a] px-6 py-4 flex justify-between items-center text-white">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold mr-3">1</div>
                  <div>
                    <h3 className="font-bold text-sm">Seksi 1: Informasi Dasar</h3>
                    <p className="text-[11px] text-blue-100 opacity-90">Isi data identitas surat perintah tugas</p>
                  </div>
                </div>
                {isStep1Valid && (
                  <div className="flex items-center text-[11px] font-medium text-green-300">
                    <div className="w-2 h-2 rounded-full bg-green-400 mr-1.5"></div>
                    Lengkap
                  </div>
                )}
              </div>

              <div className="p-8 space-y-8">
                {/* Nomor Surat — Auto Generated */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-gray-700">Nomor Surat</label>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      <div className={`w-1.5 h-1.5 rounded-full ${nomorLoading ? 'bg-blue-400 animate-pulse' : 'bg-green-400'}`}></div>
                      {nomorLoading ? 'Generating...' : 'Auto-generated'}
                    </span>
                  </div>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                    <div className="px-4 py-3 text-sm text-gray-500 font-medium border-r border-gray-200 bg-gray-100/70 whitespace-nowrap">SPT/</div>
                    <div className="flex-1 px-4 py-3 text-sm font-bold text-gray-700 bg-gray-50">
                      {nomorLoading ? (
                        <span className="text-gray-400 flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Memuat nomor urut...
                        </span>
                      ) : nomorUrut}
                    </div>
                    <div className="px-2 py-3 text-sm text-gray-400 border-l border-gray-200 bg-gray-100/70">/</div>
                    <select
                      value={bulanRomawi}
                      onChange={e => setBulanRomawi(e.target.value)}
                      className="px-2 py-3 text-sm text-gray-700 bg-gray-100/70 border-l border-gray-200 focus:outline-none"
                    >
                      {bulanRomawiOptions.map(b => <option key={b}>{b}</option>)}
                    </select>
                    <div className="px-2 py-3 text-sm text-gray-400 border-l border-gray-200 bg-gray-100/70">/</div>
                    <div className="w-16 px-3 py-3 text-sm text-gray-700 bg-gray-50 border-l border-gray-200 font-medium">{tahun}</div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">
                    Nomor urut di-generate otomatis berdasarkan surat bulan ini.
                    {!nomorLoading && <> Preview: <strong>{nomorLengkap}</strong></>}
                  </p>
                </div>

                {/* Tanggal Surat — Auto set to today, masih bisa diubah */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-gray-700">Tanggal Surat</label>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                      <CheckCircle2 className="w-3 h-3" /> Hari ini
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-blue-500" />
                    </div>
                    <input 
                      type="date" 
                      value={tanggalSurat}
                      onChange={(e) => setTanggalSurat(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors text-gray-700"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">Terisi otomatis dengan tanggal hari ini. Dapat diubah jika diperlukan.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Dasar Penugasan <span className="text-red-500">*</span></label>
                  <textarea 
                    rows={5}
                    value={dasarPenugasan}
                    onChange={(e) => setDasarPenugasan(e.target.value)}
                    className="w-full p-4 bg-white border border-gray-300 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors text-gray-700 leading-relaxed"
                  ></textarea>
                  <p className="text-[10px] text-gray-400 mt-2">Pisahkan setiap dasar hukum dengan baris baru. Mulai tiap baris dengan angka.</p>
                </div>
              </div>
            </div>
          )}

          {/* SEKSI 2: Detail Pegawai */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-[#2546a3] px-6 py-4 flex justify-between items-center text-white">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold mr-3">2</div>
                  <div>
                    <h3 className="font-bold text-sm">Seksi 2: Detail Pegawai</h3>
                    <p className="text-[11px] text-blue-100 opacity-90">Tambahkan pegawai yang ditugaskan</p>
                  </div>
                </div>
                <button onClick={addPegawai} className="flex items-center bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-white/20">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Tambah Pegawai
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Search Pegawai */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Cari & Pilih Peserta/Pegawai (opsional)</label>
                  <div className="relative" ref={searchRef}>
                    <Search className="w-4 h-4 text-blue-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Ketik nama peserta untuk mencari dari database..."
                      value={pegawaiSearch}
                      onChange={handlePegawaiSearchChange}
                      onFocus={() => setActivePegawaiIndex(null)}
                      className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                    />
                    {searchLoading && (
                      <Loader2 className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 animate-spin" />
                    )}
                    {pegawaiSuggestions.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                        {pegawaiSuggestions.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => selectPegawai(p)}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-600 font-bold text-xs">
                                {p.nama?.[0] || '?'}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{p.nama}</p>
                                <p className="text-xs text-gray-400">{p.asal_instansi} — {p.bidang_tujuan}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5">Atau isi data pegawai secara manual di bawah ini.</p>
                </div>

                {/* Pegawai Cards */}
                {pegawaiList.map((pegawai, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-5 relative bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    {pegawaiList.length > 1 && (
                      <button
                        onClick={() => removePegawai(index)}
                        className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div className="flex items-center mb-4">
                      <div className="w-6 h-6 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-[10px] font-bold mr-2">{index + 1}</div>
                      <span className="text-xs font-bold text-gray-500 tracking-wider">PEGAWAI {index + 1}</span>
                      <button
                        onClick={() => {
                          setActivePegawaiIndex(index);
                          setPegawaiSearch('');
                          document.querySelector('input[placeholder*="Ketik nama"]')?.focus();
                        }}
                        className="ml-auto flex items-center text-[11px] text-blue-500 hover:text-blue-700 font-medium gap-1"
                      >
                        <Search className="w-3 h-3" /> Cari dari database
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] text-gray-500 mb-1.5">Nama Pegawai <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          placeholder="Nama lengkap"
                          value={pegawai.nama}
                          onChange={e => updatePegawai(index, 'nama', e.target.value)}
                          className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-500 mb-1.5">NIP</label>
                        <input
                          type="text"
                          placeholder="NIP pegawai"
                          value={pegawai.nip}
                          onChange={e => updatePegawai(index, 'nip', e.target.value)}
                          className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-500 mb-1.5">Pangkat / Golongan</label>
                        <input
                          type="text"
                          placeholder="Penata / III-c"
                          value={pegawai.pangkat}
                          onChange={e => updatePegawai(index, 'pangkat', e.target.value)}
                          className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-500 mb-1.5">Jabatan</label>
                        <input
                          type="text"
                          placeholder="Jabatan di instansi"
                          value={pegawai.jabatan}
                          onChange={e => updatePegawai(index, 'jabatan', e.target.value)}
                          className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add More Button */}
                <button
                  onClick={addPegawai}
                  className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-sm font-medium text-gray-400 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-500 transition-all">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Pegawai Lainnya
                </button>
              </div>
            </div>
          )}

          {/* SEKSI 3: Detail Penugasan */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-[#1e4ed8] px-6 py-4 flex justify-between items-center text-white">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold mr-3">3</div>
                  <div>
                    <h3 className="font-bold text-sm">Seksi 3: Detail Penugasan</h3>
                    <p className="text-[11px] text-blue-100 opacity-90">Tujuan, jadwal, dan kendaraan dinas</p>
                  </div>
                </div>
                {isStep3Valid && (
                  <div className="flex items-center text-[11px] font-medium text-green-300">
                    <div className="w-2 h-2 rounded-full bg-green-400 mr-1.5"></div>
                    Lengkap
                  </div>
                )}
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Tujuan / Maksud Tugas <span className="text-red-500">*</span></label>
                  <textarea 
                    rows={3}
                    value={tujuanTugas}
                    onChange={(e) => setTujuanTugas(e.target.value)}
                    placeholder="Contoh: Pendampingan dan Monitoring Peserta Magang Batch II..."
                    className="w-full p-4 bg-white border border-gray-300 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors text-gray-700"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Tanggal Mulai <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-green-500" />
                      </div>
                      <input 
                        type="date" 
                        value={tanggalMulai}
                        onChange={(e) => setTanggalMulai(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors text-gray-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Tanggal Selesai <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-red-400" />
                      </div>
                      <input 
                        type="date" 
                        value={tanggalSelesai}
                        onChange={(e) => setTanggalSelesai(e.target.value)}
                        min={tanggalMulai}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors text-gray-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Durasi Banner */}
                {duration && (
                  <div className="bg-[#f0f5ff] rounded-xl p-4 flex items-center justify-between border border-blue-100">
                    <div className="flex items-center text-sm font-bold text-blue-700">
                      <Clock className="w-5 h-5 mr-2 text-blue-500" />
                      Durasi tugas: {duration}
                    </div>
                    <span className="text-xs text-blue-500 font-medium bg-blue-100/50 px-3 py-1 rounded-full">
                      {formatDate(tanggalMulai)} — {formatDate(tanggalSelesai)}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Tempat Tugas <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        value={tempatTugas}
                        onChange={(e) => setTempatTugas(e.target.value)}
                        placeholder="Lokasi pelaksanaan tugas"
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors text-gray-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Kendaraan Dinas</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Car className="h-4 w-4 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        value={kendaraanDinas}
                        onChange={(e) => setKendaraanDinas(e.target.value)}
                        placeholder="Kendaraan Roda 4 — W 1234 AB"
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors text-gray-700"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Sumber Biaya Perjalanan</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Coins className="h-4 w-4 text-yellow-500" />
                    </div>
                    <input 
                      type="text" 
                      value={sumberBiaya}
                      onChange={(e) => setSumberBiaya(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors text-gray-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEKSI 4: Pengesahan */}
          {currentStep === 4 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-[#2563eb] px-6 py-4 flex justify-between items-center text-white">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold mr-3">4</div>
                  <div>
                    <h3 className="font-bold text-sm">Seksi 4: Pengesahan</h3>
                    <p className="text-[11px] text-blue-100 opacity-90">Isi data pejabat penandatangan surat</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Penandatangan Utama — Dropdown */}
                  <PejabatDropdown
                    label="Penandatangan Utama"
                    required={true}
                    description="Kepala Dinas / Pejabat Berwenang"
                    searchVal={penandatanganSearch}
                    setSearchVal={setPenandatanganSearch}
                    isOpen={penandatanganOpen}
                    setIsOpen={setPenandatanganOpen}
                    dropRef={penandatanganRef}
                    onSelect={(p) => {
                      setPenandatanganNama(p.nama);
                      setPenandatanganNip(p.nip);
                      setPenandatanganJabatan(p.jabatan || penandatanganJabatan);
                      setPenandatanganPangkat(p.pangkat || '');
                    }}
                    selectedNama={penandatanganNama}
                    selectedNip={penandatanganNip}
                    selectedJabatan={penandatanganJabatan}
                    selectedPangkat={penandatanganPangkat}
                    placeholder="Pilih pejabat penandatangan..."
                  />

                  {/* Mengetahui — Dropdown */}
                  <PejabatDropdown
                    label="Mengetahui / Atasan Langsung"
                    required={false}
                    description="Sekretaris Dinas (opsional)"
                    searchVal={mengetahuiSearch}
                    setSearchVal={setMengetahuiSearch}
                    isOpen={mengetahuiOpen}
                    setIsOpen={setMengetahuiOpen}
                    dropRef={mengetahuiRef}
                    onSelect={(p) => {
                      setMengetahuiNama(p.nama);
                      setMengetahuiNip(p.nip);
                      setMengetahuiJabatan(p.jabatan || mengetahuiJabatan);
                    }}
                    selectedNama={mengetahuiNama}
                    selectedNip={mengetahuiNip}
                    selectedJabatan={mengetahuiJabatan}
                    selectedPangkat=""
                    placeholder="Pilih pejabat mengetahui..."
                  />
                </div>

                {/* Jabatan fields (editable, muncul setelah dropdown dipilih) */}
                {(penandatanganNama || mengetahuiNama) && (
                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                    {penandatanganNama && (
                      <div className="space-y-3">
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Jabatan Penandatangan</p>
                        <div>
                          <label className="block text-[11px] text-gray-500 mb-1.5">Jabatan</label>
                          <input value={penandatanganJabatan} onChange={e => setPenandatanganJabatan(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white text-gray-800" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-500 mb-1.5">Pangkat / Golongan</label>
                          <input value={penandatanganPangkat} onChange={e => setPenandatanganPangkat(e.target.value)}
                            placeholder="Pembina Utama Muda / IV-c"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white text-gray-800" />
                        </div>
                      </div>
                    )}
                    {mengetahuiNama && (
                      <div className="space-y-3">
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Jabatan Mengetahui</p>
                        <div>
                          <label className="block text-[11px] text-gray-500 mb-1.5">Jabatan</label>
                          <input value={mengetahuiJabatan} onChange={e => setMengetahuiJabatan(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white text-gray-800" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tanggal Penandatanganan */}
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Tempat Penandatanganan</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        value="Sidoarjo"
                        readOnly
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 text-sm rounded-xl text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Tanggal Penandatanganan</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-blue-500" />
                      </div>
                      <input 
                        type="date" 
                        value={tanggalSurat}
                        onChange={(e) => setTanggalSurat(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors text-gray-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(s => s - 1)}
                className="px-4 py-2.5 bg-white border border-gray-300 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                ← Sebelumnya
              </button>
            )}
            <div className="flex items-center text-xs text-gray-500">
              <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-2 text-gray-400 font-bold">i</div>
              Field bertanda <span className="text-red-500 mx-1">*</span> wajib diisi
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => navigate('/admin/surat-tugas')}
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center">
              <X className="w-4 h-4 mr-2" />
              Batal
            </button>
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(s => s + 1)}
                className="px-6 py-2.5 bg-[#1e3a8a] text-white text-sm font-semibold rounded-xl hover:bg-blue-900 transition-colors flex items-center shadow-md">
                Lanjut →
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleSave('Draft')}
                  disabled={saving}
                  className="px-5 py-2.5 bg-yellow-50 border border-yellow-400 text-yellow-700 text-sm font-semibold rounded-xl hover:bg-yellow-100 transition-colors flex items-center disabled:opacity-60">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Simpan Draft
                </button>
                <button
                  onClick={() => handleSave('Aktif')}
                  disabled={saving || !allValid}
                  className="px-6 py-2.5 bg-[#1e3a8a] text-white text-sm font-semibold rounded-xl hover:bg-blue-900 transition-colors flex items-center shadow-md disabled:opacity-60">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Printer className="w-4 h-4 mr-2" />}
                  Simpan & Cetak
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Live Preview */}
      <div className="w-[420px] flex-shrink-0 flex flex-col gap-6">
        
        {/* Live Preview Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden flex flex-col h-[620px]">
          {/* Mac-style Header */}
          <div className="bg-[#1e293b] px-4 py-3 flex items-center justify-between">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center text-gray-300 text-xs font-semibold">
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Preview Dokumen (Live)
            </div>
            <div className="flex items-center text-[10px] font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse"></div>
              Realtime
            </div>
          </div>
          
          {/* Zoom Controls */}
          <div className="bg-slate-800 px-4 py-2 flex items-center justify-between text-xs text-gray-300 border-b border-slate-700">
            <div className="flex items-center space-x-1 bg-slate-900 rounded-lg p-1">
              <span className="px-2 font-mono">45%</span>
            </div>
            <span className="font-medium text-slate-400">A4 — Portrait</span>
            <span className="text-slate-400">Live</span>
          </div>

          {/* Preview Container */}
          <div className="flex-1 bg-[#eef1f6] overflow-hidden flex items-start justify-center p-4 relative">
            
            {/* The scaled A4 Paper */}
            <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-[800px] h-[1131px] origin-top scale-[0.45] bg-white shadow-xl border border-gray-200 rounded px-10 py-12"
              style={{ fontFamily: "'Times New Roman', Times, serif" }}>
              
              {/* KOP SURAT */}
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '3px solid #000', paddingBottom: '10px', marginBottom: '0' }}>
                <div style={{ flexShrink: 0, width: '72px' }}>
                  <img src="/logo-sidoarjo.png" alt="Logo" style={{ width: '68px', height: '68px', objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1, textAlign: 'center', padding: '0 10px' }}>
                  <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', color: '#111' }}>
                    PEMERINTAH KABUPATEN SIDOARJO
                  </div>
                  <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', color: '#1e3a8a', margin: '2px 0' }}>
                    DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL
                  </div>
                  <div style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '11px', color: '#555', lineHeight: '1.5', marginTop: '4px' }}>
                    Jl. Jaksa Agung Suprapto No. 5, Sidoarjo 61218<br/>
                    Telp. (031) 8921234 — Fax. (031) 8921235 — Email: dukcapil@sidoarjokab.go.id
                  </div>
                </div>
                <div style={{ flexShrink: 0, width: '72px', textAlign: 'right' }}>
                  <img src="/logo-disdukcapil.png" alt="Logo" style={{ width: '72px', height: '68px', objectFit: 'contain', marginLeft: 'auto' }} />
                </div>
              </div>
              <div style={{ borderBottom: '1px solid #000', marginBottom: '16px' }}></div>

              {/* JUDUL */}
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '16px', fontWeight: 'bold', textDecoration: 'underline', textUnderlineOffset: '4px', letterSpacing: '4px', textTransform: 'uppercase' }}>
                  SURAT PERINTAH TUGAS
                </div>
                <div style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '13px', marginTop: '8px' }}>
                  Nomor : <span style={{ fontWeight: 'bold' }}>{nomorLengkap}</span>
                </div>
              </div>

              {/* TANGGAL & DASAR */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px', fontFamily: "'Times New Roman', Times, serif", fontSize: '13px' }}>
                <tbody>
                  <tr style={{ verticalAlign: 'top' }}>
                    <td style={{ width: '120px', paddingBottom: '6px' }}>Tanggal Surat</td>
                    <td style={{ width: '16px', paddingBottom: '6px' }}>:</td>
                    <td style={{ paddingBottom: '6px' }}>{formatDate(tanggalSurat)}</td>
                  </tr>
                  <tr style={{ verticalAlign: 'top' }}>
                    <td>Dasar</td>
                    <td>:</td>
                    <td>
                      <div style={{ whiteSpace: 'pre-wrap', textAlign: 'justify', fontSize: '12px', lineHeight: '1.7' }}>{dasarPenugasan}</div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* MEMERINTAHKAN */}
              <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px', letterSpacing: '4px', margin: '18px 0 10px', fontFamily: "'Times New Roman', Times, serif" }}>
                MEMERINTAHKAN
              </div>

              {/* KEPADA */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8px', fontFamily: "'Times New Roman', Times, serif", fontSize: '13px' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '120px', fontWeight: 'bold' }}>Kepada</td>
                    <td style={{ width: '16px', fontWeight: 'bold' }}>:</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>

              {/* TABEL PEGAWAI */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px', fontFamily: "'Times New Roman', Times, serif", fontSize: '12px' }}>
                <thead>
                  <tr>
                    {['No','Nama','NIP','Pangkat/Gol.','Jabatan'].map(h => (
                      <th key={h} style={{ backgroundColor: '#1e3a8a', color: 'white', border: '1px solid #374151', padding: '6px 8px', textAlign: h === 'No' ? 'center' : 'left', fontFamily: 'Arial, sans-serif', fontSize: '11px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pegawaiList.filter(p => p.nama).length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center', color: '#9ca3af', fontStyle: 'italic' }}>
                        Belum ada pegawai
                      </td>
                    </tr>
                  ) : (
                    pegawaiList.filter(p => p.nama).map((p, i) => (
                      <tr key={i}>
                        <td style={{ border: '1px solid #d1d5db', padding: '5px 8px', textAlign: 'center', backgroundColor: i % 2 === 1 ? '#f9fafb' : 'white' }}>{i+1}</td>
                        <td style={{ border: '1px solid #d1d5db', padding: '5px 8px', fontWeight: 'bold', backgroundColor: i % 2 === 1 ? '#f9fafb' : 'white' }}>{p.nama}</td>
                        <td style={{ border: '1px solid #d1d5db', padding: '5px 8px', backgroundColor: i % 2 === 1 ? '#f9fafb' : 'white' }}>{p.nip || '-'}</td>
                        <td style={{ border: '1px solid #d1d5db', padding: '5px 8px', backgroundColor: i % 2 === 1 ? '#f9fafb' : 'white' }}>{p.pangkat || '-'}</td>
                        <td style={{ border: '1px solid #d1d5db', padding: '5px 8px', backgroundColor: i % 2 === 1 ? '#f9fafb' : 'white' }}>{p.jabatan || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* UNTUK */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8px', fontFamily: "'Times New Roman', Times, serif", fontSize: '13px' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '120px', fontWeight: 'bold' }}>Untuk</td>
                    <td style={{ width: '16px', fontWeight: 'bold' }}>:</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>

              {/* ISI TUGAS */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px', fontFamily: "'Times New Roman', Times, serif", fontSize: '13px' }}>
                <tbody>
                  {[
                    ['Tujuan / Maksud', tujuanTugas || '...'],
                    ['Tempat Tugas', tempatTugas || '...'],
                    ['Tanggal', `${formatDate(tanggalMulai) || '?'} s.d. ${formatDate(tanggalSelesai) || '?'}`],
                    ...(kendaraanDinas ? [['Kendaraan Dinas', kendaraanDinas]] : []),
                    ...(sumberBiaya ? [['Biaya Perjalanan', sumberBiaya]] : []),
                  ].map(([label, val]) => (
                    <tr key={label} style={{ verticalAlign: 'top' }}>
                      <td style={{ width: '130px', paddingBottom: '6px' }}>{label}</td>
                      <td style={{ width: '16px', paddingBottom: '6px' }}>:</td>
                      <td style={{ paddingBottom: '6px', textAlign: 'justify', lineHeight: '1.7' }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* PENUTUP */}
              <p style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '13px', textAlign: 'justify', lineHeight: '1.8', marginBottom: '28px' }}>
                Demikian Surat Perintah Tugas ini dibuat untuk dapat dilaksanakan dengan penuh tanggung jawab. Setelah selesai melaksanakan tugas, pegawai yang bersangkutan diwajibkan membuat laporan pelaksanaan tugas kepada Kepala Dinas.
              </p>

              {/* TANDA TANGAN */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Times New Roman', Times, serif", fontSize: '13px' }}>
                <div style={{ width: '42%', textAlign: 'center' }}>
                  <div>Mengetahui,</div>
                  <div style={{ marginBottom: '70px', marginTop: '2px' }}>{mengetahuiJabatan || 'Sekretaris Dinas'}</div>
                  <div style={{ borderBottom: '1.5px solid #374151', display: 'inline-block', minWidth: '180px', paddingBottom: '2px' }}>
                    <span style={{ fontWeight: 'bold' }}>{mengetahuiNama || '_____________________'}</span>
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '11px' }}>NIP. {mengetahuiNip || '-'}</div>
                </div>
                <div style={{ width: '48%', textAlign: 'center' }}>
                  <div>Sidoarjo, {formatDate(tanggalSurat) || '________'}</div>
                  <div style={{ marginBottom: '70px', marginTop: '2px' }}>{penandatanganJabatan || 'Kepala Dinas'}</div>
                  <div style={{ borderBottom: '1.5px solid #374151', display: 'inline-block', minWidth: '180px', paddingBottom: '2px' }}>
                    <span style={{ fontWeight: 'bold' }}>{penandatanganNama || '_____________________'}</span>
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '11px' }}>NIP. {penandatanganNip || '-'}</div>
                </div>
              </div>
            </div>

          </div>
          
          {/* Footer of Preview Card */}
          <div className="bg-white p-4 border-t border-gray-200 flex justify-between items-center z-10">
            <div className="flex items-center text-xs font-medium text-yellow-600">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2"></div>
              {allValid ? 'Siap disimpan' : 'Dokumen belum lengkap'}
            </div>
            <button
              onClick={() => handleSave('Aktif')}
              disabled={saving || !allValid}
              className="px-4 py-1.5 bg-[#1e3a8a] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center hover:bg-blue-900 transition-colors disabled:opacity-50">
              {saving ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Printer className="w-3.5 h-3.5 mr-1.5" />}
              Simpan & Cetak
            </button>
          </div>
        </div>

        {/* Validation Summary */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center text-sm font-bold text-gray-800 mb-4">
            <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2" />
            Ringkasan Validasi
          </div>
          
          <div className="space-y-3 mb-6">
            {[
              { label: 'Informasi Dasar (Nomor & Tanggal)', valid: isStep1Valid },
              { label: `${pegawaiList.filter(p=>p.nama).length} pegawai ditambahkan`, valid: isStep2Valid },
              { label: 'Detail Tugas (Tujuan & Jadwal)', valid: isStep3Valid },
              { label: 'Pengesahan (Penandatangan)', valid: !!penandatanganNama },
            ].map(({ label, valid }) => (
              <div key={label} className="flex items-start text-xs text-gray-600">
                {valid
                  ? <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  : <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                }
                <span className={valid ? '' : 'text-yellow-700 font-medium'}>{label}</span>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-2">
              <span>Kelengkapan Form</span>
              <span className="text-blue-600">
                {Math.round([isStep1Valid, isStep2Valid, isStep3Valid, !!penandatanganNama].filter(Boolean).length / 4 * 100)}%
              </span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.round([isStep1Valid, isStep2Valid, isStep3Valid, !!penandatanganNama].filter(Boolean).length / 4 * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminSuratTugasCreate;
