import React, { useState } from 'react';
import { productAPI } from '../services/api';
import './AddProduct.css';

const AddProduct = ({ onBackToList, onProductAdded }) => {
  const [formData, setFormData] = useState({
    product_code: '',
    name: '',
    description: '',
    price: '',
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
    
    if (!formData.product_code.trim()) {
      newErrors.product_code = 'Product code is required';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
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
      const productData = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      const response = await productAPI.create(productData);
      
      setSuccessMessage('Product added successfully!');
      setFormData({
        product_code: '',
        name: '',
        description: '',
        price: '',
      });
      
      // Notify parent component that product was added
      if (onProductAdded) {
        onProductAdded(response.data);
      }
      
      // Redirect back to product list after 2 seconds
      setTimeout(() => {
        onBackToList();
      }, 2000);
      
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
          setErrors({ general: errorData || 'Failed to add product. Please try again.' });
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

  const handleCancel = () => {
    onBackToList();
  };

  return (
    <div className="add-product-container">
      <div className="add-product-form">
        <div className="form-header">
          <h2>Add New Product</h2>
          <button className="back-button" onClick={handleCancel}>
            ← Back to Products
          </button>
        </div>
        
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
            <label htmlFor="product_code">Product Code</label>
            <input
              type="text"
              id="product_code"
              name="product_code"
              value={formData.product_code}
              onChange={handleChange}
              className={errors.product_code ? 'error' : ''}
              disabled={isLoading}
              placeholder="e.g., C-00001"
            />
            {errors.product_code && (
              <span className="error-text">{errors.product_code}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              disabled={isLoading}
              placeholder="e.g., Test Product 01"
            />
            {errors.name && (
              <span className="error-text">{errors.name}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
              disabled={isLoading}
              placeholder="Enter product description"
              rows={4}
            />
            {errors.description && (
              <span className="error-text">{errors.description}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={errors.price ? 'error' : ''}
              disabled={isLoading}
              placeholder="e.g., 25.00"
            />
            {errors.price && (
              <span className="error-text">{errors.price}</span>
            )}
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
