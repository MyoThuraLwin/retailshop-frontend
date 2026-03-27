import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import './ProductList.css';

const ProductList = ({ onLogout }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await productAPI.getAll();
      console.log('API Response:', response);
      console.log('Response Data:', response.data);
      
      // Handle different response structures
      let productsData = response.data;
      if (Array.isArray(productsData)) {
        setProducts(productsData);
      } else if (productsData && typeof productsData === 'object') {
        // If response is an object, look for common array properties
        if (Array.isArray(productsData.results)) {
          setProducts(productsData.results);
        } else if (Array.isArray(productsData.data)) {
          setProducts(productsData.data);
        } else if (Array.isArray(productsData.products)) {
          setProducts(productsData.products);
        } else {
          console.error('Unexpected response structure:', productsData);
          setProducts([]);
          setError('Unexpected data format received from server.');
        }
      } else {
        console.error('Response data is not an array or object:', productsData);
        setProducts([]);
        setError('No products data received from server.');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        // You might want to redirect to login here
      } else {
        setError('Failed to fetch products. Please try again.');
      }
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        await productAPI.delete(productId);
        setSuccessMessage('Product deleted successfully!');
        // Remove product from list
        setProducts(products.filter(p => p.id !== productId));
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError('Failed to delete product. Please try again.');
        console.error('Error deleting product:', error);
        // Clear error message after 3 seconds
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleViewDetails = (product) => {
    // For now, we'll show an alert. In a real app, this would navigate to a details page
    alert(`Product Details:\n\nCode: ${product.product_code}\nName: ${product.name}\nDescription: ${product.description || 'N/A'}\nPrice: $${product.price}`);
  };

  const handleEdit = (product) => {
    // For now, we'll show an alert. In a real app, this would navigate to an edit page
    alert(`Edit functionality for product "${product.name}" would be implemented here.`);
  };

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      // Call logout API
      productAPI.logout(refreshToken).catch(console.error);
    }
    // Clear tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Call parent logout handler
    onLogout();
  };

  if (isLoading) {
    return (
      <div className="product-list-container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h2>Product List</h2>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {products.length === 0 ? (
        <div className="no-products">
          <p>No products found.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="product-table">
            <thead>
              <tr>
                <th>Product Code</th>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.product_code}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td className="actions">
                    <button 
                      className="action-button view-button"
                      onClick={() => handleViewDetails(product)}
                    >
                      View Details
                    </button>
                    <button 
                      className="action-button edit-button"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button 
                      className="action-button delete-button"
                      onClick={() => handleDelete(product.id, product.name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
