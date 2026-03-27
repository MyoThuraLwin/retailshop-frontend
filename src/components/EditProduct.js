import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import './EditProduct.css';

const EditProduct = ({ productId, onBackToList, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    product_code: '',
    name: '',
    description: '',
    price: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setIsFetching(true);
      setNotFound(false);
      const response = await productAPI.getById(productId);
      
      // Handle different response structures
      let productData = response.data;
      if (productData && typeof productData === 'object') {
        // Extract product data if wrapped
        if (productData.data) {
          productData = productData.data;
        }
        
        setFormData({
          product_code: productData.product_code || '',
          name: productData.name || '',
          description: productData.description || '',
          price: productData.price ? productData.price.toString() : '',
        });
      } else {
        setNotFound(true);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setNotFound(true);
      } else {
        console.error('Error fetching product:', error);
      }
    } finally {
      setIsFetching(false);
    }
  };

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
      
      const response = await productAPI.update(productId, productData);
      
      setSuccessMessage('Product updated successfully!');
      
      // Notify parent component that product was updated
      if (onProductUpdated) {
        onProductUpdated(response.data);
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
          setErrors({ general: errorData || 'Failed to update product. Please try again.' });
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

  if (isFetching) {
    return (
      <div className="edit-product-container">
        <div className="loading">Loading product details...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="edit-product-container">
        <div className="not-found">
          <h3>Product Not Found</h3>
          <p>The product you're trying to edit doesn't exist.</p>
          <button className="back-button" onClick={handleCancel}>
            ← Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-product-container">
      <div className="edit-product-form">
        <div className="form-header">
          <h2>Edit Product</h2>
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
              {isLoading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
