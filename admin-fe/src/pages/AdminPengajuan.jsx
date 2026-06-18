import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { createClient } from '@supabase/supabase-js';
import {
  ChevronRight,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  X,
  FileText,
  Phone,
  Mail,
  Building2,
  MapPin,
  Calendar,
  User,
  AlertTriangle,
  ClipboardList,
  ThumbsUp,
  ThumbsDown,
  Download,
  Badge,
} from 'lucide-react';

// ─── Mock Pengajuan Data (Unused) ───────────────────────────────────────────────
/*
const initialPengajuan = [
  {
    id: 'PGJ-001',
    nama: 'Rafi Andriansyah',
    email: 'rafi.andrian@student.ub.ac.id',
    noHp: '081234509876',
    asalInstansi: 'Universitas Brawijaya',
    jurusan: 'Teknik Informatika',
    bidangTujuan: 'Bidang TI dan Jaringan',
    tanggalMulai: '2024-07-01',
    tanggalSelesai: '2024-09-30',
    status: 'Menunggu',
    tanggalDaftar: '2024-06-10T08:23:00.000Z',
    initials: 'RA',
    color: 'bg-blue-500',
    berkas: {
      surat_pengantar: [{ name: 'surat_pengantar_rafi.pdf', size: '320 KB' }],
      proposal: [{ name: 'proposal_rafi.pdf', size: '1.5 MB' }],
      cv: [{ name: 'cv_rafi.pdf', size: '280 KB' }],
      portofolio: [],
    },
    catatan: '',
  },
  {
    id: 'PGJ-002',
    nama: 'Aulia Rahmawati',
    email: 'aulia.rahma@student.its.ac.id',
    noHp: '082356789012',
    asalInstansi: 'ITS Surabaya',
    jurusan: 'Sistem Informasi',
    bidangTujuan: 'Bidang Administrasi',
    tanggalMulai: '2024-08-01',
    tanggalSelesai: '2024-10-31',
    status: 'Menunggu',
    tanggalDaftar: '2024-06-12T10:45:00.000Z',
    initials: 'AR',
    color: 'bg-pink-500',
    berkas: {
      surat_pengantar: [{ name: 'surat_aulia.pdf', size: '290 KB' }],
      proposal: [],
      cv: [{ name: 'cv_aulia.pdf', size: '250 KB' }],
      portofolio: [{ name: 'portofolio_aulia.pdf', size: '2.1 MB' }],
    },
    catatan: '',
  },
  {
    id: 'PGJ-003',
    nama: 'Dimas Aryo Wibowo',
    email: 'dimas.aryo@smkn3sby.sch.id',
    noHp: '083409876543',
    asalInstansi: 'SMKN 3 Surabaya',
    jurusan: 'Rekayasa Perangkat Lunak',
    bidangTujuan: 'Bidang TI dan Jaringan',
    tanggalMulai: '2024-07-15',
    tanggalSelesai: '2024-12-15',
    status: 'Disetujui',
    tanggalDaftar: '2024-06-05T09:15:00.000Z',
    tanggalReview: '2024-06-08T14:30:00.000Z',
    initials: 'DA',
    color: 'bg-teal-500',
    berkas: {
      surat_pengantar: [{ name: 'surat_dimas.pdf', size: '310 KB' }],
      proposal: [{ name: 'proposal_dimas.pdf', size: '1.8 MB' }],
      cv: [{ name: 'cv_dimas.pdf', size: '200 KB' }],
      portofolio: [],
    },
    catatan: '',
  },
  {
    id: 'PGJ-004',
    nama: 'Siti Maryam Hasanah',
    email: 'siti.maryam@unair.ac.id',
    noHp: '08456789000',
    asalInstansi: 'Universitas Airlangga',
    jurusan: 'Hukum',
    bidangTujuan: 'Bidang Hukum dan HAM',
    tanggalMulai: '2024-09-01',
    tanggalSelesai: '2024-11-30',
    status: 'Ditolak',
    tanggalDaftar: '2024-06-01T11:00:00.000Z',
    tanggalReview: '2024-06-06T09:00:00.000Z',
    initials: 'SM',
    color: 'bg-orange-500',
    berkas: {
      surat_pengantar: [],
      proposal: [],
      cv: [{ name: 'cv_siti_maryam.pdf', size: '190 KB' }],
      portofolio: [],
    },
    catatan: 'Dokumen surat pengantar dan proposal belum dilengkapi. Silakan ajukan ulang setelah melengkapi berkas.',
  },
  {
    id: 'PGJ-005',
    nama: 'Fathur Rahman Aziz',
    email: 'fathur.aziz@student.um.ac.id',
    noHp: '085567890123',
    asalInstansi: 'Universitas Negeri Malang',
    jurusan: 'Pendidikan Ekonomi',
    bidangTujuan: 'Bidang Keuangan',
    tanggalMulai: '2024-07-01',
    tanggalSelesai: '2024-10-01',
    status: 'Menunggu',
    tanggalDaftar: '2024-06-14T13:00:00.000Z',
    initials: 'FA',
    color: 'bg-indigo-500',
    berkas: {
      surat_pengantar: [{ name: 'surat_fathur.pdf', size: '340 KB' }],
      proposal: [{ name: 'proposal_fathur.pdf', size: '900 KB' }],
      cv: [{ name: 'cv_fathur.pdf', size: '220 KB' }],
      portofolio: [],
    },
    catatan: '',
  },
  {
    id: 'PGJ-006',
    nama: 'Maya Clarissa Putri',
    email: 'maya.clarissa@smkn1sda.sch.id',
    noHp: '086678901234',
    asalInstansi: 'SMKN 1 Sidoarjo',
    jurusan: 'Akuntansi',
    bidangTujuan: 'Bidang Keuangan',
    tanggalMulai: '2024-08-01',
    tanggalSelesai: '2025-01-31',
    status: 'Menunggu',
    tanggalDaftar: '2024-06-16T09:00:00.000Z',
    initials: 'MC',
    color: 'bg-purple-500',
    berkas: {
      surat_pengantar: [{ name: 'surat_maya.pdf', size: '305 KB' }],
      proposal: [],
      cv: [{ name: 'cv_maya.pdf', size: '195 KB' }],
      portofolio: [{ name: 'portofolio_maya.pdf', size: '1.2 MB' }],
    },
    catatan: '',
  },
];
*/

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '-';

