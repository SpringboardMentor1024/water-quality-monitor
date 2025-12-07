import axios from 'axios';

// Update this with your backend URL
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  // User Registration
  register: (userData) => {
    return apiClient.post('/auth/register', userData);
  },

  // User Login
  login: (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },

  // User Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    return apiClient.get('/auth/me');
  },
};

// Export apiClient for other API calls
export default apiClient;
