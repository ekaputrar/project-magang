import React, { useState } from 'react'
import avatarImg from '../../assets/avatar.png'
import lambangImg from '../../assets/LambangSidoarjo.png'
import logoDisdukcapil from '../../assets/logo_disdukcapil.png'

const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    id: 'absensi',
    label: 'Absensi',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'template',
    label: 'Template Operator',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'profil',
    label: 'Profil',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

const Sidebar = ({ user, peserta, activePage, onNavigate, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-primary-800 text-white rounded-lg flex items-center justify-center shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay on mobile */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40
          w-52 flex flex-col
          transition-transform duration-300
          md:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ background: 'linear-gradient(180deg, #1a2e6e 0%, #1E40AF 100%)' }}
      >
        {/* Logo */}
        <div className="px-4 py-4 border-b border-blue-700 border-opacity-50">
          <div className="flex items-center gap-3">
            <img
              src={lambangImg}
              alt="Lambang Kabupaten Sidoarjo"
              className="w-16 h-12 object-contain flex-shrink-0"
            />
            <img
              src={logoDisdukcapil}
              alt="Disdukcapil Sidoarjo"
              className="h-16 w-auto object-contain"
            />
          </div>
        </div>


        {/* User Profile */}
        <div className="px-5 py-5 border-b border-blue-700 border-opacity-50">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-3">
              <img
                src={peserta?.foto_url || avatarImg}
                alt={peserta?.nama || user?.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white border-opacity-30"
              />
              <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 border-2 border-blue-800 rounded-full"></span>
            </div>
            <div className="text-white font-semibold text-sm">{peserta?.nama || user?.name || 'Budi Santoso'}</div>
            <span className="mt-1 text-xs bg-blue-600 bg-opacity-50 text-blue-200 px-2.5 py-0.5 rounded-full">
              {user?.role || 'Peserta Magang'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id)
                  setMobileOpen(false)
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-white bg-opacity-20 text-white shadow-sm'
                    : 'text-blue-200 hover:bg-white hover:bg-opacity-10 hover:text-white'
                  }
                `}
              >
                <span className={isActive ? 'text-yellow-300 flex-shrink-0' : 'flex-shrink-0'}>{item.icon}</span>
                <span className="text-left leading-tight">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-blue-700 border-opacity-50">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-blue-200 hover:bg-red-500 hover:bg-opacity-20 hover:text-red-300 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
