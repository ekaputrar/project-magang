import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import lambangImg from '../assets/LambangSidoarjo.png'

const Login = ({ onLogin, onBack, onForgotPassword, onRegister }) => {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      setError('Email dan password harus diisi.')
      return
    }
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: form.username.trim(),
      password: form.password,
    })

    setLoading(false)

    if (authError) {
      setError('Email atau password salah. Pastikan akun Anda sudah terdaftar.')
      return
    }

    onLogin({
      name: data.user?.user_metadata?.name || data.user?.email,
      role: 'Peserta Magang',
      id: data.user?.id,
      email: data.user?.email
    })
  }

  return (
    <div className="min-h-screen w-full flex bg-white relative overflow-hidden font-sans">

      {/* LEFT SIDE: Sidoarjo Card Logo on Light Gray Background (Hidden on mobile) */}
      <div className="hidden md:flex md:w-[50%] lg:w-[55%] h-screen bg-[#e2e8f0] items-center justify-center relative p-8">

        {/* Centered Card */}
        <div className="w-full max-w-[360px] bg-white rounded-[32px] shadow-[0_15px_30px_rgba(0,0,0,0.08)] p-10 flex flex-col items-center justify-center border border-gray-100/50">
          {/* Logo Crest */}
          <img
            src={lambangImg}
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

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full md:w-[50%] lg:w-[45%] h-screen overflow-y-auto flex items-center justify-center bg-white relative p-6 sm:p-12 lg:p-16">

        {/* Elegant Floating Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 right-6 flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors text-xs font-semibold bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Beranda
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
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] tracking-tight">Selamat Datang!</h1>
          <p className="text-gray-500 text-sm mt-1 mb-8">Silakan masuk ke akun Anda</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="username" className="block text-xs font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
                Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter your mail address"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-white"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-white"
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

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-gray-700 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors focus:outline-none"
              >
                Forgot your password ?
              </button>
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


            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1d4ed8] hover:bg-blue-800 text-white font-semibold py-3.5 rounded-lg transition-all duration-200 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
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
                <span className="flex items-center gap-2">
                  Log In
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center text-sm text-gray-600 mt-10">
            Don't have an account ?{' '}
            <a
              href="#register"
              onClick={(e) => {
                e.preventDefault()
                onRegister()
              }}
              className="text-blue-600 hover:text-blue-800 font-bold transition-colors"
            >
              Register here
            </a>
          </div>

        </div>
      </div>

    </div>
  )

}

export default Login
