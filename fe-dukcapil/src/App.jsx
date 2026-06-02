import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import About from './components/About'
import CTA from './components/CTA'
import Footer from './components/Footer'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './index.css'

// Pages: 'landing' | 'login' | 'dashboard'
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
