import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const waterQualityAPI = {
  getReadings: async () => {
    try {
      const response = await api.get('/api/readings');
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Failed to fetch water quality data' 
      };
    }
  }
};

export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Registration failed' 
      };
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      
      // Store the token
      localStorage.setItem('authToken', response.data.access_token);
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Login failed' 
      };
    }
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Failed to send reset email' 
      };
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/api/auth/reset-password', {
        token,
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Failed to reset password' 
      };
    }
  },

  // ✅ NEW: Profile Update Functions
  updateProfile: async (updateData) => {
    try {
      const response = await api.put('/api/auth/profile', updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Failed to update profile' 
      };
    }
  },

  updatePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/api/auth/profile', {
        current_password: currentPassword,
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Failed to update password' 
      };
    }
  }
};

export default api;