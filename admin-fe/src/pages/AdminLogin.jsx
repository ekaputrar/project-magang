import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    // Authenticate with default credentials
    if (email === 'admin@sidoarjo.go.id' && password === 'admin') {
      localStorage.setItem('adminToken', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Email atau password salah.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center font-poppins relative">
      {/* Top Left Text */}
      <div className="absolute top-6 left-8">
        <h1 className="text-xl font-medium text-gray-400"></h1>
      </div>

      {/* Container */}
      <div className="bg-white rounded-[2rem] p-10 w-full max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#1e293b] mb-2">Selamat Datang</h2>
          <p className="text-gray-500 text-sm">Masuk ke akun Anda</p>
        </div>
        
        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium text-center animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input 
              className="appearance-none border border-gray-200 rounded-xl w-full py-3.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              id="email" 
              type="email" 
              placeholder="admin@sidoarjo.go.id" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="mb-8">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input 
              className="appearance-none border border-gray-200 rounded-xl w-full py-3.5 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              id="password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white font-semibold py-3.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
            type="submit"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
