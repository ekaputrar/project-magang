import React from 'react'

const stats = [
  {
    id: 'status',
    label: 'Status Magang',
    value: 'Aktif',
    badge: { text: 'Terverifikasi', color: 'bg-green-100 text-green-600' },
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    progress: null,
  },
  {
    id: 'kehadiran',
    label: 'Total Kehadiran',
    value: '20',
    unit: 'Hari',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    progress: { value: 20, max: 80, color: 'bg-green-500' },
  },
  {
    id: 'periode',
    label: 'Periode Magang',
    value: '4',
    unit: 'Bulan',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    progress: { value: 2, max: 4, color: 'bg-yellow-400' },
  },
]

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
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
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
            {stat.unit && <span className="text-gray-500 text-sm">{stat.unit}</span>}
          </div>

          {/* Progress bar */}
          {stat.progress && (
            <div className="mt-3">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${stat.progress.color} rounded-full transition-all duration-500`}
                  style={{ width: `${(stat.progress.value / stat.progress.max) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default StatsCards
