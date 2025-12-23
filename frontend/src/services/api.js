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
  },

  getStations: async () => {
    try {
      const response = await api.get('/api/stations');
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Failed to fetch water stations' 
      };
    }
  },

  getStationById: async (stationId) => {
    try {
      const response = await api.get(`/api/stations/${stationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Failed to fetch station details' 
      };
    }
  },

  getStationReadings: async (stationId, timeRange = 'daily') => {
    try {
      const response = await api.get(`/api/stations/${stationId}/readings?range=${timeRange}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Failed to fetch station readings' 
      };
    }
  },

  searchStations: async (filters) => {
    try {
      const response = await api.post('/api/stations/search', filters);
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Failed to search stations' 
      };
    }
  }
};

export const govAPI = {
  getEPAData: async (params) => {
    try {
      const response = await api.get('/api/gov/epa', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Failed to fetch EPA data' 
      };
    }
  },

  getWHOData: async (params) => {
    try {
      const response = await api.get('/api/gov/who', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Failed to fetch WHO data' 
      };
    }
  },

  getCPCBData: async (params) => {
    try {
      const response = await api.get('/api/gov/cpcb', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Failed to fetch CPCB data' 
      };
    }
  }
};

export const reportsAPI = {
  getUserReports: async () => {
    try {
      const response = await api.get('/api/reports/user');
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Failed to fetch user reports' 
      };
    }
  },

  submitReport: async (reportData) => {
    try {
      const response = await api.post('/api/reports', reportData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Failed to submit report' 
      };
    }
  },

  getReportById: async (reportId) => {
    try {
      const response = await api.get(`/api/reports/${reportId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Failed to fetch report details' 
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