const fmtDateTime = (d) =>
  d
    ? new Date(d).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-';

const hitungDurasi = (mulai, selesai) => {
  if (!mulai || !selesai) return '-';
  const months = Math.round(
    (new Date(selesai) - new Date(mulai)) / (1000 * 60 * 60 * 24 * 30)
  );
  return months > 0 ? `${months} Bulan` : '< 1 Bulan';
};

// ─── Status Badge ──────────────────────────────────────────────────────────────
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
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
        styles[status] || 'bg-gray-50 text-gray-500 border-gray-200'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          dots[status] || 'bg-gray-400'
        }`}
      />
      {status}
    </span>
  );
};

// ─── Avatar ────────────────────────────────────────────────────────────────────
const Avatar = ({ row, size = 'sm' }) => {
  const dim = size === 'lg' ? 'w-16 h-16 text-xl' : 'w-9 h-9 text-sm';
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center text-white font-bold ${
        row.color || 'bg-gray-400'
      } flex-shrink-0`}
    >
      {row.initials || (row.nama || '?')[0]}
    </div>
  );
};

// ─── Berkas Section ────────────────────────────────────────────────────────────
const berkasLabels = {
  surat_pengantar: 'Surat Pengantar',
  proposal: 'Proposal Magang',
  cv: 'Curriculum Vitae (CV)',
  portofolio: 'Portofolio',
};

