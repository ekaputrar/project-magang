import React, { useState } from 'react'
import lambangImg from '../assets/LambangSidoarjo.png'

const NewPassword = ({ onSubmitSuccess }) => {
  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!passwords.password || !passwords.confirmPassword) {
      setError('Kedua field password harus diisi.')
      return
    }
    if (passwords.password.length < 6) {
      setError('Password baru minimal harus 6 karakter.')
      return
    }
    if (passwords.password !== passwords.confirmPassword) {
      setError('Konfirmasi password tidak cocok.')
      return
    }

    setLoading(true)
    setError('')

    // Simulate password reset call
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
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

      {/* RIGHT SIDE: New Password Form */}
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

          {success ? (
            /* Success State */
            <div className="space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Password Reset Successful!</h1>
                <p className="text-gray-500 text-sm mt-2">Your password has been successfully updated. You can now use your new password to sign in.</p>
              </div>
              <button
                onClick={onSubmitSuccess}
                className="w-full bg-[#1d4ed8] hover:bg-blue-800 text-white font-semibold py-3.5 rounded-lg transition-all duration-200 hover:shadow-md flex items-center justify-center text-sm"
              >
                Go to Sign in
              </button>
            </div>
          ) : (
            /* Form State */
            <>
              {/* Heading */}
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] tracking-tight">New password</h1>
              <p className="text-gray-500 text-sm mt-1 mb-8">Create a new secure password for your account</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password Field */}
                <div>
                  <label htmlFor="password" className="block text-xs font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
                    New Password *
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
                      value={passwords.password}
                      onChange={handleChange}
                      placeholder="Enter New Password"
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

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPass ? 'text' : 'password'}
                      value={passwords.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPass ? (
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
                      Updating...
                    </>
                  ) : (
                    'Reset password'
                  )}
                </button>
              </form>
            </>
          )}

        </div>
      </div>

    </div>
  )
}

export default NewPassword
