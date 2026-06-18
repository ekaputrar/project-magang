import React, { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import avatarImg from '../assets/avatar.png'

// ─── Skeleton ──────────────────────────────────────────────────────────────────
const Sk = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
)

// ─── Success Modal ─────────────────────────────────────────────────────────────
const SuccessAlert = ({ message, detail, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 relative">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping opacity-30" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">{message}</h3>
      <p className="text-sm text-gray-500 mb-6">{detail}</p>
      <button onClick={onClose} className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-all">
        Oke, Tutup
      </button>
    </div>
  </div>
)

// ─── Error Banner ──────────────────────────────────────────────────────────────
const ErrBanner = ({ msg, onClose }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 text-red-600 text-xs">
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span className="flex-1">{msg}</span>
    <button onClick={onClose} className="ml-auto text-red-400 hover:text-red-600 font-bold">✕</button>
  </div>
)

// ─── Password strength ─────────────────────────────────────────────────────────
const getStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '' }
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  const L = [
    { label: '', color: '' },
    { label: 'Lemah', color: 'bg-red-500' },
    { label: 'Sedang', color: 'bg-yellow-500' },
    { label: 'Kuat', color: 'bg-blue-500' },
    { label: 'Sangat Kuat', color: 'bg-green-500' },
  ]
  return { score: s, ...L[s] }
}