const BerkasSection = ({ berkas }) => {
  const entries = berkas ? Object.entries(berkas) : [];
  const hasBerkas = entries.some(([, files]) => files && files.length > 0);

  return (
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
        Dokumen yang Dilampirkan
      </p>
      {!hasBerkas ? (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-500">
            Belum ada dokumen yang dilampirkan.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map(([key, files]) => (
            <div key={key}>
              <p className="text-xs font-semibold text-gray-500 mb-1">
                {berkasLabels[key] || key}
              </p>
              {files && files.length > 0 ? (
                files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2 bg-gray-50 rounded-lg px-3 py-2 mb-1 border border-gray-100 group hover:border-blue-200 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-medium truncate max-w-[200px]">
                        {f.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{f.size}</span>
                      <button
                        onClick={() => {
                          if (f.url) {
                            window.open(f.url, '_blank');
                          } else {
                            alert(`Mengunduh: ${f.name}`);
                          }
                        }}
                        className="text-gray-300 hover:text-blue-500 transition-colors"
                        title="Unduh"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-300 ml-1 italic">
                  Tidak ada file
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Detail & Review Modal ─────────────────────────────────────────────────────
const DetailModal = ({ pengajuan, onClose, onApprove, onReject }) => {
  if (!pengajuan) return null;
  const isPending = pengajuan.status === 'Menunggu';
  const durasi = hitungDurasi(pengajuan.tanggalMulai, pengajuan.tanggalSelesai);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 rounded-t-2xl p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <Avatar row={pengajuan} size="lg" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold">{pengajuan.nama}</h2>
                <StatusBadge status={pengajuan.status} />
              </div>
              <p className="text-blue-100 text-sm">{pengajuan.email}</p>
              <p className="text-blue-200 text-xs mt-1">ID: {pengajuan.id}</p>
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="mx-6 mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl border border-blue-100">
            <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-blue-400 font-semibold uppercase">
                Mendaftar
              </p>
              <p className="text-xs text-blue-700 font-medium">
                {fmtDateTime(pengajuan.tanggalDaftar)}
              </p>
            </div>
          </div>
          {pengajuan.tanggalReview && (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
              <CheckCircle2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">
                  Direview
                </p>
                <p className="text-xs text-gray-700 font-medium">
                  {fmtDateTime(pengajuan.tanggalReview)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-6 pt-5 pb-2 space-y-5">
          {/* Data Diri */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Data Diri Pemohon
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Phone, label: 'No. Handphone', value: pengajuan.noHp },
                { icon: Mail, label: 'Email', value: pengajuan.email },
                {
                  icon: Building2,
                  label: 'Asal Instansi',
                  value: pengajuan.asalInstansi,
                },
                {
                  icon: Badge || User,
                  label: 'Jurusan / Prodi',
                  value: pengajuan.jurusan || '-',
                },
                {
                  icon: MapPin,
                  label: 'Bidang Tujuan',
                  value: pengajuan.bidangTujuan,
                },
                { icon: Calendar, label: 'Tanggal Mulai', value: fmtDate(pengajuan.tanggalMulai) },
                { icon: Calendar, label: 'Tanggal Selesai', value: fmtDate(pengajuan.tanggalSelesai) },
                { icon: Clock, label: 'Durasi Magang', value: durasi },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                      {label}
                    </p>
                    <p className="text-sm text-gray-800 font-medium mt-0.5">
                      {value || '-'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Berkas */}
          <BerkasSection berkas={pengajuan.berkas} />

          {/* Catatan Penolakan */}
          {pengajuan.catatan && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">
                Alasan Penolakan
              </p>
              <p className="text-sm text-red-600">{pengajuan.catatan}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {isPending && (
          <div className="px-6 py-5 border-t border-gray-100 flex gap-3">
            <button
              onClick={() => onReject(pengajuan)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl transition-colors text-sm border border-red-100"
            >
              <ThumbsDown className="w-4 h-4" />
              Tolak Pengajuan
            </button>
            <button
              onClick={() => onApprove(pengajuan)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors text-sm shadow-sm"
            >
              <ThumbsUp className="w-4 h-4" />
              Setujui Pengajuan
            </button>
          </div>
        )}
        {!isPending && (
          <div className="px-6 py-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors text-sm"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Approve Confirm Modal ─────────────────────────────────────────────────────
const ApproveModal = ({ pengajuan, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(pengajuan?.email || '');
  const [emailError, setEmailError] = useState('');

  if (!pengajuan) return null;

  const hasValidEmail = !!(pengajuan.email && pengajuan.email.trim() !== '');

  const handleConfirm = () => {
    if (!hasValidEmail) {
      if (!email || !email.trim() || !email.includes('@')) {
        setEmailError('Format email tidak valid.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        onConfirm(pengajuan, email.trim());
        setLoading(false);
      }, 800);
    } else {
      setLoading(true);
      setTimeout(() => {
        onConfirm(pengajuan, pengajuan.email.trim());
        setLoading(false);
      }, 800);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            Setujui Pengajuan?
          </h2>
          <p className="text-sm text-gray-500 mb-1">
            Pengajuan magang dari:
          </p>
          <p className="text-sm font-bold text-gray-800 mb-1">
            {pengajuan.nama}
          </p>
          <p className="text-xs text-gray-400 mb-1">{pengajuan.asalInstansi}</p>
          <p className="text-xs text-gray-500 mb-4">
            {pengajuan.bidangTujuan} · {hitungDurasi(pengajuan.tanggalMulai, pengajuan.tanggalSelesai)}
          </p>

          {/* Email Input — hanya muncul jika email kosong */}
          {!hasValidEmail && (
            <div className="w-full text-left mb-5">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Email Akun Magang <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                placeholder="nama@email.com"
                className={`w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                  emailError ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                }`}
              />
              {emailError && (
                <p className="text-red-500 text-[10px] mt-1 font-medium">{emailError}</p>
              )}
            </div>
          )}

          <div className="p-3 bg-green-50 rounded-xl text-xs text-green-700 text-left w-full mb-6 border border-green-100">
            ✅ Pemohon akan <strong>otomatis masuk</strong> sebagai peserta magang aktif setelah pengajuan disetujui.
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors text-sm"
            >
              Batal
            </button>
            <button
              disabled={loading}
              onClick={handleConfirm}
              className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Setujui
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Credentials Modal ──────────────────────────────────────────────────────────
const CredentialsModal = ({ credentials, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`Email: ${credentials.email}\nPassword: ${credentials.password}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = () => {
    const emailBody = `Halo ${credentials.nama},\n\nPengajuan magang Anda di Disdukcapil Sidoarjo telah disetujui!\n\nBerikut adalah akun login Anda untuk melakukan absensi:\nEmail: ${credentials.email}\nPassword: ${credentials.password}\n\nSilakan login di halaman: http://localhost:5173/ \n\nSelamat bergabung!`;
    window.open(`mailto:${credentials.email}?subject=Akun%20Magang%20Disdukcapil%20Sidoarjo&body=${encodeURIComponent(emailBody)}`);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 overflow-hidden animate-[fadeInUp_0.25s_ease]" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Akun Berhasil Dibuat</h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Kredensial login berikut telah dibuat untuk <strong>{credentials.nama}</strong>:
          </p>

          <div className="w-full bg-gray-50 rounded-2xl p-4 mb-6 text-left border border-gray-100 text-sm space-y-2 relative group">
            <div>
              <span className="text-gray-400 block text-xs">Email</span>
              <span className="font-semibold text-gray-700 select-all">{credentials.email}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-xs">Password</span>
              <span className="font-mono font-semibold text-gray-700 select-all">{credentials.password}</span>
            </div>
            <button 
              onClick={handleCopy}
              className="absolute right-3 top-3 bg-white border border-gray-200 text-gray-500 hover:text-gray-800 text-[11px] px-2 py-1 rounded-lg transition-colors shadow-sm"
            >
              {copied ? 'Tersalin' : 'Salin'}
            </button>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={handleSendEmail}
              className="w-full py-3 bg-[#0066FF] hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 shadow-md"
            >
              Kirim Email Akun
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors text-sm"
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Reject Modal ──────────────────────────────────────────────────────────────
const RejectModal = ({ pengajuan, onClose, onConfirm }) => {
  const [alasan, setAlasan] = useState('');
  const [loading, setLoading] = useState(false);
  if (!pengajuan) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            Tolak Pengajuan?
          </h2>
          <p className="text-sm text-gray-500 mb-1">Pengajuan dari:</p>
          <p className="text-sm font-bold text-gray-800 mb-4">
            {pengajuan.nama}
          </p>
          <div className="w-full mb-5">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide text-left">
              Alasan Penolakan *
            </label>
            <textarea
              rows={4}
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              placeholder="Tuliskan alasan penolakan yang jelas agar pemohon dapat melengkapi berkas..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-colors resize-none text-left"
            />
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors text-sm"
            >
              Batal
            </button>
            <button
              disabled={!alasan.trim() || loading}
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  onConfirm(pengajuan, alasan.trim());
                  setLoading(false);
                }, 800);
              }}
              className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <XCircle className="w-4 h-4" /> Tolak
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl text-white text-sm font-medium shadow-xl ${
        colors[type] || 'bg-gray-800'
      }`}
    >
      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white/70 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const AdminPengajuan = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const [detailItem, setDetailItem] = useState(null);
  const [approveItem, setApproveItem] = useState(null);
  const [rejectItem, setRejectItem] = useState(null);
  const [credentials, setCredentials] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') =>
    setToast({ message, type });

  const fetchPengajuan = useCallback(async (showNotification = false) => {
    const { data: dbData, error } = await supabase
      .from('pengajuans')
      .select('*, berkases(*)')
      .order('tanggal_daftar', { ascending: false });

    if (error) {
      console.error('Gagal mengambil data pengajuan:', error);
      return;
    }

    const mappedData = dbData.map(item => {
      const berkasObj = {
        surat_pengantar: [],
        proposal: [],
        cv: [],
        portofolio: []
      };

      if (item.berkases) {
        item.berkases.forEach(b => {
          if (berkasObj[b.jenis]) {
            const { data: { publicUrl } } = supabase.storage
              .from('berkas-pengajuan')
              .getPublicUrl(b.storage_path);

            berkasObj[b.jenis].push({
              name: b.filename,
              size: b.size || '-',
              path: b.storage_path,
              url: publicUrl
            });
          }
        });
      }

      const name = item.nama || '';
      const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
      const colors = ['bg-blue-500', 'bg-pink-500', 'bg-teal-500', 'bg-purple-500', 'bg-indigo-500', 'bg-orange-500'];
      const randomColor = colors[Math.abs(item.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length];

      return {
        id: item.id,
        user_id: item.user_id,
        nama: item.nama,
        email: item.email,
        noHp: item.no_hp,
        asalInstansi: item.asal_instansi,
        jurusan: item.jurusan || '-',
        bidangTujuan: item.bidang_tujuan,
        tanggalMulai: item.tanggal_mulai,
        tanggalSelesai: item.tanggal_selesai,
        status: item.status,
        catatan: item.catatan || '',
        tanggalDaftar: item.tanggal_daftar,
        tanggalReview: item.tanggal_review,
        initials,
        color: randomColor,
        berkas: berkasObj
      };
    });

    setData(prev => {
      if (showNotification && prev.length > 0 && mappedData.length > prev.length) {
        const diffCount = mappedData.length - prev.length;
        showToast(`🔔 ${diffCount} pengajuan baru masuk!`, 'info');
      }
      return mappedData;
    });
  }, []);

  // ── Load submissions from Supabase on mount and listen to Realtime updates ─
  useEffect(() => {
    fetchPengajuan();

    const channel = supabase
      .channel('pengajuan-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pengajuans' },
        (payload) => {
          const isInsert = payload.eventType === 'INSERT';
          fetchPengajuan(isInsert);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPengajuan]);

  // ── Filter & Search ──────────────────────────────────────────────────────────
  const filtered = data.filter((row) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      row.nama.toLowerCase().includes(q) ||
      row.asalInstansi.toLowerCase().includes(q) ||
      row.bidangTujuan.toLowerCase().includes(q) ||
      row.id.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'Semua' || row.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // ── Approve Handler ──────────────────────────────────────────────────────────
  const handleApprove = async (item, approvedEmail) => {
    const now = new Date().toISOString();
    
    // Generate a secure random password for the participant
    const generateRandomPassword = () => {
      const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let pass = '';
      for (let i = 0; i < 8; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return pass;
    };
    
    const generatedPassword = generateRandomPassword();
    let newUserId = item.user_id;

    // Get current admin user to prevent using admin user_id (sharing domain/localstorage on localhost)
    const { data: { user: adminUser } } = await supabase.auth.getUser();
    const adminUserId = adminUser ? adminUser.id : null;

    if (newUserId === adminUserId) {
      newUserId = null;
    }

    // Check if newUserId belongs to a different email address in existing database records
    if (newUserId) {
      try {
        const { data: mismatchRow } = await supabase
          .from('pengajuans')
          .select('email')
          .eq('user_id', newUserId)
          .neq('email', approvedEmail)
          .limit(1)
          .maybeSingle();

        if (mismatchRow) {
          newUserId = null;
        }
      } catch (err) {
        console.error('Error checking user_id email mismatch:', err);
      }
    }

    // If newUserId is null, check if this email already has a user_id linked in the database
    if (!newUserId) {
      try {
        const { data: existingRow } = await supabase
          .from('pengajuans')
          .select('user_id')
          .eq('email', approvedEmail)
          .not('user_id', 'is', null)
          .neq('user_id', adminUserId)
          .limit(1)
          .maybeSingle();

        if (existingRow && existingRow.user_id) {
          newUserId = existingRow.user_id;
        }
      } catch (dbErr) {
        console.error('Error fetching existing user_id:', dbErr);
      }
    }

    // 1. Create a user in Supabase Auth if not already linked to an auth user
    if (!newUserId) {
      try {
        const supabaseUrl = 'https://iockkpwbjidtphcgtplp.supabase.co';
        const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvY2trcHdiamlkdHBoY2d0cGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNTEwMjMsImV4cCI6MjA5NTgyNzAyM30.vkI65-Rxd6cErUQ7WpkiYH2HErBSPVC0B30X4vEnk5I';
        
        // Temporary client with persistSession: false to prevent active admin session from being replaced
        const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
          auth: { persistSession: false }
        });
        
        const { data: signUpData, error: signUpError } = await tempClient.auth.signUp({
          email: approvedEmail,
          password: generatedPassword,
          options: {
            data: {
              name: item.nama,
              phone: item.noHp
            }
          }
        });
        
        if (signUpError) {
          console.error('Sign up error:', signUpError);
          if (signUpError.message.includes('already registered') || signUpError.code === 'user_already_exists') {
            alert('Email ini sudah terdaftar di Supabase Auth. Silakan hapus email tersebut dari dashboard Supabase Auth Anda terlebih dahulu, atau gunakan email lain untuk peserta ini.');
          } else {
            alert('Gagal membuat akun Auth: ' + signUpError.message);
          }
          return;
        } else if (signUpData && signUpData.user) {
          newUserId = signUpData.user.id;
        }
      } catch (err) {
        console.error('Failed to create auth user:', err);
        alert('Terjadi kesalahan saat membuat akun Auth.');
        return;
      }
    }

    // 2. Update status pengajuan di database
    const { error: updateError } = await supabase
      .from('pengajuans')
      .update({ 
        status: 'Disetujui', 
        tanggal_review: now,
        user_id: newUserId,
        email: approvedEmail
      })
      .eq('id', item.id);

    if (updateError) {
      alert('Gagal menyetujui pengajuan: ' + updateError.message);
      return;
    }

    // 3. Masukkan ke tabel pesertas
    const { error: insertError } = await supabase
      .from('pesertas')
      .insert({
        pengajuan_id: item.id,
        user_id: newUserId,
        nama: item.nama,
        email: approvedEmail,
        no_hp: item.noHp,
        asal_instansi: item.asalInstansi,
        bidang_tujuan: item.bidangTujuan,
        tanggal_mulai: item.tanggalMulai,
        tanggal_selesai: item.tanggalSelesai,
        status: 'Aktif'
      });

    if (insertError) {
      console.error('Gagal memasukkan peserta magang aktif:', insertError);
    }

    setApproveItem(null);
    setDetailItem(null);
    
    // Show copy credentials popup
    setCredentials({
      email: approvedEmail,
      password: generatedPassword,
      nama: item.nama
    });
    
    fetchPengajuan();
  };

  // ── Reject Handler ───────────────────────────────────────────────────────────
  const handleReject = async (item, alasan) => {
    const now = new Date().toISOString();

    // Update status pengajuan di database
    const { error } = await supabase
      .from('pengajuans')
      .update({ 
        status: 'Ditolak', 
        catatan: alasan, 
        tanggal_review: now 
      })
      .eq('id', item.id);

    if (error) {
      alert('Gagal menolak pengajuan: ' + error.message);
      return;
    }

    setRejectItem(null);
    setDetailItem(null);
    showToast(`❌ Pengajuan ${item.nama} ditolak.`, 'error');
    fetchPengajuan();
  };

  const stats = [
    { label: 'Total Pengajuan', value: data.length, icon: ClipboardList, bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'Menunggu Review', value: data.filter((d) => d.status === 'Menunggu').length, icon: Clock, bg: 'bg-yellow-50', color: 'text-yellow-500' },
    { label: 'Disetujui', value: data.filter((d) => d.status === 'Disetujui').length, icon: CheckCircle2, bg: 'bg-green-50', color: 'text-green-500' },
    { label: 'Ditolak', value: data.filter((d) => d.status === 'Ditolak').length, icon: XCircle, bg: 'bg-red-50', color: 'text-red-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Modals */}
      {detailItem && (
        <DetailModal
          pengajuan={detailItem}
          onClose={() => setDetailItem(null)}
          onApprove={(item) => { setApproveItem(item); }}
          onReject={(item) => { setRejectItem(item); }}
        />
      )}
      {approveItem && (
        <ApproveModal
          pengajuan={approveItem}
          onClose={() => setApproveItem(null)}
          onConfirm={handleApprove}
        />
      )}
      {rejectItem && (
        <RejectModal
          pengajuan={rejectItem}
          onClose={() => setRejectItem(null)}
          onConfirm={handleReject}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {credentials && (
        <CredentialsModal
          credentials={credentials}
          onClose={() => setCredentials(null)}
        />
      )}

      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">
              Dashboard
            </span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="font-semibold text-blue-600">Pengajuan Magang</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
            Pengajuan Magang
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Review dan kelola semua permohonan magang yang masuk
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, bg, color }) => (
          <div
            key={label}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center ${color} flex-shrink-0`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-stretch sm:items-center flex-1">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama, instansi, ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-white border border-gray-200 text-sm rounded-lg py-2 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
              />
            </div>

            {/* Filter Status */}
            <div className="relative w-full sm:w-44">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-between w-full bg-white border border-gray-200 text-sm text-gray-600 rounded-lg py-2 px-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center truncate">
                  <Filter className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{filterStatus}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>
              {isFilterOpen && (
                <div className="absolute top-full mt-1 left-0 w-full bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-10">
                  {['Semua', 'Menunggu', 'Disetujui', 'Ditolak'].map((s) => (
                    <button
                      key={s}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        filterStatus === s
                          ? 'text-blue-600 font-medium'
                          : 'text-gray-700'
                      }`}
                      onClick={() => {
                        setFilterStatus(s);
                        setIsFilterOpen(false);
                        setCurrentPage(1);
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <span className="text-xs text-gray-400 self-end sm:self-auto">
            {filtered.length} pengajuan ditemukan
          </span>
        </div>


        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 font-semibold">Pemohon</th>
                <th className="px-6 py-4 font-semibold">Instansi</th>
                <th className="px-6 py-4 font-semibold">Bidang & Durasi</th>
                <th className="px-6 py-4 font-semibold">Mendaftar</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-gray-400"
                  >
                    <ClipboardList className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="font-medium text-gray-500">
                      Tidak ada pengajuan ditemukan
                    </p>
                    <p className="text-xs mt-1">
                      Coba ubah filter atau kata kunci pencarian
                    </p>
                  </td>
                </tr>
              ) : (
                paginated.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar row={row} />
                        <div>
                          <p className="font-semibold text-gray-800">
                            {row.nama}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {row.email}
                          </p>
                          <p className="text-xs text-gray-300">ID: {row.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-700">
                        {row.asalInstansi}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {row.jurusan || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-700">
                        {row.bidangTujuan}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {hitungDurasi(row.tanggalMulai, row.tanggalSelesai)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700 text-xs">
                        {fmtDate(row.tanggalDaftar)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Detail/Review */}
                        <button
                          onClick={() => setDetailItem(row)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Review
                        </button>

                        {/* Quick approve */}
                        {row.status === 'Menunggu' && (
                          <>
                            <button
                              onClick={() => setApproveItem(row)}
                              className="p-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                              title="Setujui"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setRejectItem(row)}
                              className="p-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                              title="Tolak"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-between items-center">
            <p className="text-xs text-gray-400">
              Menampilkan {(currentPage - 1) * perPage + 1}–
              {Math.min(currentPage * perPage, filtered.length)} dari{' '}
              {filtered.length} pengajuan
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === p
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPengajuan;
