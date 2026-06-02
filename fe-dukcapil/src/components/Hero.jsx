import React from 'react'
import heroImage from '../assets/hero_image.png'

const Hero = () => {
  return (
    <section
      id="beranda"
      className="relative min-h-[520px] pt-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a2e6e 0%, #1E40AF 50%, #2563EB 100%)',
      }}
    >
      {/* Background decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 opacity-10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-300 opacity-10 rounded-full translate-y-1/2 -translate-x-1/4"></div>

      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-10">
        {/* Left Content */}
        <div className="flex-1 text-left z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Sistem Informasi <br />
            Pengelolaan{' '}
            <span className="text-accent">Peserta</span>
            <br />
            <span className="text-accent">Magang</span> Terintegrasi
          </h1>
          <p className="text-blue-200 text-sm md:text-base mb-8 max-w-md leading-relaxed">
            Solusi digital terpadu untuk mengelola peserta magang di Dinas Kependudukan dan Pencatatan Sipil Kabupaten Sidoarjo secara efisien dan terintegrasi.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#daftar"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Daftar Magang
            </a>
            <a
              href="#fitur"
              className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:bg-white hover:text-primary-800 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pelajari Lebih
            </a>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center md:justify-end z-10">
          <div className="relative w-full max-w-sm md:max-w-md">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white border-opacity-20">
              <img
                src={heroImage}
                alt="Sistem Informasi Magang Dukcapil Sidoarjo"
                className="w-full h-72 object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-800">Sistem Aktif</div>
                <div className="text-xs text-gray-500">Siap Digunakan</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-10" fill="white">
          <path d="M0,40 C360,0 1080,80 1440,40 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  )
}

export default Hero