// ─── FormInput ────────────────────────────────────────────────────────────────
const FI = ({ label, icon, type = 'text', value, onChange, placeholder, readOnly = false }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">{icon}</div>}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly}
        className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700
          ${readOnly ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'}
          transition-all duration-150`}
      />
    </div>
  </div>
)

// ─── Eye icon ─────────────────────────────────────────────────────────────────
const Eye = ({ show }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {show
      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
    }
  </svg>
)

// ─── Format tanggal ───────────────────────────────────────────────────────────
const fmtTgl = (d) => d
  ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  : '-'

// ══════════════════════════════════════════════════════════════════════════════
const ProfilePage = ({ user, onProfileUpdate }) => {
  const fileRef = useRef(null)

  // ── Loading / saving state ──────────────────────────────────────────────────
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [pendingPhotoFile, setPendingPhotoFile] = useState(null)

  // ── Alert state ─────────────────────────────────────────────────────────────
  const [profileAlert, setProfileAlert] = useState(false)
  const [pwAlert, setPwAlert] = useState(false)
  const [profileErr, setProfileErr] = useState('')
  const [pwErr, setPwErr] = useState('')

  // ── Data ────────────────────────────────────────────────────────────────────
  const [peserta, setPeserta] = useState(null)           // row dari tabel pesertas
  const [avatarSrc, setAvatarSrc] = useState(avatarImg)

  // ── Form profil — sesuai kolom DB ──────────────────────────────────────────
  // Kolom DB: id(int), nama, email, no_hp, nim, telepon, alamat, asal_instansi, foto_url
  const [form, setForm] = useState({
    nama: '',
    email: '',
    no_hp: '',       // kolom utama nomor HP (dari pengajuan)
    nim: '',
    alamat: '',
    asal_instansi: '',
  })
  const [origForm, setOrigForm] = useState(null)

  // ── Password form ───────────────────────────────────────────────────────────
  const [pw, setPw] = useState({ newPw: '', confirm: '' })
  const [showPw, setShowPw] = useState({ newPw: false, confirm: false })
  const strength = getStrength(pw.newPw)

  // ── Fetch profil ────────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('pesertas')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) throw error

      setPeserta(data)
      if (data?.foto_url) {
        // Jika base64 data URL → langsung tampilkan, jika URL biasa → tambahkan cache-buster
        const url = data.foto_url
        if (url.startsWith('data:')) {
          setAvatarSrc(url)
        } else {
          setAvatarSrc(url.split('?')[0] + `?t=${Date.now()}`)
        }
      }

      const filled = {
        nama: data?.nama || user?.user_metadata?.name || '',
        email: data?.email || user?.email || '',
        no_hp: data?.no_hp || data?.telepon || '',
        nim: data?.nim || '',
        alamat: data?.alamat || '',
        asal_instansi: data?.asal_instansi || '',
      }
      setForm(filled)
      setOrigForm(filled)
    } catch (e) {
      console.error(e)
      setProfileErr('Gagal memuat data profil: ' + (e.message || ''))
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  // ── Progres magang ──────────────────────────────────────────────────────────
  const mulai = peserta?.tanggal_mulai ? new Date(peserta.tanggal_mulai) : null
  const selesai = peserta?.tanggal_selesai ? new Date(peserta.tanggal_selesai) : null
  const now = new Date()
  let pct = 0
  if (mulai && selesai) {
    const total = Math.max(1, selesai - mulai)
    const elapsed = Math.max(0, Math.min(now - mulai, total))
    pct = Math.round((elapsed / total) * 100)
  }

  // ── Ganti foto ──────────────────────────────────────────────────────────────
  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setProfileErr('Ukuran foto maksimal 2MB.'); return }

    setProfileErr('')
    setPendingPhotoFile(file)

    // Preview lokal dulu
    const reader = new FileReader()
    reader.onload = (ev) => setAvatarSrc(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleCancelPhoto = () => {
    setPendingPhotoFile(null)
    setAvatarSrc(peserta?.foto_url || avatarImg)
    setProfileErr('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSavePhoto = async () => {
    if (!peserta?.id || !pendingPhotoFile) {
      console.warn('[handleSavePhoto] Aborted: peserta.id=', peserta?.id, 'pendingPhotoFile=', pendingPhotoFile)
      return
    }

    // Validasi ukuran foto
    if (pendingPhotoFile.size > 2 * 1024 * 1024) {
      setProfileErr('Ukuran foto maksimal 2MB.')
      return
    }

    setUploadingPhoto(true)
    setProfileErr('')

    try {
      // Kompres dan konversi ke base64 menggunakan canvas
      const dataUrl = await new Promise((resolve, reject) => {
        const img = new Image()
        const objectUrl = URL.createObjectURL(pendingPhotoFile)
        img.onload = () => {
          URL.revokeObjectURL(objectUrl)
          // Kompres ke max 400x400 px
          const MAX = 400
          let { width, height } = img
          if (width > MAX || height > MAX) {
            if (width > height) { height = Math.round(height * MAX / width); width = MAX }
            else { width = Math.round(width * MAX / height); height = MAX }
          }
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', 0.75))
        }
        img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Gagal membaca gambar')) }
        img.src = objectUrl
      })

      console.log('[handleSavePhoto] Data URL length:', dataUrl.length, 'chars')

      // Simpan base64 ke kolom foto_url di database
      const { error: dbErr } = await supabase
        .from('pesertas')
        .update({ foto_url: dataUrl })
        .eq('id', peserta.id)

      console.log('[handleSavePhoto] DB update error:', dbErr)
      if (dbErr) throw dbErr

      // Update UI langsung
      setAvatarSrc(dataUrl)
      setPeserta(prev => ({ ...prev, foto_url: dataUrl }))
      setPendingPhotoFile(null)
      if (fileRef.current) fileRef.current.value = ''
      setProfileAlert(true)
      if (onProfileUpdate) onProfileUpdate()

    } catch (err) {
      console.error('[handleSavePhoto] ERROR:', err)
      setProfileErr('Gagal menyimpan foto: ' + (err.message || JSON.stringify(err)))
    } finally {
      setUploadingPhoto(false)
    }
  }

  // ── Simpan profil ───────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!peserta?.id) { setProfileErr('Data peserta tidak ditemukan.'); return }
    setProfileErr('')
    setSavingProfile(true)
    try {
      let finalFotoUrl = peserta.foto_url

      // Jika ada foto baru yang dipilih, unggah terlebih dahulu
      if (pendingPhotoFile) {
        const ext = pendingPhotoFile.name.split('.').pop().toLowerCase()
        const path = `${peserta.id}/avatar.${ext}`
        const { error: upErr } = await supabase.storage
          .from('berkas-pengajuan')
          .upload(path, pendingPhotoFile, { upsert: true })

        if (upErr) throw upErr

        const { data: { publicUrl } } = supabase.storage.from('berkas-pengajuan').getPublicUrl(path)
        finalFotoUrl = `${publicUrl}?t=${Date.now()}`
        setAvatarSrc(finalFotoUrl)
        setPendingPhotoFile(null)
      }

      // Update tabel pesertas
      const { error: upErr } = await supabase
        .from('pesertas')
        .update({
          nama: form.nama,
          email: form.email,
          no_hp: form.no_hp,
          nim: form.nim || null,
          alamat: form.alamat || null,
          asal_instansi: form.asal_instansi,
          foto_url: finalFotoUrl,
        })
        .eq('id', peserta.id)

      if (upErr) throw upErr

      // Jika email berubah → update Supabase Auth
      if (form.email && form.email !== user?.email) {
        const { error: eErr } = await supabase.auth.updateUser({ email: form.email })
        if (eErr) throw eErr
      }

      // Update profiles table (nama)
      await supabase.from('profiles').update({ name: form.nama }).eq('id', user.id)

      setOrigForm({ ...form })
      setProfileAlert(true)
      if (onProfileUpdate) onProfileUpdate()
    } catch (err) {
      setProfileErr(err.message || 'Gagal menyimpan perubahan.')
    } finally {
      setSavingProfile(false)
    }
  }

  // ── Update password ─────────────────────────────────────────────────────────
  const handlePw = async () => {
    setPwErr('')
    if (pw.newPw.length < 8) { setPwErr('Password baru minimal 8 karakter.'); return }
    if (pw.newPw !== pw.confirm) { setPwErr('Konfirmasi password tidak cocok.'); return }
    setSavingPw(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: pw.newPw })
      if (error) throw error
      setPw({ newPw: '', confirm: '' })
      setPwAlert(true)
    } catch (err) {
      setPwErr(err.message || 'Gagal mengubah password.')
    } finally {
      setSavingPw(false)
    }
  }

  const hasChanged = (origForm && JSON.stringify(form) !== JSON.stringify(origForm)) || !!pendingPhotoFile
  const toggle = (f) => setShowPw(p => ({ ...p, [f]: !p[f] }))

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* Alerts */}
      {profileAlert && (
        <SuccessAlert
          message="Data Berhasil Disimpan!"
          detail="Informasi profil Anda telah berhasil diperbarui."
          onClose={() => setProfileAlert(false)}
        />
      )}
      {pwAlert && (
        <SuccessAlert
          message="Password Berhasil Diperbarui!"
          detail="Silakan gunakan password baru Anda untuk login berikutnya."
          onClose={() => setPwAlert(false)}
        />
      )}

      {/* Page heading */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">Halaman Profil</h2>
        <p className="text-sm text-gray-400 mt-0.5">Kelola informasi pribadi dan keamanan akun Anda</p>
      </div>

      {/* ── Hero card ── */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100" style={{ background: 'linear-gradient(135deg,#dbeafe 0%,#eff6ff 40%,#fefce8 100%)' }}>
        <div className="h-1.5 bg-gradient-to-r from-primary-800 via-blue-500 to-yellow-400" />
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {loading
                ? <Sk className="w-20 h-20 rounded-2xl" />
                : <img
                    src={avatarSrc}
                    alt="Foto Profil"
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = avatarImg }}
                  />
              }
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploadingPhoto || loading}
                className="absolute -bottom-2 -right-2 w-7 h-7 bg-primary-800 hover:bg-primary-900 rounded-full flex items-center justify-center shadow-md transition-colors disabled:opacity-50"
              >
                {uploadingPhoto
                  ? <svg className="animate-spin w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  : <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                }
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </div>

            {/* Nama + badge */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="space-y-2"><Sk className="h-6 w-48" /><Sk className="h-5 w-32" /></div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-800 truncate">{form.nama || '—'}</h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    {peserta && (
                      <div className="flex items-center gap-1.5 bg-white border border-blue-100 rounded-lg px-2.5 py-1 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" /></svg>
                        <span className="text-xs text-gray-500 font-medium">ID Peserta:</span>
                        <span className="text-xs font-bold text-primary-800">#{peserta.id}</span>
                      </div>
                    )}
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                      peserta?.status === 'Aktif' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {peserta?.status === 'Aktif' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                      {peserta?.status || 'Belum Terdaftar'}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Ganti / Simpan foto btn */}
            {pendingPhotoFile ? (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelPhoto}
                  className="inline-flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  Batal
                </button>
                <button
                  onClick={handleSavePhoto}
                  disabled={uploadingPhoto}
                  className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-60"
                >
                  {uploadingPhoto ? (
                    <>
                      <svg className="animate-spin w-3.5 h-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Simpan Foto
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploadingPhoto || loading}
                className="hidden sm:inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-primary-400 hover:bg-blue-50 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                Ganti Foto <span className="text-gray-400 font-normal">Maks. 2MB</span>
              </button>
            )}
          </div>

          {/* Quick info strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-blue-100">
            {loading ? Array.from({ length: 3 }).map((_, i) => <Sk key={i} className="h-14 rounded-xl" />) : (
              [
                { icon: '✉️', label: 'EMAIL', value: form.email || '-' },
                { icon: '📞', label: 'NO. HP', value: form.no_hp || '-' },
                { icon: '🏫', label: 'INSTITUSI', value: form.asal_instansi || '-' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 bg-white bg-opacity-60 rounded-xl px-3 py-2.5 border border-white border-opacity-80">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 text-base">{item.icon}</div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 font-semibold">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-700 truncate">{item.value}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Info Magang (read-only) ── */}
      {!loading && peserta && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Informasi Magang</h3>
              <p className="text-xs text-gray-400 mt-0.5">Data ditetapkan oleh admin · tidak dapat diubah sendiri</p>
            </div>
          </div>
          <div className="px-6 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              {[
                { label: 'Bidang / Divisi', value: peserta.bidang_tujuan || '-' },
                { label: 'Status', value: peserta.status || '-' },
                { label: 'Tanggal Mulai', value: fmtTgl(peserta.tanggal_mulai) },
                { label: 'Tanggal Selesai', value: fmtTgl(peserta.tanggal_selesai) },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-500">Progres Magang</span>
                <span className="text-xs font-bold text-primary-700">{pct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-700 to-blue-400 transition-all duration-700"
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {mulai && selesai ? `${fmtTgl(peserta.tanggal_mulai)} — ${fmtTgl(peserta.tanggal_selesai)}` : 'Periode magang belum diset'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Forms grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Edit Data Pribadi */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Edit Data Pribadi</h3>
              <p className="text-xs text-gray-400 mt-0.5">Perbaharui informasi profil Anda</p>
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <Sk key={i} className="h-12 w-full" />)
            ) : (
              <>
                {profileErr && <ErrBanner msg={profileErr} onClose={() => setProfileErr('')} />}

                <FI label="Nama Lengkap"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                  value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} placeholder="Nama lengkap"
                />
                <FI label="Email" type="email"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@contoh.com"
                />

                <div className="grid grid-cols-2 gap-4">
                  <FI label="Nomor HP / WA"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                    type="tel" value={form.no_hp} onChange={e => setForm({ ...form, no_hp: e.target.value })} placeholder="08xxxxxxxxxx"
                  />
                  <FI label="NIM / NIS"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" /></svg>}
                    value={form.nim} onChange={e => setForm({ ...form, nim: e.target.value })} placeholder="Nomor induk"
                  />
                </div>

                <FI label="Universitas / Sekolah"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>}
                  value={form.asal_instansi} onChange={e => setForm({ ...form, asal_instansi: e.target.value })} placeholder="Nama institusi pendidikan"
                />

                {/* Alamat */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Alamat</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3.5 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <textarea rows={3} value={form.alamat} onChange={e => setForm({ ...form, alamat: e.target.value })}
                      placeholder="Alamat lengkap"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button onClick={() => { setForm({ ...origForm }); setProfileErr('') }}
                    disabled={!hasChanged}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    Batal
                  </button>
                  <button id="simpan-profil-btn" onClick={handleSave}
                    disabled={savingProfile || !hasChanged}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-800 hover:bg-primary-900 text-white text-sm font-semibold transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
                    {savingProfile ? (
                      <><svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Menyimpan...</>
                    ) : (
                      <><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>Simpan Perubahan</>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Ubah Password */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <div className="w-9 h-9 bg-yellow-100 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Ubah Password</h3>
              <p className="text-xs text-gray-400 mt-0.5">Perbaharui keamanan akun Anda</p>
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Password Baru */}
            {['newPw', 'confirm'].map((field) => (
              <div key={field}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  {field === 'newPw' ? 'Password Baru' : 'Konfirmasi Password Baru'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPw[field] ? 'text' : 'password'}
                    value={pw[field]}
                    onChange={e => setPw({ ...pw, [field]: e.target.value })}
                    placeholder={field === 'newPw' ? 'Masukkan password baru' : 'Ulangi password baru'}
                    className={`w-full pl-10 pr-10 py-3 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all
                      ${field === 'confirm' && pw.confirm && pw.confirm !== pw.newPw
                        ? 'border-red-300 focus:ring-red-400'
                        : 'border-gray-200 focus:ring-primary-500'}`}
                  />
                  <button onClick={() => toggle(field)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600">
                    <Eye show={showPw[field]} />
                  </button>
                </div>
                {field === 'newPw' && pw.newPw && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-gray-200'}`} />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${strength.score <= 1 ? 'text-red-500' : strength.score === 2 ? 'text-yellow-500' : strength.score === 3 ? 'text-blue-500' : 'text-green-500'}`}>
                      {strength.label}
                    </p>
                  </div>
                )}
                {field === 'confirm' && pw.confirm && pw.confirm !== pw.newPw && (
                  <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
                )}
              </div>
            ))}

            {pwErr && <ErrBanner msg={pwErr} onClose={() => setPwErr('')} />}

            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-blue-600 leading-relaxed">
                Password minimal 8 karakter, mengandung huruf besar, angka, dan karakter khusus.
              </p>
            </div>

            <button id="update-password-btn" onClick={handlePw}
              disabled={savingPw || !pw.newPw || !pw.confirm}
              className="w-full inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl transition-all shadow-sm shadow-yellow-100 disabled:opacity-60 disabled:cursor-not-allowed">
              {savingPw ? (
                <><svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Memperbarui...</>
              ) : (
                <><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>Update Password</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
