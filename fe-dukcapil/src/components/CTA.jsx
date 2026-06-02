import React from 'react'

const CTA = () => {
  return (
    <section id="kontak" className="py-20" style={{ background: 'linear-gradient(135deg, #1a2e6e 0%, #1E40AF 60%, #2563EB 100%)' }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Siap Memulai Pengalaman Magang Anda?
        </h2>
        <p className="text-blue-200 text-sm md:text-base mb-10 max-w-xl mx-auto leading-relaxed">
          Bergabunglah dengan sistem pengelolaan magang terintegrasi dan dapatkan pengalaman berharga di instansi pemerintahan
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4">
          <a
            href="#daftar"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-7 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Daftar Sekarang
          </a>
          <a
            href="tel:+62315123456"
            className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold px-7 py-3 rounded-lg transition-all duration-200 hover:bg-white hover:text-primary-800 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Hubungi Kami
          </a>
        </div>
      </div>
    </section>
  )
}

export default CTA
