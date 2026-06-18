import React, { useState, useEffect } from 'react'

const DashboardHeader = ({ title, subtitle, onAbsen, absensiLogs = [] }) => {
  const [now, setNow] = useState(new Date())
  const [notifOpen, setNotifOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const todayStr = now.toLocaleDateString('en-CA') // YYYY-MM-DD local time
  const todayEntry = absensiLogs?.find(log => log.tanggal === todayStr)
  const isAbsenToday = !!todayEntry

  // Dynamic notification for today's attendance status
  const attendanceNotif = isAbsenToday
    ? {
        id: 1,
        msg: todayEntry.status === 'Izin' || todayEntry.status === 'Sakit'
          ? `Absensi hari ini dicatat sebagai ${todayEntry.status}`
          : 'Absensi hari ini sudah dicatat',
        time: todayEntry.check_in ? todayEntry.check_in.slice(0, 5) : '--:--',
        type: 'success',
      }
    : {
        id: 1,
        msg: 'Absensi hari ini belum dicatat',
        time: '08:00',
        type: 'warning',
      }

  const notifications = [
    attendanceNotif,
    { id: 2, msg: 'Evaluasi bulan April tersedia', time: 'Kemarin', type: 'info' },
    { id: 3, msg: 'Sertifikat magang siap diunduh', time: '2 hari lalu', type: 'success' },
  ]

  const hasNotif = !isAbsenToday

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Left - Title */}
      <div>
        <h1 className="text-base font-bold text-gray-800 leading-tight">{title}</h1>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>

      {/* Right - Date & Notifications */}
      <div className="flex items-center gap-3">
        {/* Date */}
        <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-medium text-gray-600">{formatDate(now)}</span>
        </div>

        {/* Notification bell */}
        <div className="relative">
          <button
            id="notif-btn"
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {hasNotif && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Notification dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800">Notifikasi</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {notifications.map((notif) => (
                  <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        notif.type === 'warning' ? 'bg-yellow-400' :
                        notif.type === 'success' ? 'bg-green-400' : 'bg-blue-400'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-700">{notif.msg}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-gray-100">
                <button className="text-xs text-primary-700 font-medium hover:text-primary-900">Lihat semua notifikasi</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
