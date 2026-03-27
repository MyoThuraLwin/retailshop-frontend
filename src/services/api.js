import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token in requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => api.post('/api/auth/register/', userData),
  login: (credentials) => api.post('/api/auth/login/', credentials),
  logout: (refreshToken) => api.post('/api/auth/logout/', { refresh_token: refreshToken }),
};

export const productAPI = {
  getAll: () => api.get('/api/products/'),
  getById: (id) => api.get(`/api/products/${id}/`),
  create: (productData) => api.post('/api/products/', productData),
  update: (id, productData) => api.put(`/api/products/${id}/`, productData),
  delete: (id) => api.delete(`/api/products/${id}/`),
};

export default api;
