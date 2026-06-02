import React, { useState } from 'react'

const attendanceData = [
  { id: 1, date: '19 Apr 2026', day: 'Jumat', masuk: '07:43', keluar: '16:05', status: 'Hadir' },
  { id: 2, date: '18 Apr 2026', day: 'Kamis', masuk: '07:45', keluar: '16:05', status: 'Hadir' },
  { id: 3, date: '17 Apr 2026', day: 'Rabu', masuk: '07:50', keluar: '16:10', status: 'Hadir' },
  { id: 4, date: '16 Apr 2026', day: 'Selasa', masuk: null, keluar: null, status: 'Izin' },
  { id: 5, date: '15 Apr 2026', day: 'Senin', masuk: null, keluar: null, status: 'Absen' },
]

const statusConfig = {
  Hadir: { class: 'bg-green-100 text-green-600', dot: 'bg-green-500' },
  Izin: { class: 'bg-yellow-100 text-yellow-600', dot: 'bg-yellow-500' },
  Absen: { class: 'bg-red-100 text-red-500', dot: 'bg-red-500' },
}

const AttendanceTable = () => {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? attendanceData
    : attendanceData.filter(d => d.status.toLowerCase() === filter)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-bold text-gray-800">Riwayat Kehadiran Terbaru</h3>
          <p className="text-xs text-gray-400 mt-0.5">5 hari terakhir</p>
        </div>
        <button className="text-xs text-primary-700 font-semibold hover:text-primary-900 transition-colors">
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
            {filtered.map((row) => {
              const cfg = statusConfig[row.status] || statusConfig.Hadir
              return (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-5 py-3.5">
                    <div className="text-sm font-medium text-gray-800">{row.date}</div>
                    <div className="text-xs text-gray-400">{row.day}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    {row.masuk ? (
                      <div className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {row.masuk}
                      </div>
                    ) : (
                      <span className="text-gray-300 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {row.keluar ? (
                      <div className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {row.keluar}
                      </div>
                    ) : (
                      <span className="text-gray-300 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.class}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                      {row.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AttendanceTable
