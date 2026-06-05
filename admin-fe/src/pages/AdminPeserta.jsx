import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Users, 
  CheckCircle2, 
  Clock, 
  Flag,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronDown,
  X,
  Save,
  AlertTriangle,
  User,
  Building2,
  Calendar,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  Hash,
  FileText,
  ExternalLink
} from 'lucide-react';

// ─── Shared InputRow (harus di luar modal agar tidak di-remount saat rerender) ──
const InputRow = ({ label, icon: Icon, field, type = 'text', readOnly = false, placeholder = '', form, onChange }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
    <div className="relative">
      <Icon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type={type}
        value={form[field] || ''}
        onChange={onChange(field)}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors ${readOnly ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-800'}`}
      />
    </div>
  </div>
);

// ─── Mock Data ────────────────────────────────────────────────────────────────
const initialData = [
  {
    id: '01',
    name: 'Siti Aminah',
    identifier: 'siti.aminah@student.ub.ac.id',
    initials: 'SA', color: 'bg-rose-500',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    nama: 'Siti Aminah', noHp: '081234567890',
    email: 'siti.aminah@student.ub.ac.id',
    asalInstansi: 'Universitas Brawijaya', bidangTujuan: 'Bidang Pelayanan Umum',
    tanggalMulai: '2023-11-01', tanggalSelesai: '2024-01-31',
    instansi: 'Universitas Brawijaya', telepon: '081234567890',
    penempatan: 'Bidang Pelayanan Umum', periode: '01 Nov 2023 - 31 Jan 2024',
    durasi: '3 Bulan', status: 'Aktif',
    berkas: { surat_pengantar: [{ name: 'surat_siti.pdf', size: '310 KB' }], proposal: [], portofolio: [{ name: 'portofolio_siti.pdf', size: '1.2 MB' }], cv: [{ name: 'cv_siti.pdf', size: '245 KB' }] },
    tanggalDaftar: '2023-10-15T08:00:00.000Z',
  },
  {
    id: '02',
    name: 'Rizky Aditya',
    identifier: 'rizky.aditya@uinsa.ac.id',
    initials: 'RA', color: 'bg-blue-500',
    nama: 'Rizky Aditya', noHp: '082345678901',
    email: 'rizky.aditya@uinsa.ac.id',
    asalInstansi: 'UIN Sunan Ampel', bidangTujuan: 'Bidang TI dan Jaringan',
    tanggalMulai: '2023-12-01', tanggalSelesai: '2024-01-31',
    instansi: 'UIN Sunan Ampel', telepon: '082345678901',
    penempatan: 'Bidang TI dan Jaringan', periode: '01 Des 2023 - 31 Jan 2024',
    durasi: '2 Bulan', status: 'Aktif',
    berkas: { surat_pengantar: [{ name: 'surat_rizky.pdf', size: '320 KB' }], proposal: [], portofolio: [], cv: [{ name: 'cv_rizky.pdf', size: '180 KB' }] },
    tanggalDaftar: '2023-11-20T09:30:00.000Z',
  },
  {
    id: '03',
    name: 'Dewi Sartika',
    identifier: 'dewi.sartika@smkn1sda.sch.id',
    initials: 'DS', color: 'bg-emerald-500',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    nama: 'Dewi Sartika', noHp: '083456789012',
    email: 'dewi.sartika@smkn1sda.sch.id',
    asalInstansi: 'SMKN 1 Sidoarjo', bidangTujuan: 'Bidang Administrasi',
    tanggalMulai: '2024-01-15', tanggalSelesai: '2024-06-15',
    instansi: 'SMKN 1 Sidoarjo', telepon: '083456789012',
    penempatan: 'Bidang Administrasi', periode: '15 Jan 2024 - 15 Jun 2024',
    durasi: '5 Bulan', status: 'Pending',
    berkas: { surat_pengantar: [{ name: 'surat_dewi.pdf', size: '290 KB' }], proposal: [{ name: 'proposal_dewi.pdf', size: '1.8 MB' }], portofolio: [], cv: [] },
    tanggalDaftar: '2024-01-05T10:15:00.000Z',
  },
  {
    id: '04',
    name: 'Ahmad Farhan',
    identifier: 'ahmad.farhan@student.unair.ac.id',
    initials: 'AF', color: 'bg-indigo-500',
    nama: 'Ahmad Farhan', noHp: '084567890123',
    email: 'ahmad.farhan@student.unair.ac.id',
    asalInstansi: 'Universitas Airlangga', bidangTujuan: 'Bidang Hukum dan HAM',
    tanggalMulai: '2023-07-01', tanggalSelesai: '2023-09-30',
    instansi: 'Universitas Airlangga', telepon: '084567890123',
    penempatan: 'Bidang Hukum dan HAM', periode: '01 Jul 2023 - 30 Sep 2023',
    durasi: '3 Bulan', status: 'Selesai',
    berkas: { surat_pengantar: [], proposal: [], portofolio: [], cv: [] },
    tanggalDaftar: '2023-06-10T07:45:00.000Z',
  },
  {
    id: '05',
    name: 'Laila Nur Hidayah',
    identifier: 'laila.hidayah@student.its.ac.id',
    initials: 'LN', color: 'bg-pink-500',
    nama: 'Laila Nur Hidayah', noHp: '085678901234',
    email: 'laila.hidayah@student.its.ac.id',
    asalInstansi: 'ITS Surabaya', bidangTujuan: 'Bidang TI dan Jaringan',
    tanggalMulai: '2024-02-01', tanggalSelesai: '2024-04-30',
    instansi: 'ITS Surabaya', telepon: '085678901234',
    penempatan: 'Bidang TI dan Jaringan', periode: '01 Feb 2024 - 30 Apr 2024',
    durasi: '3 Bulan', status: 'Pending',
    berkas: { surat_pengantar: [], proposal: [], portofolio: [], cv: [] },
    tanggalDaftar: '2024-01-25T11:00:00.000Z',
  },
  {
    id: '06',
    name: 'Bagas Prasetyo',
    identifier: 'bagas.prasetyo@smkn2sda.sch.id',
    initials: 'BP', color: 'bg-teal-500',
    nama: 'Bagas Prasetyo', noHp: '086789012345',
    email: 'bagas.prasetyo@smkn2sda.sch.id',
    asalInstansi: 'SMKN 2 Sidoarjo', bidangTujuan: 'Bidang TI dan Jaringan',
    tanggalMulai: '2023-10-01', tanggalSelesai: '2024-03-31',
    instansi: 'SMKN 2 Sidoarjo', telepon: '086789012345',
    penempatan: 'Bidang TI dan Jaringan', periode: '01 Okt 2023 - 31 Mar 2024',
    durasi: '6 Bulan', status: 'Aktif',
    berkas: { surat_pengantar: [], proposal: [], portofolio: [], cv: [] },
    tanggalDaftar: '2023-09-18T13:20:00.000Z',
  },
  {
    id: '07',
    name: 'Nadia Putri Kusuma',
    identifier: 'nadia.kusuma@student.um.ac.id',
    initials: 'NP', color: 'bg-purple-500',
    nama: 'Nadia Putri Kusuma', noHp: '087890123456',
    email: 'nadia.kusuma@student.um.ac.id',
    asalInstansi: 'Universitas Negeri Malang', bidangTujuan: 'Bidang Keuangan',
    tanggalMulai: '2023-08-01', tanggalSelesai: '2023-10-31',
    instansi: 'Universitas Negeri Malang', telepon: '087890123456',
    penempatan: 'Bidang Keuangan', periode: '01 Ags 2023 - 31 Okt 2023',
    durasi: '3 Bulan', status: 'Selesai',
    berkas: { surat_pengantar: [], proposal: [], portofolio: [], cv: [] },
    tanggalDaftar: '2023-07-05T08:30:00.000Z',
  },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    Aktif: 'bg-green-50 text-green-600 border-green-100',
    Pending: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    Selesai: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  const dot = {
    Aktif: 'bg-green-500',
    Pending: 'bg-yellow-400',
    Selesai: 'bg-gray-400',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${map[status] || ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dot[status] || 'bg-gray-400'}`}></span>
      {status}
    </span>
  );
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ row, size = 'sm' }) => {
  const dim = size === 'lg' ? 'w-16 h-16 text-lg' : 'w-8 h-8 text-xs';
  return row.avatar ? (
    <img src={row.avatar} alt={row.name} className={`${dim} rounded-full object-cover`} />
  ) : (
    <div className={`${dim} rounded-full flex items-center justify-center text-white font-medium ${row.color || 'bg-gray-400'}`}>
      {row.initials || row.name?.[0]}
    </div>
  );
};

// ─── Modal Lihat Detail ───────────────────────────────────────────────────────
const ViewModal = ({ peserta, onClose }) => {
  if (!peserta) return null;

  const berkasLabels = {
    surat_pengantar: 'Surat Pengantar',
    proposal: 'Proposal Magang',
    portofolio: 'Portofolio',
    cv: 'CV',
  };
  const berkasEntries = peserta.berkas ? Object.entries(peserta.berkas) : [];
  const hasBerkas = berkasEntries.some(([, files]) => files && files.length > 0);

  const fields = [
    { icon: Phone,     label: 'Nomor Handphone',  value: peserta.noHp || peserta.telepon },
    { icon: Mail,      label: 'Email',             value: peserta.email },
    { icon: Building2, label: 'Asal Instansi',     value: peserta.asalInstansi || peserta.instansi },
    { icon: MapPin,    label: 'Bidang Tujuan',     value: peserta.bidangTujuan || peserta.penempatan },
    { icon: Calendar,  label: 'Tanggal Mulai',     value: peserta.tanggalMulai ? new Date(peserta.tanggalMulai).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : (peserta.periode?.split(' - ')[0] || '-') },
    { icon: Calendar,  label: 'Tanggal Selesai',   value: peserta.tanggalSelesai ? new Date(peserta.tanggalSelesai).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : (peserta.periode?.split(' - ')[1] || '-') },
    { icon: Clock,     label: 'Durasi Magang',     value: peserta.durasi },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 rounded-t-2xl p-6 text-white">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <Avatar row={peserta} size="lg" />
            <div>
              <h2 className="text-xl font-bold">{peserta.nama || peserta.name}</h2>
              <p className="text-blue-100 text-sm mt-0.5">{peserta.email || '-'}</p>
              <div className="mt-2">
                <StatusBadge status={peserta.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Tanggal Daftar jika ada */}
        {peserta.tanggalDaftar && (
          <div className="mx-6 mt-4 px-4 py-2.5 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              Mendaftar: <span className="font-semibold">{new Date(peserta.tanggalDaftar).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </p>
          </div>
        )}

        {/* Body — Data Diri */}
        <div className="px-6 pt-4 pb-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Data Diri Peserta</p>
          <div className="grid grid-cols-1 gap-3">
            {fields.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                  <p className="text-sm text-gray-800 font-medium mt-0.5">{value || '-'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Body — Berkas */}
        <div className="px-6 pt-4 pb-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Berkas yang Diupload</p>
          {!hasBerkas ? (
            <p className="text-sm text-gray-400 italic">Belum ada berkas yang diupload.</p>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {berkasEntries.map(([key, files]) => (
                <div key={key}>
                  <p className="text-xs font-semibold text-gray-500 mb-1">{berkasLabels[key] || key}</p>
                  {files && files.length > 0 ? files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 mb-1">
                      <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 flex-1 truncate">{f.name}</span>
                      <span className="text-xs text-gray-400">{f.size}</span>
                    </div>
                  )) : (
                    <p className="text-xs text-gray-300 ml-1 italic">Tidak ada file</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Modal Edit Peserta ───────────────────────────────────────────────────────
const EditModal = ({ peserta, onClose, onSave }) => {
  const [form, setForm] = useState({ ...peserta });
  const [saving, setSaving] = useState(false);

  if (!peserta) return null;

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    // Sinkronkan field turunan
    const updated = {
      ...form,
      name: form.nama || form.name,
      instansi: form.asalInstansi || form.instansi,
      penempatan: form.bidangTujuan || form.penempatan,
      telepon: form.noHp || form.telepon,
    };
    // Hitung periode & durasi
    if (form.tanggalMulai && form.tanggalSelesai) {
      const fmt = (d) => new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
      updated.periode = `${fmt(form.tanggalMulai)} - ${fmt(form.tanggalSelesai)}`;
      const months = Math.round((new Date(form.tanggalSelesai) - new Date(form.tanggalMulai)) / (1000 * 60 * 60 * 24 * 30));
      updated.durasi = months > 0 ? `${months} Bulan` : '< 1 Bulan';
    }
    setTimeout(() => {
      onSave(updated);
      setSaving(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
              <Edit className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Edit Peserta</h2>
              <p className="text-xs text-gray-400">{peserta.nama || peserta.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form — sesuai field pendaftaran */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <InputRow label="Nama Lengkap *"     icon={User}      field="nama"          form={form} onChange={set} placeholder="Nama lengkap" />
          <InputRow label="Nomor Handphone"    icon={Phone}     field="noHp"          form={form} onChange={set} placeholder="08xxxxxxxxxx" type="tel" />
          <InputRow label="Email"              icon={Mail}      field="email"         form={form} onChange={set} placeholder="email@contoh.com" type="email" />
          <InputRow label="Asal Instansi *"    icon={Building2} field="asalInstansi"  form={form} onChange={set} placeholder="Universitas / Sekolah asal" />
          <InputRow label="Bidang Tujuan"      icon={MapPin}    field="bidangTujuan"  form={form} onChange={set} placeholder="Bidang yang dituju" />
          <div className="grid grid-cols-2 gap-4">
            <InputRow label="Tanggal Mulai"    icon={Calendar}  field="tanggalMulai"  form={form} onChange={set} type="date" />
            <InputRow label="Tanggal Selesai"  icon={Calendar}  field="tanggalSelesai" form={form} onChange={set} type="date" />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Status</label>
            <select
              value={form.status}
              onChange={set('status')}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors bg-white text-gray-800"
            >
              <option>Aktif</option>
              <option>Pending</option>
              <option>Selesai</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-[#0066FF] hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Modal Tambah Peserta ─────────────────────────────────────────────────────
const TambahModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    nama: '', noHp: '', email: '',
    asalInstansi: '', bidangTujuan: '',
    tanggalMulai: '', tanggalSelesai: '',
    status: 'Pending',
  });
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama || !form.asalInstansi) return alert('Nama dan Asal Instansi wajib diisi!');
    setSaving(true);
    setTimeout(() => {
      const colors = ['bg-blue-500', 'bg-pink-500', 'bg-teal-500', 'bg-purple-500', 'bg-indigo-500'];
      const fmt = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
      const months = (form.tanggalMulai && form.tanggalSelesai)
        ? Math.round((new Date(form.tanggalSelesai) - new Date(form.tanggalMulai)) / (1000 * 60 * 60 * 24 * 30))
        : 0;
      const newPeserta = {
        ...form,
        id: String(Date.now()),
        name: form.nama,
        identifier: form.email ? `Email: ${form.email}` : 'Peserta Baru',
        initials: form.nama.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
        color: colors[Math.floor(Math.random() * colors.length)],
        instansi: form.asalInstansi,
        penempatan: form.bidangTujuan,
        telepon: form.noHp,
        periode: (fmt(form.tanggalMulai) && fmt(form.tanggalSelesai)) ? `${fmt(form.tanggalMulai)} - ${fmt(form.tanggalSelesai)}` : '-',
        durasi: months > 0 ? `${months} Bulan` : '-',
        berkas: { surat_pengantar: [], proposal: [], portofolio: [], cv: [] },
        tanggalDaftar: new Date().toISOString(),
      };
      onSave(newPeserta);
      setSaving(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Tambah Peserta Baru</h2>
              <p className="text-xs text-gray-400">Isi data sesuai form pendaftaran</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form sesuai form pendaftaran */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <InputRow label="Nama Lengkap *"   icon={User}      field="nama"          form={form} onChange={set} placeholder="Masukkan nama lengkap" />
          <InputRow label="Nomor Handphone"  icon={Phone}     field="noHp"          form={form} onChange={set} placeholder="08xxxxxxxxxx" type="tel" />
          <InputRow label="Email"            icon={Mail}      field="email"         form={form} onChange={set} placeholder="email@contoh.com" type="email" />
          <InputRow label="Asal Instansi *"  icon={Building2} field="asalInstansi"  form={form} onChange={set} placeholder="Universitas / Sekolah asal" />
          <InputRow label="Bidang Tujuan"    icon={MapPin}    field="bidangTujuan"  form={form} onChange={set} placeholder="Bidang yang dituju" />
          <div className="grid grid-cols-2 gap-4">
            <InputRow label="Tanggal Mulai"  icon={Calendar}  field="tanggalMulai"  form={form} onChange={set} type="date" />
            <InputRow label="Tanggal Selesai" icon={Calendar} field="tanggalSelesai" form={form} onChange={set} type="date" />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Status Awal</label>
            <select
              value={form.status}
              onChange={set('status')}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors bg-white text-gray-800"
            >
              <option>Pending</option>
              <option>Aktif</option>
              <option>Selesai</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-[#0066FF] hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Tambah Peserta
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Modal Hapus Konfirmasi ───────────────────────────────────────────────────
const DeleteModal = ({ peserta, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);
  if (!peserta) return null;

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => {
      onConfirm(peserta.id);
      setDeleting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Hapus Peserta?</h2>
          <p className="text-sm text-gray-500 mb-1">
            Anda akan menghapus data peserta:
          </p>
          <p className="text-sm font-semibold text-gray-800 mb-1">{peserta.nama || peserta.name}</p>
          <p className="text-xs text-gray-400 mb-6">{peserta.asalInstansi || peserta.instansi} — {peserta.bidangTujuan || peserta.penempatan || '-'}</p>
          <p className="text-xs text-red-400 bg-red-50 rounded-lg px-3 py-2 mb-6 w-full">
            ⚠️ Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors text-sm"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {deleting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Trash2 className="w-4 h-4" /> Hapus</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Toast Notifikasi ─────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl text-white text-sm font-medium shadow-xl ${colors[type] || 'bg-gray-800'} animate-slide-in`}>
      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white/70 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// ─── Halaman Utama AdminPeserta ───────────────────────────────────────────────
const AdminPeserta = () => {
  const [data, setData]                     = useState(initialData);
  const [searchQuery, setSearchQuery]       = useState('');
  const [filterStatus, setFilterStatus]     = useState('Semua Status');
  const [filterInstansi, setFilterInstansi] = useState('Semua Instansi');
  const [isStatusOpen, setIsStatusOpen]     = useState(false);
  const [isInstansiOpen, setIsInstansiOpen] = useState(false);
  const [currentPage, setCurrentPage]       = useState(1);

  // Modal states
  const [viewPeserta,   setViewPeserta]   = useState(null);
  const [editPeserta,   setEditPeserta]   = useState(null);
  const [deletePeserta, setDeletePeserta] = useState(null);
  const [showTambah,    setShowTambah]    = useState(false);
  const [toast,         setToast]         = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Baca data pendaftaran dari localStorage ────────────────────────────────
  // Karena admin-fe dan fe-dukcapil berjalan di port berbeda, mereka
  // berbagi localStorage hanya jika origin sama. Jika berbeda port,
  // gunakan key yang sudah disepakati dan polling berkala.
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('pendaftaran_magang') || '[]');
        if (stored.length > 0) {
          setData(prev => {
            const existingIds = new Set(prev.map(d => d.id));
            const newEntries = stored.filter(s => !existingIds.has(s.id));
            if (newEntries.length > 0) {
              showToast(`🔔 ${newEntries.length} pendaftaran baru masuk!`, 'info');
              return [...newEntries, ...prev];
            }
            return prev;
          });
          // Tandai sebagai sudah dibaca (hapus dari antrian)
          localStorage.removeItem('pendaftaran_magang');
        }
      } catch (err) {
        console.error('Gagal membaca data pendaftaran:', err);
      }
    };

    // Baca langsung saat load
    loadFromStorage();

    // Polling setiap 5 detik untuk menangkap pendaftaran baru
    const interval = setInterval(loadFromStorage, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter + Search
  const filtered = data.filter(row => {
    const nameStr    = (row.nama || row.name || '').toLowerCase();
    const instansiStr = (row.asalInstansi || row.instansi || '').toLowerCase();
    const identStr   = (row.identifier || row.email || '').toLowerCase();
    const matchSearch = !searchQuery || 
      nameStr.includes(searchQuery.toLowerCase()) ||
      instansiStr.includes(searchQuery.toLowerCase()) ||
      identStr.includes(searchQuery.toLowerCase());
    const matchStatus   = filterStatus   === 'Semua Status'   || row.status   === filterStatus;
    const matchInstansi = filterInstansi === 'Semua Instansi' || (row.asalInstansi || row.instansi) === filterInstansi;
    return matchSearch && matchStatus && matchInstansi;
  });

  const instansiList = [...new Set(data.map(d => d.asalInstansi || d.instansi))];

  // Handlers
  const handleSaveEdit = (updated) => {
    setData(prev => prev.map(r => r.id === updated.id ? { ...r, ...updated } : r));
    setEditPeserta(null);
    showToast(`Data ${updated.nama || updated.name} berhasil diperbarui.`);
  };

  const handleDelete = (id) => {
    const name = data.find(r => r.id === id)?.name;
    setData(prev => prev.filter(r => r.id !== id));
    setDeletePeserta(null);
    showToast(`Data ${name} berhasil dihapus.`, 'error');
  };

  const handleTambah = (newPeserta) => {
    setData(prev => [newPeserta, ...prev]);
    setShowTambah(false);
    showToast(`Peserta ${newPeserta.name} berhasil ditambahkan!`);
  };

  return (
    <div className="space-y-6">
      {/* Modals */}
      {viewPeserta   && <ViewModal   peserta={viewPeserta}   onClose={() => setViewPeserta(null)} />}
      {editPeserta   && <EditModal   peserta={editPeserta}   onClose={() => setEditPeserta(null)}   onSave={handleSaveEdit} />}
      {deletePeserta && <DeleteModal peserta={deletePeserta} onClose={() => setDeletePeserta(null)} onConfirm={handleDelete} />}
      {showTambah    && <TambahModal onClose={() => setShowTambah(false)} onSave={handleTambah} />}
      {toast         && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Breadcrumbs & Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Dashboard</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="font-semibold text-blue-600">Peserta Magang</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Manajemen Peserta Magang</h2>
          <p className="text-sm text-gray-500">Kelola seluruh data peserta magang Dukcapil Sidoarjo</p>
        </div>
        <button
          className="flex items-center px-4 py-2 bg-[#0066FF] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          onClick={() => setShowTambah(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Peserta
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Peserta', value: data.length,                                              icon: Users,        bg: 'bg-blue-50',   color: 'text-blue-600' },
          { label: 'Aktif',         value: data.filter(d => d.status === 'Aktif').length,            icon: CheckCircle2, bg: 'bg-green-50',  color: 'text-green-500' },
          { label: 'Pending',       value: data.filter(d => d.status === 'Pending').length,          icon: Clock,        bg: 'bg-yellow-50', color: 'text-yellow-500' },
          { label: 'Selesai',       value: data.filter(d => d.status === 'Selesai').length,          icon: Flag,         bg: 'bg-gray-50',   color: 'text-gray-400' },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-center">
            <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center ${color} mr-4`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center flex-1">
            {/* Search */}
            <div className="relative w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama peserta..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 text-sm rounded-lg py-2 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
              />
            </div>

            {/* Filter Status */}
            <div className="relative">
              <button
                onClick={() => { setIsStatusOpen(!isStatusOpen); setIsInstansiOpen(false); }}
                className="flex items-center justify-between w-40 bg-white border border-gray-200 text-sm text-gray-600 rounded-lg py-2 px-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-gray-400" />
                  {filterStatus}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {isStatusOpen && (
                <div className="absolute top-full mt-1 left-0 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-10">
                  {['Semua Status', 'Aktif', 'Pending', 'Selesai'].map(s => (
                    <button
                      key={s}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${filterStatus === s ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                      onClick={() => { setFilterStatus(s); setIsStatusOpen(false); }}
                    >{s}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Instansi */}
            <div className="relative">
              <button
                onClick={() => { setIsInstansiOpen(!isInstansiOpen); setIsStatusOpen(false); }}
                className="flex items-center justify-between w-48 bg-white border border-gray-200 text-sm text-gray-600 rounded-lg py-2 px-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center truncate">
                  <Building2 className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{filterInstansi}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>
              {isInstansiOpen && (
                <div className="absolute top-full mt-1 left-0 w-56 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-10">
                  {['Semua Instansi', ...instansiList].map(inst => (
                    <button
                      key={inst}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${filterInstansi === inst ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                      onClick={() => { setFilterInstansi(inst); setIsInstansiOpen(false); }}
                    >{inst}</button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => {
                const csv = [
                  ['No', 'Nama', 'NIM/NIS', 'Instansi', 'Jurusan', 'Periode', 'Status'],
                  ...filtered.map(r => [r.id, r.name, r.nim, r.instansi, r.jurusan, r.periode, r.status])
                ].map(r => r.join(',')).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'peserta-magang.csv'; a.click();
                showToast('Data berhasil diekspor ke CSV!', 'info');
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button
              className="flex items-center px-4 py-2 bg-[#0066FF] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              onClick={() => setShowTambah(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Peserta
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-gray-500 uppercase bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold w-10">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="px-2 py-4 font-semibold w-16">NO.</th>
                <th className="px-6 py-4 font-semibold">NAMA PESERTA</th>
                <th className="px-6 py-4 font-semibold">INSTANSI / SEKOLAH</th>
                <th className="px-6 py-4 font-semibold">PERIODE MAGANG</th>
                <th className="px-6 py-4 font-semibold">STATUS</th>
                <th className="px-6 py-4 font-semibold text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-400">
                    <Users className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                    <p className="font-medium">Tidak ada data peserta</p>
                    <p className="text-xs mt-1">Coba ubah filter pencarian Anda</p>
                  </td>
                </tr>
              ) : filtered.map((row, idx) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  </td>
                  <td className="px-2 py-4 text-gray-500 font-medium">{String(idx + 1).padStart(2, '0')}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="mr-3"><Avatar row={row} /></div>
                      <div>
                        <p className="font-semibold text-gray-800">{row.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{row.identifier}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-700">{row.instansi}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{row.jurusan}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-700 mb-0.5">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                      <span className="font-medium text-[13px]">{row.periode}</span>
                    </div>
                    <p className="text-xs text-gray-400 ml-5">{row.durasi}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        title="Lihat Detail"
                        onClick={() => setViewPeserta(row)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        title="Edit"
                        onClick={() => setEditPeserta(row)}
                        className="p-1.5 text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        title="Hapus"
                        onClick={() => setDeletePeserta(row)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm">
          <div className="text-gray-500 flex items-center">
            Menampilkan
            <select className="mx-2 border border-gray-200 rounded-md p-1 focus:outline-none focus:border-blue-300">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
            dari <span className="font-semibold text-gray-700 mx-1">{filtered.length}</span> peserta
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {[1, 2, 3].map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium transition-colors ${currentPage === page ? 'bg-[#0066FF] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {page}
              </button>
            ))}
            <span className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
            <button
              onClick={() => setCurrentPage(5)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium transition-colors ${currentPage === 5 ? 'bg-[#0066FF] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              5
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(5, currentPage + 1))}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Inline animation style */}
      <style>{`
        @keyframes slide-in {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AdminPeserta;
