import React, { useState } from 'react';
import { Activity, AlertCircle } from 'lucide-react';

const Login = ({ setToken, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://outbreak-early-warning-monitor.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('oewm_token', data.token);
        setToken(data.token);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server connection failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-left">
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-[#008ba3] p-2 rounded-lg text-white"><Activity size={24} /></div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">OEWM</h1>
      </div>
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign in to platform</h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm"><AlertCircle size={18}/>{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your email</label>
            <input type="email" className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-teal-500 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your password</label>
            <input type="password" className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-teal-500 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="w-full bg-[#008ba3] hover:bg-[#007a8f] text-white font-semibold py-3 rounded-lg shadow-md transition-all">Login</button>
          <p className="text-center text-sm text-gray-600 mt-4">
            Not registered? 
            <button 
              type="button" 
              onClick={onSwitchToRegister} 
              className="text-teal-600 font-medium hover:underline ml-1"
            >
              Create account
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;