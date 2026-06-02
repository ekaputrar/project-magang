import React, { useState, useMemo } from 'react'

// ─── Data template ────────────────────────────────────────────────────────────
const templates = [
  {
    id: 1,
    title: 'Tamplate Akta Kelahiran',
    desc: 'Surat resmi keterangan pelaksanaan program magang di Dukcapil Sidoarjo.',
    format: 'PDF',
    updated: '10 Apr 2026',
    downloads: 82,
    isNew: false,
    color: 'from-red-500 to-red-600',
    content: `SURAT KETERANGAN MAGANG\nNomor: 474/___/404.6.2/2026\n\nYang bertanda tangan di bawah ini, Kepala Dinas Kependudukan dan Pencatatan Sipil Kabupaten Sidoarjo, menerangkan bahwa:\n\nNama               : ____________________________\nNIM/NIS            : ____________________________\nProgram Studi      : ____________________________\nInstansi Asal      : ____________________________\nPeriode Magang     : ____________________________\n\nTelah melaksanakan kegiatan magang di Dinas Kependudukan dan Pencatatan Sipil Kabupaten Sidoarjo dengan baik dan penuh tanggung jawab.\n\nDemikian surat keterangan ini dibuat untuk digunakan sebagaimana mestinya.\n\n\t\t\t\t\tSidoarjo, ________________ 2026\n\t\t\t\t\tKepala Dinas Dukcapil Sidoarjo,\n\n\n\n\t\t\t\t\t_________________________________\n\t\t\t\t\tNIP. ____________________________`,
  },
  {
    id: 2,
    title: 'Tamplate Pindah Datang',
    desc: 'Template laporan akhir komprehensif yang wajib diserahkan sebelum selesai masa magang.',
    format: 'PDF',
    updated: '15 Apr 2026',
    downloads: 18,
    isNew: true,
    color: 'from-red-500 to-red-600',
    content: `FORMULIR PINDAH DATANG\nDinas Kependudukan dan Pencatatan Sipil Kabupaten Sidoarjo\n\n─────────────────────────────────────────────────\nDATA PEMOHON\n─────────────────────────────────────────────────\nNama Lengkap    : ____________________________\nNIK             : ____________________________\nJenis Kelamin   : ____________________________\nTempat/Tgl Lahir: ____________________________\nAgama           : ____________________________\nStatus Perkawinan: ___________________________\nPendidikan      : ____________________________\nPekerjaan       : ____________________________\n\n─────────────────────────────────────────────────\nALAMAT ASAL\n─────────────────────────────────────────────────\nProvinsi        : ____________________________\nKab/Kota        : ____________________________\nKecamatan       : ____________________________\nKelurahan/Desa  : ____________________________\nRT/RW           : ____________________________\nAlamat Lengkap  : ____________________________\n\n─────────────────────────────────────────────────\nALAMAT TUJUAN\n─────────────────────────────────────────────────\nProvinsi        : ____________________________\nKab/Kota        : ____________________________\nKecamatan       : ____________________________\nKelurahan/Desa  : ____________________________\nRT/RW           : ____________________________\nAlamat Lengkap  : ____________________________\nAlasan Pindah   : ____________________________`,
  },
  {
    id: 3,
    title: 'Tamplate Akta Kematian',
    desc: 'Formulir penilaian kinerja peserta magang oleh pembimbing lapangan setiap bulan.',
    format: 'PDF',
    updated: '08 Apr 2026',
    downloads: 67,
    isNew: false,
    color: 'from-red-500 to-red-600',
    content: `FORMULIR AKTA KEMATIAN\nDinas Kependudukan dan Pencatatan Sipil Kabupaten Sidoarjo\n\n─────────────────────────────────────────────────\nDATA ALMARHUM/ALMARHUMAH\n─────────────────────────────────────────────────\nNama Lengkap    : ____________________________\nNIK             : ____________________________\nJenis Kelamin   : ____________________________\nTempat/Tgl Lahir: ____________________________\nAgama           : ____________________________\nStatus Perkawinan: ___________________________\nAlamat Terakhir : ____________________________\n\n─────────────────────────────────────────────────\nDATA KEMATIAN\n─────────────────────────────────────────────────\nHari/Tanggal    : ____________________________\nPukul           : ____________________________\nTempat Meninggal: ____________________________\nSebab Kematian  : ____________________________\n\n─────────────────────────────────────────────────\nDATA PELAPOR\n─────────────────────────────────────────────────\nNama            : ____________________________\nNIK             : ____________________________\nHubungan        : ____________________________\nNo. Telepon     : ____________________________`,
  },
  {
    id: 4,
    title: 'Tamplate Pindah Keluar',
    desc: 'Template laporan akhir komprehensif yang wajib diserahkan sebelum selesai masa magang.',
    format: 'PDF',
    updated: '15 Apr 2026',
    downloads: 18,
    isNew: true,
    color: 'from-red-500 to-red-600',
    content: `FORMULIR PINDAH KELUAR\nDinas Kependudukan dan Pencatatan Sipil Kabupaten Sidoarjo\n\n─────────────────────────────────────────────────\nDATA PEMOHON\n─────────────────────────────────────────────────\nNama Lengkap    : ____________________________\nNIK             : ____________________________\nJenis Kelamin   : ____________________________\nTempat/Tgl Lahir: ____________________________\nNo. KK          : ____________________________\n\n─────────────────────────────────────────────────\nALAMAT ASAL (SIDOARJO)\n─────────────────────────────────────────────────\nKecamatan       : ____________________________\nKelurahan/Desa  : ____________________________\nRT/RW           : ____________________________\nAlamat Lengkap  : ____________________________\n\n─────────────────────────────────────────────────\nALAMAT TUJUAN\n─────────────────────────────────────────────────\nProvinsi        : ____________________________\nKab/Kota        : ____________________________\nKecamatan       : ____________________________\nKelurahan/Desa  : ____________________________\nRT/RW           : ____________________________\nAlamat Lengkap  : ____________________________\nAlasan Pindah   : ____________________________\nRencana Tinggal : ____________________________`,
  },
  {
    id: 5,
    title: 'Tamplate Laporan Akhir',
    desc: 'Template laporan akhir komprehensif yang wajib diserahkan sebelum selesai masa magang.',
    format: 'PDF',
    updated: '15 Apr 2026',
    downloads: 18,
    isNew: true,
    color: 'from-red-500 to-red-600',
    content: `LAPORAN AKHIR MAGANG\nDinas Kependudukan dan Pencatatan Sipil Kabupaten Sidoarjo\nTahun 2026\n\n─────────────────────────────────────────────────\nHALAMAN JUDUL\n─────────────────────────────────────────────────\n\nJUDUL LAPORAN:\n___________________________________________\n\nDisusun Oleh:\nNama   : ____________________________\nNIM    : ____________________________\nProdi  : ____________________________\nFakultas: ___________________________\nUniversitas: _________________________\n\n─────────────────────────────────────────────────\nBAB I - PENDAHULUAN\n─────────────────────────────────────────────────\n1.1 Latar Belakang\n[Isi di sini]\n\n1.2 Tujuan Magang\n[Isi di sini]\n\n1.3 Manfaat Magang\n[Isi di sini]\n\n─────────────────────────────────────────────────\nBAB II - GAMBARAN UMUM INSTANSI\n─────────────────────────────────────────────────\n[Isi di sini]\n\n─────────────────────────────────────────────────\nBAB III - KEGIATAN MAGANG\n─────────────────────────────────────────────────\n[Isi di sini]\n\n─────────────────────────────────────────────────\nBAB IV - PENUTUP\n─────────────────────────────────────────────────\n[Kesimpulan dan Saran]`,
  },
]

