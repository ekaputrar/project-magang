import React from 'react'

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
)

const StatsCards = ({ peserta, absensiLogs, loading }) => {
  // ── Hitung statistik dari data nyata ──────────────────────────────────────
  const totalHadir = (absensiLogs || []).filter(
    l => l.status === 'Hadir' || l.status === 'Terlambat'
  ).length

  const totalIzin = (absensiLogs || []).filter(
    l => l.status === 'Izin' || l.status === 'Sakit'
  ).length

  const statusMagang = peserta?.status || 'Tidak Aktif'
  const isAktif = statusMagang === 'Aktif'

  // Hitung durasi & progres magang (dalam hari kerja)
  const mulai = peserta?.tanggal_mulai ? new Date(peserta.tanggal_mulai) : null
  const selesai = peserta?.tanggal_selesai ? new Date(peserta.tanggal_selesai) : null
  const now = new Date()

  let totalDays = 0
  let elapsedDays = 0
  let progressPct = 0

  if (mulai && selesai) {
    totalDays = Math.max(1, Math.round((selesai - mulai) / (1000 * 60 * 60 * 24)))
    elapsedDays = Math.max(0, Math.min(totalDays, Math.round((now - mulai) / (1000 * 60 * 60 * 24))))
    progressPct = Math.round((elapsedDays / totalDays) * 100)
  }

  // Tingkat kehadiran
  const totalAbsensi = (absensiLogs || []).length
  const tingkatPct = totalAbsensi > 0
    ? Math.round((totalHadir / totalAbsensi) * 100)
    : 0

  const stats = [
    {
      id: 'status',
      label: 'Status Magang',
      value: loading ? null : statusMagang,
      badge: loading ? null : {
        text: isAktif ? 'Terverifikasi' : 'Belum Aktif',
        color: isAktif ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500',
      },
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      progress: null,
      subLabel: null,
    },
    {
      id: 'kehadiran',
      label: 'Total Kehadiran',
      value: loading ? null : totalHadir,
      unit: 'Hari',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      progress: loading ? null : { value: tingkatPct, max: 100, color: 'bg-green-500' },
      subLabel: loading ? null : `${tingkatPct}% tingkat kehadiran`,
    },
    {
      id: 'izin',
      label: 'Total Izin / Sakit',
      value: loading ? null : totalIzin,
      unit: 'Hari',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      progress: loading ? null : {
        value: progressPct,
        max: 100,
        color: progressPct >= 80 ? 'bg-green-500' : progressPct >= 50 ? 'bg-yellow-400' : 'bg-blue-500',
      },
      subLabel: loading ? null : (mulai && selesai
        ? `${elapsedDays} dari ${totalDays} hari dijalani`
        : 'Periode belum diset'),
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
        >
          {/* Top row */}
          <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 ${stat.iconBg} ${stat.iconColor} rounded-xl flex items-center justify-center`}>
              {stat.icon}
            </div>
            {stat.badge && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stat.badge.color}`}>
                {stat.badge.text}
              </span>
            )}
          </div>

          {/* Label */}
          <p className="text-gray-500 text-xs mb-1">{stat.label}</p>

          {/* Value */}
          {loading ? (
            <Skeleton className="h-8 w-20 mt-1" />
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
              {stat.unit && <span className="text-gray-500 text-sm">{stat.unit}</span>}
            </div>
          )}

          {/* Progress bar */}
          {stat.progress && (
            <div className="mt-3">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${stat.progress.color} rounded-full transition-all duration-700`}
                  style={{ width: `${Math.min(stat.progress.value, 100)}%` }}
                />
              </div>
              {stat.subLabel && (
                <p className="text-xs text-gray-400 mt-1">{stat.subLabel}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default StatsCards
