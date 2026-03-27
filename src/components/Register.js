import React, { useState } from 'react';
import { authAPI } from '../services/api';
import './Register.css';

const Register = ({ onSwitchToLogin, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirm_password: '',
    phone_number: '',
    address: '',
    date_of_birth: '',
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
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirm_password || formData.confirm_password.trim() === '') {
      newErrors.confirm_password = 'Please confirm your password';
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\d+$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Phone number must contain only digits';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
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
      const response = await authAPI.register(formData);
      
      setSuccessMessage('Registration successful! You can now log in.');
      setFormData({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        confirm_password: '',
        phone_number: '',
        address: '',
        date_of_birth: '',
      });
      
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
          setErrors({ general: errorData || 'Registration failed. Please try again.' });
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
    <div className="register-container">
      <div className="register-form">
        <h2>Create Account</h2>
        
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
            />
            {errors.username && (
              <span className="error-text">{errors.username}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={errors.first_name ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.first_name && (
              <span className="error-text">{errors.first_name}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={errors.last_name ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.last_name && (
              <span className="error-text">{errors.last_name}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className={errors.phone_number ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.phone_number && (
              <span className="error-text">{errors.phone_number}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.address && (
              <span className="error-text">{errors.address}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="date_of_birth">Date of Birth</label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className={errors.date_of_birth ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.date_of_birth && (
              <span className="error-text">{errors.date_of_birth}</span>
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
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className={errors.confirm_password ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.confirm_password && (
              <span className="error-text">{errors.confirm_password}</span>
            )}
          </div>
          
          <button 
            type="submit" 
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="auth-switch">
          Already have an account?{' '}
          <button 
            type="button" 
            className="link-button"
            onClick={onSwitchToLogin}
            disabled={isLoading}
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