// ─── Preview Modal ────────────────────────────────────────────────────────────
const PreviewModal = ({ template, onClose }) => {
  if (!template) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #1a2e6e 0%, #1E40AF 100%)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">{template.title}</h2>
              <p className="text-blue-300 text-xs mt-0.5">Format {template.format} · Diperbarui {template.updated}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Pratinjau Dokumen · Halaman 1 dari 1
          </div>
          <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-md">{template.format}</span>
        </div>

        {/* Document content */}
        <div className="overflow-y-auto flex-1 bg-gray-200 p-6">
          <div className="bg-white shadow-xl mx-auto rounded-sm" style={{ maxWidth: '540px', minHeight: '700px', padding: '48px 52px' }}>
            {/* Letterhead */}
            <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-12 h-12 bg-primary-800 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-800 uppercase">Pemerintah Kabupaten Sidoarjo</p>
                  <p className="text-xs text-gray-600">Dinas Kependudukan dan Pencatatan Sipil</p>
                  <p className="text-xs text-gray-500">Jl. Gubernur Suryo No.1, Sidoarjo, Jawa Timur</p>
                </div>
              </div>
            </div>

            {/* Document body */}
            <pre className="whitespace-pre-wrap font-mono text-xs text-gray-700 leading-relaxed">
              {template.content}
            </pre>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between flex-shrink-0">
          <p className="text-xs text-gray-400">{template.downloads} unduhan · Versi terbaru</p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={() => downloadTemplate(template)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-800 hover:bg-primary-900 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Unduh Dokumen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Download helper ──────────────────────────────────────────────────────────
const downloadTemplate = (template) => {
  const header = `PEMERINTAH KABUPATEN SIDOARJO\nDINAS KEPENDUDUKAN DAN PENCATATAN SIPIL\nJl. Gubernur Suryo No.1, Sidoarjo, Jawa Timur\n${'═'.repeat(60)}\n\n`
  const footer = `\n\n${'─'.repeat(60)}\nDokumen ini diterbitkan oleh:\nDinas Kependudukan dan Pencatatan Sipil Kabupaten Sidoarjo\nDiperbarui: ${template.updated} | Format: ${template.format}\n${'─'.repeat(60)}`
  const content = header + template.content + footer

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `${template.title.replace(/\s+/g, '_')}_Dukcapil_Sidoarjo.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ─── PDF Icon SVG ─────────────────────────────────────────────────────────────
const PdfIcon = () => (
  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex flex-col items-center justify-center shadow-md shadow-red-100">
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
    <span className="text-white text-[8px] font-bold -mt-0.5">PDF</span>
  </div>
)

// ─── Template Card ────────────────────────────────────────────────────────────
const TemplateCard = ({ template, onPreview, viewMode }) => {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = () => {
    setDownloading(true)
    setTimeout(() => {
      downloadTemplate(template)
      setDownloading(false)
    }, 800)
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-4 flex items-center gap-4">
        <PdfIcon />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-bold text-gray-800 truncate">{template.title}</h3>
            {template.isNew && (
              <span className="flex-shrink-0 text-xs bg-green-100 text-green-600 font-semibold px-1.5 py-0.5 rounded">BARU</span>
            )}
            <span className="flex-shrink-0 text-xs bg-red-100 text-red-500 font-semibold px-1.5 py-0.5 rounded">{template.format}</span>
          </div>
          <p className="text-xs text-gray-400 truncate">{template.desc}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {template.updated}
            </span>
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {template.downloads} unduhan
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 bg-primary-800 hover:bg-primary-900 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all disabled:opacity-70"
          >
            {downloading ? (
              <svg className="animate-spin w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
            Unduh
          </button>
          <button
            onClick={() => onPreview(template)}
            className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold px-3 py-2 rounded-lg transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </button>
        </div>
      </div>
    )
  }

  // Grid card
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 overflow-hidden flex flex-col">
      {/* Top color bar */}
      <div className={`h-1 bg-gradient-to-r ${template.color}`} />

      <div className="p-5 flex flex-col flex-1">
        {/* Badges row */}
        <div className="flex items-start justify-between mb-4">
          <PdfIcon />
          <div className="flex gap-1.5">
            {template.isNew && (
              <span className="text-xs bg-green-100 text-green-600 font-bold px-2 py-0.5 rounded-md">BARU</span>
            )}
            <span className="text-xs bg-red-100 text-red-500 font-bold px-2 py-0.5 rounded-md">{template.format}</span>
          </div>
        </div>

        {/* Title & desc */}
        <h3 className="text-sm font-bold text-gray-800 mb-1.5 leading-tight">{template.title}</h3>
        <p className="text-xs text-gray-400 leading-relaxed flex-1">{template.desc}</p>

        {/* Meta */}
        <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Diperbarui {template.updated}
          </span>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {template.downloads} unduhan
          </span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            id={`unduh-btn-${template.id}`}
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center justify-center gap-1.5 bg-primary-800 hover:bg-primary-900 text-white text-xs font-semibold py-2.5 rounded-xl transition-all duration-150 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Mengunduh...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Unduh
              </>
            )}
          </button>
          <button
            id={`preview-btn-${template.id}`}
            onClick={() => onPreview(template)}
            className="inline-flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 text-xs font-semibold py-2.5 rounded-xl transition-all duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Halaman Template Operator ────────────────────────────────────────────────
const TemplatePage = () => {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('Semua Tipe')
  const [viewMode, setViewMode] = useState('grid')
  const [previewTemplate, setPreviewTemplate] = useState(null)

  const totalDownloads = templates.reduce((s, t) => s + t.downloads, 0)
  const pdfCount  = templates.filter(t => t.format === 'PDF').length
  const wordCount = templates.filter(t => t.format === 'Word').length

  const filtered = useMemo(() => templates.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                        t.desc.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'Semua Tipe' ||
                      (filterType === 'PDF' && t.format === 'PDF') ||
                      (filterType === 'Word' && t.format === 'Word') ||
                      (filterType === 'Baru' && t.isNew)
    return matchSearch && matchType
  }), [search, filterType])

  return (
    <div className="space-y-5">
      {/* Preview Modal */}
      {previewTemplate && (
        <PreviewModal template={previewTemplate} onClose={() => setPreviewTemplate(null)} />
      )}

      {/* ── Page heading ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Template Dokumen &amp; Operator Plavon</h2>
          <p className="text-sm text-gray-400 mt-0.5">Unduh dan kelola template dokumen resmi serta alat bantu operator sistem Plavon</p>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari template dokumen..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-48"
            />
          </div>

          {/* Filter dropdown */}
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="border border-gray-200 rounded-xl text-xs px-3 py-2 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
          >
            {['Semua Tipe', 'PDF', 'Word', 'Baru'].map(opt => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Template', value: templates.length, icon: '📄', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
          { label: 'Format PDF',     value: pdfCount,         icon: '🔴', iconBg: 'bg-red-100',  iconColor: 'text-red-500' },
          { label: 'Format Word',    value: wordCount,        icon: '🔵', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
          { label: 'Total Unduhan',  value: totalDownloads,   icon: '⬇️', iconBg: 'bg-green-100',iconColor: 'text-green-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs text-gray-400">{stat.label}</p>
              <p className="text-xl font-bold text-gray-800 leading-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section header with view toggle ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-primary-800 rounded-full" />
          <h3 className="text-sm font-bold text-gray-800">Daftar Template Dokumen</h3>
          {filtered.length !== templates.length && (
            <span className="text-xs text-gray-400">({filtered.length} dari {templates.length})</span>
          )}
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary-800 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary-800 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Template list/grid ── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-500">Tidak ada template yang ditemukan</p>
          <p className="text-xs text-gray-400 mt-1">Coba ubah kata kunci atau filter pencarian</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(t => (
            <TemplateCard key={t.id} template={t} onPreview={setPreviewTemplate} viewMode="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(t => (
            <TemplateCard key={t.id} template={t} onPreview={setPreviewTemplate} viewMode="list" />
          ))}
        </div>
      )}
    </div>
  )
}

export default TemplatePage
