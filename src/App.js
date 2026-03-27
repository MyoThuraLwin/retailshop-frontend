import React, { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
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

  const handleAddProduct = () => {
    setCurrentView('add-product');
  };

  const handleBackToProducts = () => {
    setCurrentView('products');
  };

  const handleProductAdded = (newProduct) => {
    // This could be used to refresh the product list
    setCurrentView('products');
  };

  // If authenticated, show appropriate view
  if (isAuthenticated) {
    return (
      <div className="App">
        {currentView === 'products' ? (
          <ProductList 
            onLogout={handleLogout} 
            onAddProduct={handleAddProduct}
          />
        ) : currentView === 'add-product' ? (
          <AddProduct 
            onBackToList={handleBackToProducts}
            onProductAdded={handleProductAdded}
          />
        ) : (
          <ProductList 
            onLogout={handleLogout} 
            onAddProduct={handleAddProduct}
          />
        )}
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
