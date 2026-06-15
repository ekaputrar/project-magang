import React from 'react'

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
)

const InfoMagang = ({ peserta, loading }) => {
  // ── Hitung progres ──────────────────────────────────────────────────────────
  const mulai = peserta?.tanggal_mulai ? new Date(peserta.tanggal_mulai) : null
  const selesai = peserta?.tanggal_selesai ? new Date(peserta.tanggal_selesai) : null
  const now = new Date()

  let progressPct = 0
  let elapsedDays = 0
  let totalDays = 0
  let progressLabel = '-'

  if (mulai && selesai) {
    totalDays = Math.max(1, Math.round((selesai - mulai) / (1000 * 60 * 60 * 24)))
    elapsedDays = Math.max(0, Math.min(totalDays, Math.round((now - mulai) / (1000 * 60 * 60 * 24))))
    progressPct = Math.round((elapsedDays / totalDays) * 100)
    progressLabel = `${elapsedDays} dari ${totalDays} hari telah dijalani`
  }

  const fmtTgl = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  }

  const info = [
    {
      label: 'Asal Instansi',
      value: peserta?.asal_instansi || '-',
      highlight: false,
    },
    {
      label: 'Bidang / Divisi',
      value: peserta?.bidang_tujuan || '-',
      highlight: true,
    },
    {
      label: 'Tanggal Mulai',
      value: fmtTgl(peserta?.tanggal_mulai),
      highlight: false,
    },
    {
      label: 'Tanggal Selesai',
      value: fmtTgl(peserta?.tanggal_selesai),
      highlight: false,
    },
  ]

  return (
    <div
      className="rounded-2xl p-5 h-full"
      style={{ background: 'linear-gradient(135deg, #1a2e6e 0%, #1E40AF 100%)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-yellow-400 bg-opacity-20 rounded-xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">Info Magang</h3>
          <p className="text-blue-300 text-xs">Data pesertaan aktif</p>
        </div>
      </div>

      {/* Info list */}
      <div className="space-y-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-blue-700 border-opacity-40 last:border-0">
                <Skeleton className="h-3 w-20 bg-blue-700" />
                <Skeleton className="h-3 w-24 bg-blue-700" />
              </div>
            ))
          : info.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-blue-700 border-opacity-40 last:border-0"
              >
                <span className="text-blue-300 text-xs">{item.label}</span>
                <span className={`text-xs font-semibold text-right max-w-[55%] truncate ${item.highlight ? 'text-yellow-400' : 'text-white'}`}>
                  {item.value}
                </span>
              </div>
            ))
        }
      </div>

      {/* Progress section */}
      <div className="mt-4 pt-4 border-t border-blue-700 border-opacity-40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-blue-300 text-xs">Progres Magang</span>
          {loading ? (
            <Skeleton className="h-3 w-8 bg-blue-700" />
          ) : (
            <span className="text-white text-xs font-semibold">{progressPct}%</span>
          )}
        </div>
        {loading ? (
          <Skeleton className="h-1.5 w-full bg-blue-700 rounded-full" />
        ) : (
          <div className="h-1.5 bg-blue-900 bg-opacity-50 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(progressPct, 100)}%` }}
            />
          </div>
        )}
        <p className="text-blue-400 text-xs mt-2">
          {loading ? '' : progressLabel}
        </p>
      </div>
    </div>
  )
}

export default InfoMagang
