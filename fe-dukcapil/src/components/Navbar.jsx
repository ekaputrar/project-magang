import React, { useState, useEffect } from 'react'
import logoDisdukcapil from '../assets/logo_disdukcapil.png'
import lambangImg from '../assets/LambangSidoarjo.png'

const Navbar = ({ onLoginClick }) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-3' : 'bg-white py-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={lambangImg}
            alt="Lambang Kabupaten Sidoarjo"
            className="h-12 w-auto object-contain"
          />
          <img
            src={logoDisdukcapil}
            alt="Disdukcapil Kabupaten Sidoarjo"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Beranda', 'Fitur', 'Tentang', 'Kontak'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">
              {item}
            </a>
          ))}
        </div>

        {/* Login Button */}
        <div className="hidden md:block">
          <button
            onClick={onLoginClick}
            id="navbar-login-btn"
            className="bg-primary-800 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-primary-900 transition-colors duration-200"
          >
            Login
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {['Beranda', 'Fitur', 'Tentang', 'Kontak'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="nav-link text-base"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </a>
          ))}
          <button onClick={onLoginClick} className="bg-primary-800 text-white text-sm font-semibold px-5 py-2 rounded-lg text-center w-full">
            Login
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
