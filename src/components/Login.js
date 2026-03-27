import React, { useState } from 'react';
import { authAPI } from '../services/api';
import './Login.css';

const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      const response = await authAPI.login(formData);
      
      // Store tokens if they are returned
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
      }
      if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh);
      }
      
      setSuccessMessage('Login successful! Redirecting...');
      setFormData({
        username: '',
        password: '',
      });
      
      // You can redirect to dashboard or home page here
      // Example: window.location.href = '/dashboard';
      
    } catch (error) {
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          const serverErrors = {};
          Object.keys(errorData).forEach(key => {
            if (Array.isArray(errorData[key])) {
              serverErrors[key] = errorData[key][0];
            } else {
              serverErrors[key] = errorData[key];
            }
          });
          setErrors(serverErrors);
        } else {
          setErrors({ general: errorData || 'Login failed. Please try again.' });
        }
      } else if (error.request) {
        // Network error
        setErrors({ general: 'Network error. Please check your connection.' });
      } else {
        // Other error
        setErrors({ general: 'An unexpected error occurred.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              disabled={isLoading}
              autoComplete="username"
            />
            {errors.username && (
              <span className="error-text">{errors.username}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              disabled={isLoading}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-switch">
          Don't have an account?{' '}
          <button 
            type="button" 
            className="link-button"
            onClick={onSwitchToRegister}
            disabled={isLoading}
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
