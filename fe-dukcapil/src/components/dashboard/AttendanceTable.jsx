import React, { useState } from 'react'

const statusConfig = {
  Hadir:     { class: 'bg-green-100 text-green-600',  dot: 'bg-green-500' },
  Terlambat: { class: 'bg-orange-100 text-orange-600', dot: 'bg-orange-500' },
  Izin:      { class: 'bg-yellow-100 text-yellow-600', dot: 'bg-yellow-500' },
  Sakit:     { class: 'bg-yellow-100 text-yellow-600', dot: 'bg-yellow-500' },
  Alpa:      { class: 'bg-red-100 text-red-500',       dot: 'bg-red-500' },
  Absen:     { class: 'bg-red-100 text-red-500',       dot: 'bg-red-500' },
}

const DAY_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

const fmtTanggal = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return {
    date: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    day: DAY_ID[d.getDay()],
  }
}

const fmtTime = (timeStr) => {
  if (!timeStr) return null
  return timeStr.slice(0, 5) // HH:MM
}

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
)

const AttendanceTable = ({ absensiLogs = [], loading, onNavigateAbsensi }) => {
  const [filter, setFilter] = useState('all')

  // Ambil 10 terbaru dan filter
  const recent = [...absensiLogs].slice(0, 10)
  const filtered = filter === 'all'
    ? recent
    : recent.filter(d => {
        const s = (d.status || '').toLowerCase()
        if (filter === 'hadir') return s === 'hadir' || s === 'terlambat'
        if (filter === 'izin') return s === 'izin' || s === 'sakit'
        if (filter === 'absen') return s === 'alpa' || s === 'absen'
        return true
      })

  const displayStatus = (row) => {
    const s = row.status || ''
    if (s === 'Hadir' && row.check_in && row.check_in > '08:00:00') return 'Terlambat'
    if (s === 'Alpa') return 'Absen'
    return s
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-bold text-gray-800">Riwayat Kehadiran Terbaru</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {loading ? 'Memuat...' : `${absensiLogs.length} total entri`}
          </p>
        </div>
        <button
          onClick={onNavigateAbsensi}
          className="text-xs text-primary-700 font-semibold hover:text-primary-900 transition-colors"
        >
          Lihat Semua →
        </button>
      </div>

      {/* Filter tabs */}
      <div className="px-5 pt-3 pb-1 flex gap-2">
        {['all', 'hadir', 'izin', 'absen'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
              filter === f
                ? 'bg-primary-800 text-white shadow-sm'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'Semua' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tanggal</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Jam Masuk</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Jam Keluar</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 4 }).map((__, j) => (
                    <td key={j} className="px-5 py-3.5">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-gray-400 text-sm">
                  Belum ada riwayat kehadiran
                </td>
              </tr>
            ) : (
              filtered.map((row) => {
                const { date, day } = fmtTanggal(row.tanggal)
                const masuk = fmtTime(row.check_in)
                const keluar = fmtTime(row.check_out)
                const status = displayStatus(row)
                const cfg = statusConfig[status] || statusConfig.Hadir

                return (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-5 py-3.5">
                      <div className="text-sm font-medium text-gray-800">{date}</div>
                      <div className="text-xs text-gray-400">{day}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      {masuk ? (
                        <div className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {masuk}
                        </div>
                      ) : (
                        <span className="text-gray-300 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {keluar ? (
                        <div className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {keluar}
                        </div>
                      ) : (
                        <span className="text-gray-300 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.class}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {status}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AttendanceTable
