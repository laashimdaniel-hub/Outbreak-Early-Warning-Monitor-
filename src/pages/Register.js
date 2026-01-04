import React, { useState } from 'react';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('https://outbreak-early-warning-monitor.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'User registered successfully!' });
        // Automatically move to login after success
        setTimeout(() => onSwitchToLogin(), 2000);
      } else {
        setStatus({ type: 'error', message: data.message || 'Registration failed.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Connection to server failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-left">
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-[#008ba3] p-2 rounded-lg text-white"><Activity size={24} /></div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">OEWM</h1>
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create account</h2>
        
        {status.message && (
          <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
            status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Ebenezer"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="akploebenezerselorm@gmail.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#008ba3] hover:bg-[#007a8f] text-white font-semibold py-3 rounded-lg shadow-md transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Register'}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account? 
            <button 
              type="button" 
              onClick={onSwitchToLogin} 
              className="text-teal-600 font-medium hover:underline ml-1"
            >
              Login here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;