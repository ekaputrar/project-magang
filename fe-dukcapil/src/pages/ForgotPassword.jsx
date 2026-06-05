import React, { useState } from 'react'

const ForgotPassword = ({ onBackToLogin, onSubmitSuccess }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) {
      setError('Email harus diisi.')
      return
    }
    setLoading(true)
    setError('')
    setMessage('')
    
    // Simulate API call for sending reset code
    setTimeout(() => {
      setLoading(false)
      if (email.trim().toLowerCase() === 'budi@gmail.com') {
        onSubmitSuccess()
      } else {
        setError('Email tidak terdaftar. Coba: budi@gmail.com')
      }
    }, 1200)
  }

  return (
    <div className="min-h-screen w-full flex bg-white relative overflow-hidden font-sans">
      
      {/* LEFT SIDE: Sidoarjo Card Logo on Light Gray Background (Hidden on mobile) */}
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

      {/* RIGHT SIDE: Forgot Password Form */}
      <div className="w-full md:w-[50%] lg:w-[45%] h-screen overflow-y-auto flex items-center justify-center bg-white relative p-6 sm:p-12 lg:p-16">
        
        <div className="w-full max-w-[400px]">
          {/* disdukcapil Logo Header */}
          <div className="flex flex-col items-start mb-12">
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
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] tracking-tight">Forgot password</h1>
          <p className="text-gray-500 text-sm mt-1 mb-8">Enter your email to reset password</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
                Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                    setMessage('')
                  }}
                  placeholder="Please enter your mail id"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-white"
                />
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
            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-2 text-green-600 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {message}
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
                'Reset password'
              )}
            </button>
          </form>

          {/* Back to Sign in Link */}
          <div className="text-center text-sm text-gray-600 mt-10">
            Back to{' '}
            <button
              onClick={onBackToLogin}
              className="text-blue-600 hover:text-blue-800 font-bold transition-colors focus:outline-none"
            >
              Sign in
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}

export default ForgotPassword
