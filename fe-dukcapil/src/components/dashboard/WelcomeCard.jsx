import React from 'react'

const WelcomeCard = ({ user, onNavigateAbsensi }) => {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Selamat Pagi'
    if (hour < 15) return 'Selamat Siang'
    if (hour < 18) return 'Selamat Sore'
    return 'Selamat Malam'
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden p-6 md:p-8"
      style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 60%, #3B82F6 100%)' }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 right-16 w-32 h-32 bg-yellow-400 opacity-10 rounded-full translate-y-1/2 pointer-events-none"></div>

      {/* Illustration right side */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:block opacity-20 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-32 h-32 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>

      <div className="relative z-10 max-w-lg">
        <h2 className="text-white font-bold text-xl md:text-2xl mb-1">
          {getGreeting()}, {user?.name?.split(' ')[0] || 'Budi'}! 👋
        </h2>
        <p className="text-blue-200 text-sm leading-relaxed mb-6">
          Pantau aktivitas magang Anda, catat kehadiran, dan dapatkan informasi terbaru dari Dukcapil Sidoarjo. Tetap semangat dan produktif hari ini!
        </p>

        {/* Tombol Absen Sekarang — navigasi ke halaman Absensi */}
        <button
          id="absen-sekarang-btn"
          onClick={onNavigateAbsensi}
          className="inline-flex items-center gap-2 bg-white text-primary-800 hover:bg-blue-50 font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
          Absen Sekarang
        </button>
      </div>
    </div>
  )
}

export default WelcomeCard
