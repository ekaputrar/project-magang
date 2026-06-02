import React from 'react'

const InfoMagang = ({ user }) => {
  const info = [
    { label: 'ID Magang', value: user?.id || '#Apalah-HeHe', highlight: true },
    { label: 'Tanggal Mulai', value: '09 Februari 2026' },
    { label: 'Tanggal Selesai', value: '30 Juni 2026' },
    { label: 'Divisi', value: 'Operator Plavon' },
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
        {info.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 border-b border-blue-700 border-opacity-40 last:border-0"
          >
            <span className="text-blue-300 text-xs">{item.label}</span>
            <span className={`text-xs font-semibold ${item.highlight ? 'text-yellow-400' : 'text-white'}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Progress section */}
      <div className="mt-4 pt-4 border-t border-blue-700 border-opacity-40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-blue-300 text-xs">Progres Magang</span>
          <span className="text-white text-xs font-semibold">50%</span>
        </div>
        <div className="h-1.5 bg-blue-900 bg-opacity-50 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-400 rounded-full" style={{ width: '50%' }}></div>
        </div>
        <p className="text-blue-400 text-xs mt-2">2 dari 4 bulan telah dijalani</p>
      </div>
    </div>
  )
}

export default InfoMagang
