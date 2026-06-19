import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const statusConfig = {
  Hadir:     { pill: 'bg-green-100 text-green-600',   dot: 'bg-green-500' },
  Izin:      { pill: 'bg-yellow-100 text-yellow-600', dot: 'bg-yellow-500' },
  Terlambat: { pill: 'bg-orange-100 text-orange-600', dot: 'bg-orange-500' },
  Absen:     { pill: 'bg-red-100 text-red-500',       dot: 'bg-red-500' },
  Libur:     { pill: 'bg-gray-100 text-gray-400',     dot: 'bg-gray-300' },
}

// ─── Modal Ajukan Izin ────────────────────────────────────────────────────────
const IzinModal = ({ onClose, onSubmit }) => {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    jenis: 'Sakit',
    tanggalMulai: today,
    tanggalSelesai: today,
    keterangan: '',
    file: null,
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const jenisOptions = [
    { value: 'Sakit',              label: 'Sakit',               icon: '🤒' },
    { value: 'Keperluan Keluarga', label: 'Keperluan Keluarga',  icon: '👨‍👩‍👧' },
    { value: 'Keperluan Pribadi',  label: 'Keperluan Pribadi',   icon: '📋' },
    { value: 'Dinas Luar',         label: 'Dinas Luar',          icon: '🏢' },
    { value: 'Lainnya',            label: 'Lainnya',             icon: '📝' },
  ]

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleFile = (e) => setForm({ ...form, file: e.target.files[0] || null })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit(form)
      setSubmitted(true)
      setTimeout(() => { onClose() }, 1500)
    } catch (err) {
      alert('Gagal mengirim permohonan izin: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Hitung jumlah hari izin
  const diffDays = Math.max(1,
    Math.floor((new Date(form.tanggalSelesai) - new Date(form.tanggalMulai)) / 86400000) + 1
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-[fadeInUp_0.25s_ease]">
        {/* Header */}
        <div
          className="px-6 py-5 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #1a2e6e 0%, #1E40AF 100%)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-bold text-base">Ajukan Izin</h2>
              <p className="text-blue-200 text-xs mt-0.5">Isi formulir permohonan izin</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg flex items-center justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Success state */}
        {submitted ? (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Izin Berhasil Diajukan!</h3>
            <p className="text-gray-500 text-sm">Permohonan izin Anda sedang diproses oleh admin.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

            {/* Jenis izin */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Jenis Izin <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {jenisOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, jenis: opt.value })}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left text-xs font-medium transition-all duration-150
                      ${form.jenis === opt.value
                        ? 'border-primary-700 bg-blue-50 text-primary-800'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <span className="text-base">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rentang tanggal */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Tanggal Mulai <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="tanggalMulai"
                  value={form.tanggalMulai}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Tanggal Selesai <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="tanggalSelesai"
                  value={form.tanggalSelesai}
                  min={form.tanggalMulai}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Durasi info */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-blue-700">
                Durasi izin: <span className="font-bold">{diffDays} hari</span> · Jenis: <span className="font-bold">{form.jenis}</span>
              </p>
            </div>

            {/* Keterangan */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Keterangan / Alasan <span className="text-red-500">*</span>
              </label>
              <textarea
                name="keterangan"
                value={form.keterangan}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Tuliskan alasan pengajuan izin Anda..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Upload dokumen */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Upload Dokumen Pendukung <span className="text-gray-400 font-normal">(opsional)</span>
              </label>
              <label
                htmlFor="izin-file"
                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl px-4 py-5 cursor-pointer hover:border-primary-400 hover:bg-blue-50 transition-all"
              >
                {form.file ? (
                  <>
                    <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-700 font-medium">{form.file.name}</p>
                    <p className="text-xs text-gray-400">Klik untuk ganti file</p>
                  </>
                ) : (
                  <>
                    <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-500">Klik atau seret file ke sini</p>
                    <p className="text-xs text-gray-400">PDF, JPG, PNG — Maks. 5MB</p>
                  </>
                )}
                <input id="izin-file" type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} />
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-primary-800 hover:bg-primary-900 text-white text-sm font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Kirim Permohonan
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

// ─── Kalender Dinamis ─────────────────────────────────────────────────────────
const dotColor = {
  Hadir: 'bg-green-500', Izin: 'bg-yellow-500', Terlambat: 'bg-orange-500',
  Absen: 'bg-red-500', Libur: 'bg-gray-300',
}
const DAYS_LABEL = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB']
const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']

const DynamicCalendar = ({ markedDates = {} }) => {
  const realNow = new Date()
  const [viewYear, setViewYear] = useState(realNow.getFullYear())
  const [viewMonth, setViewMonth] = useState(realNow.getMonth()) // 0-indexed

  const todayDate   = realNow.getDate()
  const todayMonth  = realNow.getMonth()
  const todayYear   = realNow.getFullYear()
  const isViewingCurrentMonth = viewYear === todayYear && viewMonth === todayMonth

  // First day of viewMonth (0=Sun … 6=Sat)
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()
  // Total days in viewMonth
  const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null)
  for (let d = 1; d <= totalDays; d++) cells.push(d)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-800">
          {MONTHS_ID[viewMonth]} {viewYear}
        </h3>
        <div className="flex items-center gap-1">
          {!isViewingCurrentMonth && (
            <button
              onClick={() => { setViewMonth(todayMonth); setViewYear(todayYear) }}
              className="text-xs text-primary-700 font-medium px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors mr-1"
            >
              Hari ini
            </button>
          )}
          <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_LABEL.map(d => (
          <div key={d} className={`text-center text-xs font-semibold py-1 ${d === 'MIN' || d === 'SAB' ? 'text-red-400' : 'text-gray-400'}`}>
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} />
          const isToday = isViewingCurrentMonth && day === todayDate
          const isFuture = isViewingCurrentMonth && day > todayDate
          const isSunday = (firstDayOfWeek + day - 1) % 7 === 0
          const isSaturday = (firstDayOfWeek + day - 1) % 7 === 6
          
          const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dot = markedDates[dateKey]

          return (
            <div key={day} className="flex flex-col items-center py-0.5">
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium transition-colors
                  ${isToday
                    ? 'bg-primary-800 text-white font-bold ring-2 ring-blue-300 ring-offset-1'
                    : isFuture
                      ? 'text-gray-300 cursor-default'
                      : isSunday || isSaturday
                        ? 'text-red-400 hover:bg-red-50 cursor-pointer'
                        : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
                  }`}
              >
                {day}
              </div>
              {/* Status dot */}
              {dot ? (
                <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${dotColor[dot] || 'bg-gray-300'}`} />
              ) : (!isFuture && !isSunday && !isSaturday) ? (
                <span className="w-1.5 h-1.5 mt-0.5" />
              ) : null}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-4 pt-3 border-t border-gray-100">
        {[['Hadir','bg-green-500'],['Izin','bg-yellow-500'],['Absen','bg-red-500'],['Terlambat','bg-orange-500'],['Libur','bg-gray-300']].map(([label,color]) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-xs text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Halaman Absensi Utama ────────────────────────────────────────────────────
const AbsensiPage = ({ user }) => {
  const [now, setNow] = useState(new Date())
  const [loadingPeserta, setLoadingPeserta] = useState(true)
  const [loadingData, setLoadingData] = useState(true)
  const [peserta, setPeserta] = useState(null)
  const [absensiLogs, setAbsensiLogs] = useState([])
  const [loadingIn, setLoadingIn] = useState(false)
  const [loadingOut, setLoadingOut] = useState(false)
  const [showIzinModal, setShowIzinModal] = useState(false)
  const [page, setPage] = useState(1)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [jamMasukLimit, setJamMasukLimit] = useState('08:00')
  const [jamPulangLimit, setJamPulangLimit] = useState('16:00')
  const [filterStatus, setFilterStatus] = useState('Semua')
  const [filterMonth, setFilterMonth] = useState('Semua')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const PER_PAGE = 6

  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('system_settings')
          .select('*')
        if (!error && data && data.length > 0) {
          const masuk = data.find(s => s.key === 'jam_masuk')?.value || '08:00'
          const pulang = data.find(s => s.key === 'jam_pulang')?.value || '16:00'
          setJamMasukLimit(masuk)
          setJamPulangLimit(pulang)
        }
      } catch (err) {
        console.error('Error fetching system settings:', err)
      }
    }
    fetchSystemSettings()
  }, [])

  // Fetch data peserta aktif berdasarkan user_id (dengan self-healing fallback ke email)
  const fetchPeserta = async () => {
    try {
      setLoadingPeserta(true)
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      const uId = user?.id || currentUser?.id
      const uEmail = currentUser?.email
      if (!uId) {
        setPeserta(null)
        setLoadingPeserta(false)
        return
      }

      // 1. Coba cari berdasarkan user_id
      let { data, error } = await supabase
        .from('pesertas')
        .select('*')
        .eq('user_id', uId)
        .eq('status', 'Aktif')
        .maybeSingle()

      // 2. Jika tidak ditemukan, coba cari berdasarkan email (self-healing linkage)
      if (!data && uEmail) {
        const { data: byEmail, error: emailErr } = await supabase
          .from('pesertas')
          .select('*')
          .eq('email', uEmail)
          .eq('status', 'Aktif')
          .maybeSingle()

        if (byEmail) {
          // Link user_id ke tabel pesertas di database
          const { error: updatePesertaErr } = await supabase
            .from('pesertas')
            .update({ user_id: uId })
            .eq('id', byEmail.id)

          // Link user_id ke tabel pengajuans di database agar data konsisten
          if (byEmail.pengajuan_id) {
            await supabase
              .from('pengajuans')
              .update({ user_id: uId })
              .eq('id', byEmail.pengajuan_id)
          }

          if (!updatePesertaErr) {
            byEmail.user_id = uId
            data = byEmail
          }
        }
      }

      if (error) throw error
      setPeserta(data)
    } catch (e) {
      console.error('Error fetching peserta:', e)
    } finally {
      setLoadingPeserta(false)
    }
  }

  // Fetch log absensi untuk peserta tertentu
  const fetchAbsensiLogs = async (pesertaId) => {
    try {
      setLoadingData(true)
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
      setLoadingData(false)
    }
  }

  useEffect(() => {
    fetchPeserta()
  }, [user])

  useEffect(() => {
    if (peserta) {
      fetchAbsensiLogs(peserta.id)
    }
  }, [peserta])

  // Live clock — tick setiap detik
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const parseTimeStr = (dateStr, timeStr) => {
    if (!timeStr) return null
    return new Date(`${dateStr}T${timeStr}`)
  }

  const formatTime      = d => d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  const formatTimeShort = d => d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
  const formatDate      = d => d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  // Cari absensi hari ini dari database logs
  const todayStr = now.toLocaleDateString('en-CA') // YYYY-MM-DD local time
  const todayEntry = absensiLogs.find(log => log.tanggal === todayStr)

  const checkInTime = todayEntry && todayEntry.check_in ? parseTimeStr(todayEntry.tanggal, todayEntry.check_in) : null
  const checkOutTime = todayEntry && todayEntry.check_out ? parseTimeStr(todayEntry.tanggal, todayEntry.check_out) : null

  const getDisplayStatus = (log) => {
    if (log.status === 'Izin' || log.status === 'Sakit') return 'Izin'
    if (log.status === 'Alpa') return 'Absen'
    if (log.status === 'Hadir' && log.check_in && log.check_in > (jamMasukLimit + ':00')) return 'Terlambat'
    return 'Hadir'
  }

  const handleCheckIn = async () => {
    if (!peserta) return
    setLoadingIn(true)
    try {
      const nowTime = new Date()
      const tStr = nowTime.toLocaleDateString('en-CA')
      const timeStr = nowTime.toTimeString().slice(0, 8)

      const { error } = await supabase
        .from('absensis')
        .insert({
          peserta_id: peserta.id,
          tanggal: tStr,
          check_in: timeStr,
          lokasi: 'WFO',
          status: 'Hadir',
          keterangan: 'Kantor Dukcapil Sidoarjo'
        })

      if (error) {
        alert('Gagal melakukan check-in: ' + error.message)
        return
      }

      await fetchAbsensiLogs(peserta.id)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingIn(false)
    }
  }

  const handleCheckOut = async () => {
    if (!peserta || !todayEntry) return
    setLoadingOut(true)
    try {
      const nowTime = new Date()
      const timeStr = nowTime.toTimeString().slice(0, 8)

      const { error } = await supabase
        .from('absensis')
        .update({
          check_out: timeStr
        })
        .eq('peserta_id', peserta.id)
        .eq('tanggal', todayStr)

      if (error) {
        alert('Gagal melakukan check-out: ' + error.message)
        return
      }

      await fetchAbsensiLogs(peserta.id)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingOut(false)
    }
  }

  const handleIzinSubmit = async (formData) => {
    if (!peserta) return
    
    // 1. Upload file pendukung jika ada
    let fileUrl = null
    if (formData.file) {
      const fileExt = formData.file.name.split('.').pop()
      const fileName = `izin_${Date.now()}.${fileExt}`
      const filePath = `${peserta.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('berkas-pengajuan')
        .upload(filePath, formData.file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('berkas-pengajuan')
        .getPublicUrl(filePath)

      fileUrl = publicUrl
    }

    // 2. Generate date range rows
    const start = new Date(formData.tanggalMulai)
    const end = new Date(formData.tanggalSelesai)
    const rows = []

    const current = new Date(start)
    while (current <= end) {
      const dateStr = current.toLocaleDateString('en-CA')
      rows.push({
        peserta_id: peserta.id,
        tanggal: dateStr,
        status: formData.jenis === 'Sakit' ? 'Sakit' : 'Izin',
        lokasi: null,
        check_in: null,
        check_out: null,
        keterangan: `${formData.jenis}: ${formData.keterangan}${fileUrl ? ` [Unduh Berkas](${fileUrl})` : ''}`
      })
      current.setDate(current.getDate() + 1)
    }

    // 3. Upsert ke tabel absensis
    const { error: insertError } = await supabase
      .from('absensis')
      .upsert(rows, { onConflict: 'peserta_id,tanggal' })

    if (insertError) throw insertError

    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 3500)
    await fetchAbsensiLogs(peserta.id)
  }

  // Loading & Peringatan UI State
  if (loadingPeserta) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <svg className="animate-spin h-10 w-10 text-primary-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p className="text-sm text-gray-500 mt-4 font-semibold">Memuat profil magang Anda...</p>
      </div>
    )
  }

  if (!peserta) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto text-center my-10">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Akses Terbatas</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Halaman absensi hanya dapat diakses oleh peserta magang aktif. Pendaftaran Anda saat ini belum disetujui atau akun Anda belum terhubung dengan data peserta magang aktif.
        </p>
        <p className="text-xs text-gray-400">
          Silakan hubungi admin Disdukcapil jika Anda memiliki kendala.
        </p>
      </div>
    )
  }

  const absenStatus = !checkInTime ? 'Belum Absen' : !checkOutTime ? 'Check In' : 'Selesai'
  const statusPillMap = {
    'Belum Absen': 'bg-red-100 text-red-500',
    'Check In':    'bg-yellow-100 text-yellow-600',
    'Selesai':     'bg-green-100 text-green-600',
  }
  const statusDotMap = {
    'Belum Absen': 'bg-red-500',
    'Check In':    'bg-yellow-500',
    'Selesai':     'bg-green-500',
  }

  // Hitung stats absensi dari database
  const totalHadir = absensiLogs.filter(log => log.status === 'Hadir' || log.status === 'Terlambat').length
  const totalIzin = absensiLogs.filter(log => log.status === 'Izin' || log.status === 'Sakit').length
  const totalAlpa = absensiLogs.filter(log => log.status === 'Alpa').length
  const totalDays = totalHadir + totalIzin + totalAlpa
  const kehadiranPercent = totalDays > 0 ? Math.round((totalHadir / totalDays) * 100) : 0

  // Format database logs ke baris tabel riwayat
  const formattedLogs = absensiLogs.map((log, index) => {
    const logDate = new Date(log.tanggal)
    const dateFormatted = logDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    const dayName = logDate.toLocaleDateString('id-ID', { weekday: 'long' })

    return {
      id: log.id || index,
      date: dateFormatted,
      day: dayName,
      masuk: log.check_in ? log.check_in.slice(0, 5) : null,
      keluar: log.check_out ? log.check_out.slice(0, 5) : null,
      lokasi: log.status === 'Izin' || log.status === 'Sakit' ? log.keterangan : (log.lokasi || 'WFO'),
      status: getDisplayStatus(log)
    }
  })

  // ── Filter logic ────────────────────────────────────────────────────────────
  const availableMonths = [...new Set(
    absensiLogs.map(log => log.tanggal.slice(0, 7)) // 'YYYY-MM'
  )].sort((a, b) => b.localeCompare(a))

  const filteredLogs = formattedLogs.filter(row => {
    // Ambil tanggal asli dari absensiLogs berdasarkan index yang sama
    const rawLog = absensiLogs.find((_, idx) => formattedLogs[idx]?.id === row.id) ||
      absensiLogs[formattedLogs.indexOf(row)]
    const tanggal = rawLog?.tanggal || ''
    const monthMatch = filterMonth === 'Semua' || tanggal.startsWith(filterMonth)
    const statusMatch = filterStatus === 'Semua' || row.status === filterStatus
    return monthMatch && statusMatch
  })

  const paginated  = filteredLogs.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filteredLogs.length / PER_PAGE) || 1

  // ── Export CSV ──────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const headers = ['Tanggal', 'Hari', 'Jam Masuk', 'Jam Keluar', 'Lokasi / Catatan', 'Status']
    const rows = filteredLogs.map(row => [
      row.date,
      row.day,
      row.masuk || '-',
      row.keluar || '-',
      `"${(row.lokasi || '-').replace(/"/g, '""')}"`,
      row.status
    ])
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n')

    const BOM = '\uFEFF' // agar Excel terbaca UTF-8
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const fileName = `riwayat-kehadiran${filterMonth !== 'Semua' ? '-' + filterMonth : ''}.csv`
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Mark calendar dots
  const calendarMarks = {}
  absensiLogs.forEach(log => {
    calendarMarks[log.tanggal] = getDisplayStatus(log)
  })

  return (
    <div className="space-y-5">

      {/* ── Toast notifikasi izin berhasil ── */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-[fadeInDown_0.3s_ease]">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="text-sm font-semibold">Izin Berhasil Diajukan</p>
            <p className="text-xs text-green-100">Permohonan Anda sedang diproses admin</p>
          </div>
          <button onClick={() => setShowSuccessToast(false)} className="ml-2 opacity-70 hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* ── Modal Izin ── */}
      {showIzinModal && (
        <IzinModal
          onClose={() => setShowIzinModal(false)}
          onSubmit={handleIzinSubmit}
        />
      )}

      {/* ── Page title bar ── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Halaman Absensi</h2>
          <p className="text-sm text-gray-400 mt-0.5">Kelola kehadiran harian Anda dengan mudah</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Tombol Ajukan Izin */}
          <button
            id="ajukan-izin-btn"
            onClick={() => setShowIzinModal(true)}
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Ajukan Izin
          </button>

          {/* Badge lokasi */}
          <div className="hidden sm:flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-primary-800 text-xs font-medium px-3 py-2.5 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Dispendukcapil Sidoarjo
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Check In / Out Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {/* Card header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800">Absensi Hari Ini</h3>
              <p className="text-xs text-gray-400 mt-0.5">{formatDate(now)}</p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${statusPillMap[absenStatus]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusDotMap[absenStatus]}`} />
              {absenStatus}
            </span>
          </div>

          {/* Live clock */}
          <div className="text-center py-5">
            <div className="text-5xl md:text-6xl font-bold text-gray-800 tracking-tight tabular-nums leading-none">
              {formatTime(now)}
            </div>
            <p className="text-xs text-gray-400 mt-2.5 font-medium tracking-[0.2em] uppercase">Waktu Sekarang · WIB</p>
          </div>

          {/* Check In / Out buttons */}
          <div className="grid grid-cols-2 gap-4 mt-1">
            {/* Check In */}
            <button
              id="checkin-btn"
              onClick={handleCheckIn}
              disabled={!!checkInTime || loadingIn}
              className={`flex flex-col items-center justify-center py-8 rounded-2xl font-bold text-lg transition-all duration-200
                ${checkInTime
                  ? 'bg-green-50 border-2 border-green-200 text-green-600 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-100 hover:-translate-y-0.5 active:translate-y-0'
                }`}
            >
              {loadingIn ? (
                <svg className="animate-spin w-8 h-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              )}
              <span>Check In</span>
              <span className={`text-xs font-normal mt-1 ${checkInTime ? 'text-green-500' : 'text-green-100'}`}>
                {checkInTime ? `✓ ${formatTimeShort(checkInTime)}` : `Batas: ${jamMasukLimit} WIB`}
              </span>
            </button>

            {/* Check Out */}
            <button
              id="checkout-btn"
              onClick={handleCheckOut}
              disabled={!checkInTime || !!checkOutTime || loadingOut}
              className={`flex flex-col items-center justify-center py-8 rounded-2xl font-bold text-lg transition-all duration-200 border-2
                ${checkOutTime
                  ? 'bg-blue-50 border-blue-200 text-blue-600 cursor-not-allowed'
                  : checkInTime
                    ? 'bg-primary-800 hover:bg-primary-900 text-white border-transparent shadow-lg shadow-blue-100 hover:-translate-y-0.5 active:translate-y-0'
                    : 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
            >
              {loadingOut ? (
                <svg className="animate-spin w-8 h-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              )}
              <span>Check Out</span>
              <span className={`text-xs font-normal mt-1 ${checkOutTime ? 'text-blue-500' : !checkInTime ? 'text-gray-300' : 'text-blue-200'}`}>
                {checkOutTime ? `✓ ${formatTimeShort(checkOutTime)}` : `Batas: ${jamPulangLimit} WIB`}
              </span>
            </button>
          </div>

          {/* Time recap */}
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="text-center text-sm text-gray-500">
              Jam Masuk: <span className="font-semibold text-gray-700">{checkInTime ? formatTimeShort(checkInTime) : '--:--'}</span>
            </div>
            <div className="text-center text-sm text-gray-500">
              Jam Keluar: <span className="font-semibold text-gray-700">{checkOutTime ? formatTimeShort(checkOutTime) : '--:--'}</span>
            </div>
          </div>

          {/* Tombol Ajukan Izin (dalam card, alternatif) */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setShowIzinModal(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50 font-semibold text-sm py-2.5 rounded-xl transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Ajukan Izin / Sakit
            </button>
          </div>

          {/* GPS info */}
          <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-blue-600 leading-relaxed">
              Pastikan GPS aktif dan berada di lokasi kantor untuk melakukan absensi. Absensi terdeteksi secara otomatis berdasarkan lokasi.
            </p>
          </div>
        </div>

        {/* Stats column */}
        <div className="flex flex-col gap-4">
          {/* Total Hadir */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Hadir</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-bold text-gray-800">{totalHadir}</span>
                <span className="text-sm text-gray-400">Hari</span>
              </div>
            </div>
          </div>

          {/* Izin / Sakit */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400">Izin / Sakit</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-bold text-gray-800">{totalIzin}</span>
                <span className="text-sm text-gray-400">Hari</span>
              </div>
            </div>
          </div>

          {/* Tidak Hadir */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400">Tidak Hadir</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-bold text-gray-800">{totalAlpa}</span>
                <span className="text-sm text-gray-400">Hari</span>
              </div>
            </div>
          </div>

          {/* Tingkat Kehadiran */}
          <div className="rounded-2xl p-5 flex-1" style={{ background: 'linear-gradient(135deg, #1a2e6e 0%, #1E40AF 100%)' }}>
            <p className="text-blue-300 text-xs mb-2">Tingkat Kehadiran</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">{kehadiranPercent}</span>
              <span className="text-xl font-bold text-white">%</span>
            </div>
            <div className="mt-3 h-2 bg-blue-900 bg-opacity-50 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 rounded-full transition-all duration-500" style={{ width: `${kehadiranPercent}%` }} />
            </div>
            <p className="text-blue-400 text-xs mt-2">{totalHadir} dari {totalDays} hari terdata</p>
          </div>
        </div>
      </div>

      {/* ── Bottom: Calendar + Riwayat ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Kalender dinamis */}
        <div>
          <DynamicCalendar markedDates={calendarMarks} />
        </div>

        {/* Riwayat Kehadiran */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Riwayat Kehadiran</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {filteredLogs.length} entri
                {filterStatus !== 'Semua' && <span className="ml-1 text-blue-500 font-medium">· {filterStatus}</span>}
                {filterMonth !== 'Semua' && <span className="ml-1 text-blue-500 font-medium">· {MONTHS_ID[parseInt(filterMonth.split('-')[1]) - 1]} {filterMonth.split('-')[0]}</span>}
              </p>
            </div>
            <div className="flex items-center gap-2">

              {/* ── Filter dropdown ── */}
              <div className="relative">
                <button
                  id="filter-riwayat-btn"
                  onClick={() => setShowFilterDropdown(v => !v)}
                  className={`inline-flex items-center gap-1.5 border text-xs font-medium px-3 py-2 rounded-lg transition-colors
                    ${ (filterStatus !== 'Semua' || filterMonth !== 'Semua')
                      ? 'border-blue-400 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm0 8a1 1 0 011-1h10a1 1 0 010 2H4a1 1 0 01-1-1zm0 8a1 1 0 011-1h4a1 1 0 010 2H4a1 1 0 01-1-1z" />
                  </svg>
                  Filter
                  { (filterStatus !== 'Semua' || filterMonth !== 'Semua') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  )}
                </button>

                {showFilterDropdown && (
                  <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl border border-gray-100 shadow-xl z-30 p-4 space-y-3">
                    {/* Tutup saat klik luar */}
                    <div className="fixed inset-0 z-[-1]" onClick={() => setShowFilterDropdown(false)} />

                    {/* Filter Status */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Status</p>
                      <div className="flex flex-wrap gap-1.5">
                        {['Semua', 'Hadir', 'Terlambat', 'Izin', 'Absen'].map(s => (
                          <button
                            key={s}
                            onClick={() => { setFilterStatus(s); setPage(1) }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all
                              ${filterStatus === s
                                ? 'bg-primary-800 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Filter Bulan */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Bulan</p>
                      <select
                        value={filterMonth}
                        onChange={e => { setFilterMonth(e.target.value); setPage(1) }}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-400"
                      >
                        <option value="Semua">Semua Bulan</option>
                        {availableMonths.map(m => (
                          <option key={m} value={m}>
                            {MONTHS_ID[parseInt(m.split('-')[1]) - 1]} {m.split('-')[0]}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Reset */}
                    { (filterStatus !== 'Semua' || filterMonth !== 'Semua') && (
                      <button
                        onClick={() => { setFilterStatus('Semua'); setFilterMonth('Semua'); setPage(1) }}
                        className="w-full text-xs text-red-500 hover:text-red-700 font-medium py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Reset Filter
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ── Export CSV ── */}
              <button
                id="export-csv-btn"
                onClick={handleExportCSV}
                disabled={filteredLogs.length === 0}
                className="inline-flex items-center gap-1.5 bg-primary-800 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {['Tanggal', 'Check In', 'Check Out', 'Lokasi / Catatan', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loadingData ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-sm text-gray-400">Memuat riwayat kehadiran...</td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-sm text-gray-400">
                      { (filterStatus !== 'Semua' || filterMonth !== 'Semua')
                        ? 'Tidak ada data yang cocok dengan filter.'
                        : 'Belum ada riwayat kehadiran.'
                      }
                    </td>
                  </tr>
                ) : paginated.map(row => {
                  const cfg = statusConfig[row.status] || statusConfig.Hadir
                  const isIzin  = row.status === 'Izin'
                  const isAbsen = row.status === 'Absen'
                  const isLibur = row.status === 'Libur'
                  return (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-800">{row.date}</div>
                        <div className="text-xs text-gray-400">{row.day}</div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {row.masuk ? (
                          <div className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {row.masuk}
                          </div>
                        ) : <span className="text-gray-300 text-sm">—</span>}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {row.keluar ? (
                          <div className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {row.keluar}
                          </div>
                        ) : <span className="text-gray-300 text-sm">—</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          {isIzin ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          ) : isAbsen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          ) : isLibur ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                          <span className="truncate max-w-[200px]" title={row.lokasi}>{row.lokasi}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.pill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">Menampilkan {paginated.length} dari {filteredLogs.length} entri</p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-medium transition-colors
                    ${p === page ? 'bg-primary-800 text-white' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AbsensiPage;
