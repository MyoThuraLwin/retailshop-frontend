import React, { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import ProductList from './components/ProductList';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated on app load
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
      setCurrentView('products');
    }
  }, []);

  const switchToRegister = () => {
    setCurrentView('register');
  };

  const switchToLogin = () => {
    setCurrentView('login');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentView('products');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  // If authenticated, show product list
  if (isAuthenticated) {
    return (
      <div className="App">
        <ProductList onLogout={handleLogout} />
      </div>
    );
  }

  // If not authenticated, show auth forms
  return (
    <div className="App">
      {currentView === 'register' ? (
        <Register 
          onSwitchToLogin={switchToLogin} 
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <Login 
          onSwitchToRegister={switchToRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;
