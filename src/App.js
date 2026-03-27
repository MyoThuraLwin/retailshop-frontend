import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login');

  const switchToRegister = () => setCurrentView('register');
  const switchToLogin = () => setCurrentView('login');

  return (
    <div className="App">
      {currentView === 'register' ? (
        <Register onSwitchToLogin={switchToLogin} />
      ) : (
        <Login onSwitchToRegister={switchToRegister} />
      )}
    </div>
  );
}

export default App;
