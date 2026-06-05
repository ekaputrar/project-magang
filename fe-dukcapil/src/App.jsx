import React, { useState } from 'react'
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
import './index.css'

// Pages: 'landing' | 'login' | 'dashboard' | 'forgot-password' | 'verify-code' | 'new-password' | 'register'
function App() {
  const [page, setPage] = useState('landing')
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
    setPage('dashboard')
  }

  const handleLogout = () => {
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
        <Hero onLoginClick={() => setPage('login')} />
        <Features />
        <About />
        <CTA onLoginClick={() => setPage('login')} />
      </main>
      <Footer />
    </div>
  )
}

export default App
