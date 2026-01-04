import React, { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('oewm_token'));
  const [view, setView] = useState('login'); // Controls which page is shown

  const handleLogout = () => {
    localStorage.removeItem('oewm_token');
    setToken(null);
    setView('login');
  };

  if (token) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <div className="App">
      {view === 'login' ? (
        <Login 
          setToken={setToken} 
          onSwitchToRegister={() => setView('register')} 
        />
      ) : (
        <Register 
          onSwitchToLogin={() => setView('login')} 
        />
      )}
    </div>
  );
}

export default App;