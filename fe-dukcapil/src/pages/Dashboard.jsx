import React, { useState } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import WelcomeCard from '../components/dashboard/WelcomeCard'
import StatsCards from '../components/dashboard/StatsCards'
import AttendanceTable from '../components/dashboard/AttendanceTable'
import InfoMagang from '../components/dashboard/InfoMagang'
import AbsensiPage from './AbsensiPage'
import TemplatePage from './TemplatePage'
import ProfilePage from './ProfilePage'

// Placeholder untuk halaman yang belum dikembangkan
const PlaceholderPage = ({ title, icon }) => (
  <div className="flex flex-col items-center justify-center h-64 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-gray-400">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-600 mb-1">{title}</h3>
    <p className="text-gray-400 text-sm">Halaman ini sedang dalam pengembangan</p>
  </div>
)

const Dashboard = ({ user, onLogout }) => {
  const [activePage, setActivePage] = useState('dashboard')

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <div className="space-y-5">
            <WelcomeCard user={user} onNavigateAbsensi={() => setActivePage('absensi')} />
            <StatsCards />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <AttendanceTable />
              </div>
              <div>
                <InfoMagang user={user} />
              </div>
            </div>
          </div>
        )

      case 'absensi':
        return <AbsensiPage />

      case 'template':
        return <TemplatePage />

      case 'profil':
        return <ProfilePage user={user} />

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        user={user}
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={onLogout}
      />

      {/* Main content — selalu offset ml-52 dari sidebar */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-52">
        {/* Header selalu menampilkan judul sistem yang sama (konsisten dengan desain) */}
        <DashboardHeader
          title="Sistem Informasi Pengelolaan Peserta Magang"
          subtitle="Terintegrasi Dukcapil Sidoarjo"
        />

        <main className="flex-1 p-5 md:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default Dashboard
