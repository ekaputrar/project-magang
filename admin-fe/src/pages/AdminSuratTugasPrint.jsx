import React, { useState, useEffect } from 'react';
import { Printer, FileText, Info, Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

// ─── Format date helper ──────────────────────────────────────────────────────
const formatDateLong = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const months = [
    'Januari','Februari','Maret','April','Mei','Juni',
    'Juli','Agustus','September','Oktober','November','Desember',
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

// ─── Global print style injected into <head> ─────────────────────────────────
const PRINT_STYLE = `
  @media print {
    /* Sembunyikan semua elemen UI */
    .no-print { display: none !important; }

    /* Reset page */
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
    }

    /* Ukuran halaman A4, margin surat dinas */
    @page {
      size: A4 portrait;
      margin: 20mm 25mm 20mm 30mm;
    }

    /* Paper container: hapus semua shadow, border, padding layar */
    .print-area {
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      box-shadow: none !important;
      border: none !important;
      border-radius: 0 !important;
      min-height: unset !important;
    }

    /* Paksa warna tabel header */
    .thead-blue th {
      background-color: #1e3a8a !important;
      color: white !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Paksa warna zebra */
    .tr-even td {
      background-color: #f9fafb !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Tidak ada page break di tengah tabel */
    table { page-break-inside: avoid; }
    tr    { page-break-inside: avoid; }
  }
`;

// ─── Main Component ──────────────────────────────────────────────────────────
const AdminSuratTugasPrint = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [surat, setSurat]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  // Inject print CSS into <head> once
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.id = 'spt-print-style';
    styleEl.innerHTML = PRINT_STYLE;
    if (!document.getElementById('spt-print-style')) {
      document.head.appendChild(styleEl);
    }
    return () => {
      const el = document.getElementById('spt-print-style');
      if (el) el.remove();
    };
  }, []);

  // Fetch data
  useEffect(() => {
    if (!id) {
      setError('ID surat tugas tidak ditemukan.');
      setLoading(false);
      return;
    }
    (async () => {
      const { data, error: fetchErr } = await supabase
        .from('surat_tugas')
        .select('*')
        .eq('id', id)
        .single();
      if (fetchErr || !data) {
        setError('Surat tugas tidak ditemukan. ' + (fetchErr?.message || ''));
      } else {
        setSurat(data);
      }
      setLoading(false);
    })();
  }, [id]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef1f6] flex items-center justify-center font-poppins">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-medium">Memuat dokumen surat tugas…</p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !surat) {
    return (
      <div className="min-h-screen bg-[#eef1f6] flex items-center justify-center font-poppins">
        <div className="text-center bg-white rounded-2xl p-10 shadow-lg max-w-sm">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Dokumen Tidak Ditemukan</h3>
          <p className="text-sm text-gray-400 mb-6">{error || 'Surat tugas tidak tersedia.'}</p>
          <button
            onClick={() => navigate('/admin/surat-tugas')}
            className="px-5 py-2 bg-[#1e3a8a] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 transition-colors"
          >
            Kembali ke Daftar
          </button>
        </div>
      </div>
    );
  }

  const pegawaiData = Array.isArray(surat.pegawai) ? surat.pegawai : [];
  const dasarLines  = (surat.dasar_penugasan || '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  // ── Shared inline-style helpers ────────────────────────────────────────────
  const tnr  = { fontFamily: "'Times New Roman', Times, serif" };
  const bold = { ...tnr, fontWeight: 'bold' };

  return (
    <div className="min-h-screen bg-[#eef1f6] flex flex-col font-poppins">

      {/* ══ TOP BAR — hidden on print ══════════════════════════════════════════ */}
      <div className="no-print sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[960px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/surat-tugas')}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#1e293b] rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Preview Cetak — SPT</p>
                <p className="text-xs text-gray-400">Nomor: {surat.nomor_surat}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
              Siap Cetak
            </span>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-2 bg-[#1e293b] text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Cetak / Simpan PDF
            </button>
          </div>
        </div>
      </div>

      {/* ══ DOCUMENT SCROLL AREA ═══════════════════════════════════════════════ */}
      <div className="no-print flex-1 py-8 overflow-y-auto">
        <div className="max-w-[960px] mx-auto px-4">

          {/* Tips bar */}
          <div className="flex items-start gap-3 bg-white border border-blue-100 rounded-xl px-4 py-3 mb-6 shadow-sm text-sm text-gray-500">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <span>
              Tekan <strong>Cetak / Simpan PDF</strong> atau <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl+P</kbd>.
              Di dialog cetak pilih: Tujuan → <strong>Simpan sebagai PDF</strong>, Ukuran → <strong>A4</strong>,
              Margin → <strong>Tidak Ada</strong>, centang <strong>Grafis Latar</strong>.
            </span>
          </div>

          {/* ── A4 Paper shadow preview ────────────────────────────────── */}
          <div
            className="print-area bg-white rounded-sm shadow-[0_4px_30px_rgba(0,0,0,0.12)] border border-gray-100 mx-auto"
            style={{
              width: '210mm',
              minHeight: '297mm',
              padding: '20mm 25mm 20mm 30mm',
              boxSizing: 'border-box',
            }}
          >
            <SuratBody
              surat={surat}
              pegawaiData={pegawaiData}
              dasarLines={dasarLines}
              tnr={tnr}
              bold={bold}
            />
          </div>

          {/* Ruler indicator */}
          <p className="no-print text-center text-xs text-gray-400 mt-4 pb-8">
            A4 (210 × 297 mm) · Font: Times New Roman 11pt · Margin: Atas 20 / Kiri 30 / Kanan 25 / Bawah 20 mm
          </p>
        </div>
      </div>

      {/* ══ PRINT AREA — only visible during Ctrl+P ════════════════════════════
           Semua yang tampil dalam cetak ada di sini; elemen .no-print disembunyikan CSS */}
      <div className="print-area" style={{ display: 'none' }}>
        {/* print CSS @page handles margins, so no extra padding needed */}
        <SuratBody
          surat={surat}
          pegawaiData={pegawaiData}
          dasarLines={dasarLines}
          tnr={tnr}
          bold={bold}
        />
      </div>

      {/* Inline CSS — makes the hidden print div visible & hides screen divs during print */}
      <style>{`
        @media print {
          /* Tampilkan print-area yang tadinya display:none */
          .print-area[style*="display: none"] {
            display: block !important;
          }
          /* Sembunyikan preview layar (yang tidak punya style display:none) */
          .print-area:not([style*="display: none"]) {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SuratBody — konten surat menggunakan inline styles sepenuhnya
// agar identik antara preview layar dan hasil cetak PDF
// ══════════════════════════════════════════════════════════════════════════════
const SuratBody = ({ surat, pegawaiData, dasarLines, tnr, bold }) => {
  const cellStyle = (extra = {}) => ({
    ...tnr,
    fontSize: '11pt',
    border: '1px solid #d1d5db',
    padding: '6px 10px',
    verticalAlign: 'top',
    lineHeight: '1.6',
    ...extra,
  });

  const thStyle = (extra = {}) => ({
    fontFamily: 'Arial, sans-serif',
    fontSize: '10pt',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#1e3a8a',
    border: '1px solid #374151',
    padding: '7px 10px',
    textAlign: 'left',
    ...extra,
  });

  return (
    <div style={{ ...tnr, fontSize: '11pt', lineHeight: '1.6', color: '#111' }}>

      {/* ── KOP SURAT ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '3px solid #000', paddingBottom: '10px' }}>
        {/* Logo kiri */}
        <div style={{ flexShrink: 0, width: '76px' }}>
          <img src="/logo-sidoarjo.png" alt="Logo Sidoarjo"
            style={{ width: '72px', height: '72px', objectFit: 'contain', display: 'block' }} />
        </div>
        {/* Teks kop */}
        <div style={{ flex: 1, textAlign: 'center', padding: '0 10px' }}>
          <div style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: '13pt',
            fontWeight: 'bold',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: '#111',
          }}>PEMERINTAH KABUPATEN SIDOARJO</div>
          <div style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: '16pt',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: '#1e3a8a',
            margin: '2px 0',
          }}>DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL</div>
          <div style={{ ...tnr, fontSize: '9.5pt', color: '#555', lineHeight: '1.5', marginTop: '4px' }}>
            Jl. Jaksa Agung Suprapto No. 5, Sidoarjo 61218<br />
            Telp. (031) 8921234 — Fax. (031) 8921235 — Email: dukcapil@sidoarjokab.go.id
          </div>
        </div>
        {/* Logo kanan */}
        <div style={{ flexShrink: 0, width: '76px', textAlign: 'right' }}>
          <img src="/logo-disdukcapil.png" alt="Logo Disdukcapil"
            style={{ width: '76px', height: '72px', objectFit: 'contain', display: 'block', marginLeft: 'auto' }} />
        </div>
      </div>
      {/* Garis tipis */}
      <div style={{ borderBottom: '1px solid #000', marginBottom: '16px' }}></div>

      {/* ── JUDUL ─────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{
          ...bold, fontSize: '13pt',
          textDecoration: 'underline',
          textDecorationThickness: '1.5px',
          textUnderlineOffset: '4px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}>SURAT PERINTAH TUGAS</div>
        <div style={{ ...tnr, fontSize: '11pt', marginTop: '8px' }}>
          Nomor : <span style={bold}>{surat.nomor_surat}</span>
        </div>
      </div>

      {/* ── TANGGAL & DASAR ───────────────────────────────────────── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px' }}>
        <tbody>
          <tr style={{ verticalAlign: 'top' }}>
            <td style={{ ...tnr, fontSize: '11pt', width: '120px', paddingBottom: '6px' }}>Tanggal Surat</td>
            <td style={{ ...tnr, fontSize: '11pt', width: '16px', paddingBottom: '6px' }}>:</td>
            <td style={{ ...tnr, fontSize: '11pt', paddingBottom: '6px' }}>{formatDateLong(surat.tanggal_surat)}</td>
          </tr>
          <tr style={{ verticalAlign: 'top' }}>
            <td style={{ ...tnr, fontSize: '11pt' }}>Dasar</td>
            <td style={{ ...tnr, fontSize: '11pt' }}>:</td>
            <td style={{ ...tnr, fontSize: '11pt' }}>
              <ol style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.7' }}>
                {dasarLines.map((line, i) => (
                  <li key={i} style={{ textAlign: 'justify', marginBottom: '3px' }}>
                    {line.replace(/^\d+\.\s*/, '')}
                  </li>
                ))}
              </ol>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── MEMERINTAHKAN ─────────────────────────────────────────── */}
      <div style={{
        textAlign: 'center', ...bold,
        fontSize: '12pt',
        letterSpacing: '0.18em',
        margin: '20px 0 10px',
      }}>MEMERINTAHKAN</div>

      {/* ── KEPADA ────────────────────────────────────────────────── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
        <tbody>
          <tr>
            <td style={{ ...bold, fontSize: '11pt', width: '120px' }}>Kepada</td>
            <td style={{ ...bold, fontSize: '11pt', width: '16px' }}>:</td>
            <td style={{ ...tnr, fontSize: '11pt' }}></td>
          </tr>
        </tbody>
      </table>

      {/* ── TABEL PEGAWAI ─────────────────────────────────────────── */}
      {pegawaiData.length > 0 && (
        <table className="thead-blue" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px' }}>
          <thead>
            <tr>
              <th className="thead-blue" style={thStyle({ width: '28px', textAlign: 'center' })}>No</th>
              <th className="thead-blue" style={thStyle({ width: '22%' })}>Nama</th>
              <th className="thead-blue" style={thStyle({ width: '18%' })}>NIP</th>
              <th className="thead-blue" style={thStyle({ width: '18%' })}>Pangkat / Gol.</th>
              <th className="thead-blue" style={thStyle()}>Jabatan</th>
            </tr>
          </thead>
          <tbody>
            {pegawaiData.map((p, i) => (
              <tr key={i} className={i % 2 === 1 ? 'tr-even' : ''}>
                <td style={cellStyle({ textAlign: 'center', backgroundColor: i % 2 === 1 ? '#f9fafb' : 'white' })}>{i + 1}</td>
                <td style={cellStyle({ fontWeight: 'bold', backgroundColor: i % 2 === 1 ? '#f9fafb' : 'white' })}>{p.nama || '-'}</td>
                <td style={cellStyle({ backgroundColor: i % 2 === 1 ? '#f9fafb' : 'white' })}>{p.nip || '-'}</td>
                <td style={cellStyle({ backgroundColor: i % 2 === 1 ? '#f9fafb' : 'white' })}>{p.pangkat || '-'}</td>
                <td style={cellStyle({ backgroundColor: i % 2 === 1 ? '#f9fafb' : 'white' })}>{p.jabatan || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ── UNTUK ─────────────────────────────────────────────────── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8px' }}>
        <tbody>
          <tr>
            <td style={{ ...bold, fontSize: '11pt', width: '120px' }}>Untuk</td>
            <td style={{ ...bold, fontSize: '11pt', width: '16px' }}>:</td>
            <td style={{ ...tnr, fontSize: '11pt' }}></td>
          </tr>
        </tbody>
      </table>

      {/* ── ISI TUGAS ─────────────────────────────────────────────── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
        <tbody>
          <tr style={{ verticalAlign: 'top' }}>
            <td style={{ ...tnr, fontSize: '11pt', width: '130px', paddingBottom: '7px' }}>Tujuan / Maksud</td>
            <td style={{ ...tnr, fontSize: '11pt', width: '16px', paddingBottom: '7px' }}>:</td>
            <td style={{ ...tnr, fontSize: '11pt', paddingBottom: '7px', textAlign: 'justify', lineHeight: '1.7' }}>
              {surat.tujuan_tugas || surat.judul || '-'}
            </td>
          </tr>
          {surat.tempat_tugas && (
            <tr style={{ verticalAlign: 'top' }}>
              <td style={{ ...tnr, fontSize: '11pt', paddingBottom: '7px' }}>Tempat Tugas</td>
              <td style={{ ...tnr, fontSize: '11pt', paddingBottom: '7px' }}>:</td>
              <td style={{ ...tnr, fontSize: '11pt', paddingBottom: '7px' }}>{surat.tempat_tugas}</td>
            </tr>
          )}
          {(surat.tanggal_mulai || surat.tanggal_selesai) && (
            <tr style={{ verticalAlign: 'top' }}>
              <td style={{ ...tnr, fontSize: '11pt', paddingBottom: '7px' }}>Tanggal</td>
              <td style={{ ...tnr, fontSize: '11pt', paddingBottom: '7px' }}>:</td>
              <td style={{ ...tnr, fontSize: '11pt', paddingBottom: '7px' }}>
                {formatDateLong(surat.tanggal_mulai)} s.d. {formatDateLong(surat.tanggal_selesai)}
              </td>
            </tr>
          )}
          {surat.kendaraan_dinas && (
            <tr style={{ verticalAlign: 'top' }}>
              <td style={{ ...tnr, fontSize: '11pt', paddingBottom: '7px' }}>Kendaraan Dinas</td>
              <td style={{ ...tnr, fontSize: '11pt', paddingBottom: '7px' }}>:</td>
              <td style={{ ...tnr, fontSize: '11pt', paddingBottom: '7px' }}>{surat.kendaraan_dinas}</td>
            </tr>
          )}
          {surat.sumber_biaya && (
            <tr style={{ verticalAlign: 'top' }}>
              <td style={{ ...tnr, fontSize: '11pt', paddingBottom: '7px' }}>Biaya Perjalanan</td>
              <td style={{ ...tnr, fontSize: '11pt', paddingBottom: '7px' }}>:</td>
              <td style={{ ...tnr, fontSize: '11pt', paddingBottom: '7px' }}>{surat.sumber_biaya}</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ── PENUTUP ───────────────────────────────────────────────── */}
      <p style={{
        ...tnr, fontSize: '11pt',
        textAlign: 'justify',
        lineHeight: '1.8',
        marginBottom: '30px',
        marginTop: '4px',
      }}>
        Demikian Surat Perintah Tugas ini dibuat untuk dapat dilaksanakan dengan penuh tanggung jawab.
        Setelah selesai melaksanakan tugas, pegawai yang bersangkutan diwajibkan membuat laporan
        pelaksanaan tugas kepada Kepala Dinas.
      </p>

      {/* ── TANDA TANGAN ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

        {/* Mengetahui (kiri) */}
        {surat.mengetahui_nama && (
          <div style={{ width: '43%', textAlign: 'center', ...tnr, fontSize: '11pt' }}>
            <div>Mengetahui,</div>
            <div style={{ marginBottom: '78px', marginTop: '2px' }}>
              {surat.mengetahui_jabatan || 'Sekretaris Dinas'}
            </div>
            <div style={{
              borderBottom: '1.5px solid #374151',
              display: 'inline-block',
              minWidth: '190px',
              paddingBottom: '2px',
            }}>
              <span style={bold}>{surat.mengetahui_nama}</span>
            </div>
            <div style={{ ...tnr, fontSize: '10pt', marginTop: '5px', color: '#374151' }}>
              NIP. {surat.mengetahui_nip || '-'}
            </div>
          </div>
        )}

        {/* Penandatangan (kanan) */}
        <div style={{
          width: surat.mengetahui_nama ? '48%' : '46%',
          textAlign: 'center',
          marginLeft: surat.mengetahui_nama ? '0' : 'auto',
          ...tnr,
          fontSize: '11pt',
        }}>
          <div>Sidoarjo, {formatDateLong(surat.tanggal_surat)}</div>
          <div style={{ marginBottom: '78px', marginTop: '2px' }}>
            {surat.penandatangan_jabatan || 'Kepala Dinas Kependudukan dan Pencatatan Sipil Kabupaten Sidoarjo,'}
          </div>
          <div style={{
            borderBottom: '1.5px solid #374151',
            display: 'inline-block',
            minWidth: '190px',
            paddingBottom: '2px',
          }}>
            <span style={bold}>{surat.penandatangan_nama || '________________________'}</span>
          </div>
          <div style={{ ...tnr, fontSize: '10pt', marginTop: '5px', color: '#374151' }}>
            NIP. {surat.penandatangan_nip || '-'}
          </div>
        </div>
      </div>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <div style={{
        borderTop: '1px solid #e5e7eb',
        marginTop: '36px',
        paddingTop: '7px',
        display: 'flex',
        justifyContent: 'space-between',
        ...tnr,
        fontSize: '8pt',
        color: '#9ca3af',
      }}>
        <span>Dicetak melalui SIPPMIT — Dinas Dukcapil Kabupaten Sidoarjo</span>
        <span>Halaman 1 dari 1</span>
      </div>
    </div>
  );
};

export default AdminSuratTugasPrint;
