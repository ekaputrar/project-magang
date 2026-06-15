import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const Register = ({ onBackToLogin }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError('Semua kolom wajib diisi.')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setError('Format email tidak valid.')
      return
    }

    // Basic phone validation (digits and min length)
    const phoneRegex = /^[0-9+]{8,15}$/
    if (!phoneRegex.test(form.phone)) {
      setError('Nomor telepon tidak valid (8-15 digit).')
      return
    }

    if (form.password.length < 6) {
      setError('Password minimal 6 karakter.')
      return
    }

    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name,
          phone: form.phone,
        }
      }
    })

    setLoading(false)

    if (authError) {
      setError(authError.message || 'Pendaftaran gagal. Coba lagi.')
      return
    }

    setSuccess('Pendaftaran berhasil! Silakan cek email Anda untuk konfirmasi, lalu login.')
    
    setTimeout(() => {
      onBackToLogin()
    }, 3000)
  }

  return (
    <div className="min-h-screen w-full flex bg-white relative overflow-hidden font-sans">
      
      {/* LEFT SIDE: Sidoarjo Card Logo on Light Gray Background (Hidden on mobile, matches Login/ForgotPassword) */}
      <div className="hidden md:flex md:w-[50%] lg:w-[55%] h-screen bg-[#e2e8f0] items-center justify-center relative p-8">
        
        {/* Centered Card */}
        <div className="w-full max-w-[360px] bg-white rounded-[32px] shadow-[0_15px_30px_rgba(0,0,0,0.08)] p-10 flex flex-col items-center justify-center border border-gray-100/50">
          {/* Logo Crest */}
          <img
            src="src/assets/LambangSidoarjo.png"
            alt="Lambang Kabupaten Sidoarjo"
            className="w-36 h-36 object-contain mb-8 select-none pointer-events-none transform transition-transform hover:scale-105 duration-500"
          />
          {/* Text labels */}
          <h2 className="text-xl font-extrabold text-[#0f172a] tracking-wide text-center">
            KABUPATEN SIDOARJO
          </h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center mt-3 leading-relaxed">
            Pelayanan Administrasi<br />Kependudukan Terintegrasi
          </p>
        </div>

        {/* Bottom Left Copyright */}
        <span className="absolute bottom-4 left-6 text-[10px] text-gray-500 font-medium select-none">
          © 2026 Pemerintah Kabupaten Sidoarjo
        </span>
      </div>

      {/* RIGHT SIDE: Register Form */}
      <div className="w-full md:w-[50%] lg:w-[45%] h-screen overflow-y-auto flex items-center justify-center bg-white relative p-6 sm:p-12 lg:p-16">
        
        {/* Elegant Floating Back Button */}
        <button
          onClick={onBackToLogin}
          className="absolute top-6 right-6 flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors text-xs font-semibold bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Login
        </button>

        <div className="w-full max-w-[400px]">
          {/* disdukcapil Logo Header */}
          <div className="flex flex-col items-start mb-8">
            <div
              className="font-black text-3xl sm:text-4xl select-none tracking-tight flex items-center"
              style={{
                fontFamily: "'Inter', sans-serif",
                textShadow: '1.5px 1.5px 0px #000, -1.5px -1.5px 0px #000, 1.5px -1.5px 0px #000, -1.5px 1.5px 0px #000, 1.5px 1.5px 0px #000'
              }}
            >
              <span className="text-[#3b82f6]">dis</span>
              <span className="text-[#eab308]">duk</span>
              <span className="text-[#ef4444]">capil</span>
            </div>
            <div className="bg-black text-[#22c55e] px-2.5 py-0.5 rounded text-[8px] font-bold tracking-widest mt-1.5 uppercase shadow-sm">
              KABUPATEN SIDOARJO
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] tracking-tight">Create an account</h1>
          <p className="text-gray-500 text-sm mt-1 mb-8">Join now to get the experience</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
                Name *
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-white"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
                Email *
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your mail address"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-white"
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
                Phone number *
              </label>
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-white"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPass ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2 text-red-600 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-2 text-green-600 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1d4ed8] hover:bg-blue-800 text-white font-semibold py-3.5 rounded-lg transition-all duration-200 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm pt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Register'
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center text-sm text-gray-600 mt-8">
            Already have an account?{' '}
            <button
              onClick={onBackToLogin}
              className="text-blue-600 hover:text-blue-800 font-bold transition-colors focus:outline-none"
            >
              Login here
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Register
