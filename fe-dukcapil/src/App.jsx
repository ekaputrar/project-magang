import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { BubbleChat } from 'flowise-embed-react'
import avatarRobot from './assets/avatar_robot.png'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import About from './components/About'
import CTA from './components/CTA'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import VerifyCode from './pages/VerifyCode'
import NewPassword from './pages/NewPassword'
import Dashboard from './pages/Dashboard'
import Registration from './pages/Registration'
import './index.css'

// Cookie key & expiry
const COOKIE_KEY = 'dukcapil_user'
const COOKIE_EXPIRY_DAYS = 1 // maksimal 1 hari

// Pages: 'landing' | 'login' | 'dashboard' | 'forgot-password' | 'verify-code' | 'new-password' | 'register'
function App() {
  const [page, setPage] = useState('landing')
  const [user, setUser] = useState(null)

  // Cek cookie saat pertama kali app dimuat
  useEffect(() => {
    const savedUser = Cookies.get(COOKIE_KEY)
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        setPage('dashboard')
      } catch {
        Cookies.remove(COOKIE_KEY)
      }
    }
  }, [])

  const handleLogin = (userData) => {
    // Simpan user ke cookie dengan expiry 1 hari
    Cookies.set(COOKIE_KEY, JSON.stringify(userData), {
      expires: COOKIE_EXPIRY_DAYS,
      sameSite: 'Strict',
    })
    setUser(userData)
    setPage('dashboard')
  }

  const handleLogout = () => {
    // Hapus cookie saat logout
    Cookies.remove(COOKIE_KEY)
    setUser(null)
    setPage('landing')
  }

  if (page === 'login') {
    return (
      <Login
        onLogin={handleLogin}
        onBack={() => setPage('landing')}
        onForgotPassword={() => setPage('forgot-password')}
        onRegister={() => setPage('register')}
      />
    )
  }

  if (page === 'register') {
    return (
      <Register
        onBackToLogin={() => setPage('login')}
      />
    )
  }

  if (page === 'forgot-password') {
    return (
      <ForgotPassword
        onBackToLogin={() => setPage('login')}
        onSubmitSuccess={() => setPage('verify-code')}
      />
    )
  }

  if (page === 'verify-code') {
    return (
      <VerifyCode
        onVerifySuccess={() => setPage('new-password')}
        onChangeEmail={() => setPage('forgot-password')}
      />
    )
  }

  if (page === 'new-password') {
    return (
      <NewPassword
        onSubmitSuccess={() => setPage('login')}
      />
    )
  }

  if (page === 'registration') {
    return (
      <Registration
        onBack={() => setPage('landing')}
      />
    )
  }

  if (page === 'dashboard') {
    return (
      <Dashboard
        user={user}
        onLogout={handleLogout}
      />
    )
  }

  // Landing page
  return (
    <div className="font-sans min-h-screen">
      <Navbar onLoginClick={() => setPage('login')} />
      <main>
        <Hero onLoginClick={() => setPage('login')} onRegisterClick={() => setPage('registration')} />
        <Features />
        <About />
        <CTA onLoginClick={() => setPage('login')} onRegisterClick={() => setPage('registration')} />
      </main>
      <Footer />
      <BubbleChat
        chatflowid="26f1a3a3-357d-4373-a02a-19b47d9d3301"
        apiHost="https://flowisenew-production.up.railway.app"
        theme={{
          button: {
            backgroundColor: '#1e40af',
            right: 24,
            bottom: 24,
            size: 52,
            dragAndDrop: true,
            iconColor: 'white',
            customIconSrc: avatarRobot,
            autoWindowOpen: {
              autoOpen: false,
            },
          },
          tooltip: {
            showTooltip: true,
            tooltipMessage: 'Ada yang bisa kami bantu? 👋',
            tooltipBackgroundColor: '#1e40af',
            tooltipTextColor: 'white',
            tooltipFontSize: 14,
          },
          chatWindow: {
            showTitle: true,
            showAgentMessages: true,
            title: 'Asisten Dukcapil',
            titleAvatarSrc: avatarRobot,
            welcomeMessage: 'Selamat datang! Saya asisten virtual Dinas Kependudukan dan Pencatatan Sipil. Ada yang bisa saya bantu? 😊',
            errorMessage: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
            backgroundColor: '#ffffff',
            height: 580,
            width: 380,
            fontSize: 14,
            starterPrompts: [
              'Bagaimana cara mengurus KTP?',
              'Syarat membuat akta kelahiran?',
              'Cara daftar magang di Dukcapil?',
            ],
            starterPromptFontSize: 13,
            clearChatOnReload: false,
            sourceDocsTitle: 'Sumber:',
            renderHTML: true,
            botMessage: {
              backgroundColor: '#eff6ff',
              textColor: '#1e293b',
              showAvatar: true,
              avatarSrc: avatarRobot,
            },
            userMessage: {
              backgroundColor: '#1e40af',
              textColor: '#ffffff',
              showAvatar: true,
              avatarSrc: '../src/assets/usercircle.svg',
            },
            textInput: {
              placeholder: 'Ketik pertanyaan Anda...',
              backgroundColor: '#f8fafc',
              textColor: '#1e293b',
              sendButtonColor: '#1e40af',
              maxChars: 500,
              maxCharsWarningMessage: 'Maksimal 500 karakter',
              autoFocus: true,
              sendMessageSound: false,
              receiveMessageSound: false,
            },
            feedback: {
              color: '#1e40af',
            },
            footer: {
              textColor: '#94a3b8',
              text: 'Powered by',
              company: 'Dukcapil AI',
              companyLink: '#',
            },
          },
        }}
      />
    </div>
  )
}

export default App
