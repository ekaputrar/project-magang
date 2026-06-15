import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import WelcomeCard from '../components/dashboard/WelcomeCard'
import StatsCards from '../components/dashboard/StatsCards'
import AttendanceTable from '../components/dashboard/AttendanceTable'
import InfoMagang from '../components/dashboard/InfoMagang'
import AbsensiPage from './AbsensiPage'
import TemplatePage from './TemplatePage'
import ProfilePage from './ProfilePage'

// ─── Main Dashboard ────────────────────────────────────────────────────────────
const Dashboard = ({ user, onLogout }) => {
  const [activePage, setActivePage] = useState('dashboard')

  // ── State data dari DB ──────────────────────────────────────────────────────
  const [peserta, setPeserta] = useState(null)
  const [absensiLogs, setAbsensiLogs] = useState([])
  const [loadingPeserta, setLoadingPeserta] = useState(true)
  const [loadingAbsensi, setLoadingAbsensi] = useState(true)

  // ── Fetch data peserta ──────────────────────────────────────────────────────
  const fetchPeserta = useCallback(async () => {
    if (!user) return
    setLoadingPeserta(true)
    try {
      const { data, error } = await supabase
        .from('pesertas')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) throw error
      setPeserta(data)
    } catch (e) {
      console.error('Error fetching peserta:', e)
    } finally {
      setLoadingPeserta(false)
    }
  }, [user])

  // ── Fetch riwayat absensi ───────────────────────────────────────────────────
  const fetchAbsensi = useCallback(async (pesertaId) => {
    if (!pesertaId) return
    setLoadingAbsensi(true)
    try {
      const { data, error } = await supabase
        .from('absensis')
        .select('*')
        .eq('peserta_id', pesertaId)
        .order('tanggal', { ascending: false })

      if (error) throw error
      setAbsensiLogs(data || [])
    } catch (e) {
      console.error('Error fetching absensi:', e)
    } finally {
      setLoadingAbsensi(false)
    }
  }, [])

  // ── Fetch saat mount & saat peserta berubah ─────────────────────────────────
  useEffect(() => {
    fetchPeserta()
  }, [fetchPeserta])

  useEffect(() => {
    if (peserta?.id) {
      fetchAbsensi(peserta.id)
    }
  }, [peserta, fetchAbsensi])

  // ── Real-time: refresh absensi saat ada perubahan ───────────────────────────
  useEffect(() => {
    if (!peserta?.id) return

    const channel = supabase
      .channel(`dashboard-absensis-${peserta.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'absensis', filter: `peserta_id=eq.${peserta.id}` },
        () => fetchAbsensi(peserta.id)
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [peserta, fetchAbsensi])

  // ── Render konten berdasarkan halaman aktif ─────────────────────────────────
  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <div className="space-y-5">
            {/* Welcome banner */}
            <WelcomeCard
              user={user}
              peserta={peserta}
              onNavigateAbsensi={() => setActivePage('absensi')}
            />

            {/* Kartu statistik — data nyata dari DB */}
            <StatsCards
              peserta={peserta}
              absensiLogs={absensiLogs}
              loading={loadingPeserta || loadingAbsensi}
            />

            {/* Tabel kehadiran & info magang */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <AttendanceTable
                  absensiLogs={absensiLogs}
                  loading={loadingAbsensi}
                  onNavigateAbsensi={() => setActivePage('absensi')}
                />
              </div>
              <div>
                <InfoMagang
                  peserta={peserta}
                  loading={loadingPeserta}
                />
              </div>
            </div>
          </div>
        )

      case 'absensi':
        return <AbsensiPage user={user} />

      case 'template':
        return <TemplatePage />

      case 'profil':
        return <ProfilePage user={user} onProfileUpdate={fetchPeserta} />

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        user={user}
        peserta={peserta}
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={onLogout}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-52">
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
