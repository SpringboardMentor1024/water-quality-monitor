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

// ===== WATER QUALITY API =====
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

// ===== AUTH API =====
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

// ===== STATION API =====
export const stationAPI = {
  getStations: async () => {
    try {
      const response = await api.get('/api/stations');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch stations:', error);
      throw error.response?.data || { 
        message: 'Failed to fetch stations' 
      };
    }
  },

  getStationById: async (stationId) => {
    try {
      const response = await api.get(`/api/stations/${stationId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch station:', error);
      throw error.response?.data || { 
        message: 'Failed to fetch station' 
      };
    }
  },

  searchStations: async (searchParams) => {
    try {
      const response = await api.get('/api/stations/search', { 
        params: searchParams 
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search stations:', error);
      throw error.response?.data || { 
        message: 'Failed to search stations' 
      };
    }
  },

  getStationReadings: async (stationId, period = 'daily') => {
    try {
      const response = await api.get(`/api/stations/${stationId}/readings`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch readings:', error);
      throw error.response?.data || { 
        message: 'Failed to fetch readings' 
      };
    }
  },

  getStationTrends: async (stationId, metric, period = 'weekly') => {
    try {
      const response = await api.get(`/api/stations/${stationId}/trends/${metric}`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch trends:', error);
      throw error.response?.data || { 
        message: 'Failed to fetch trends' 
      };
    }
  }
};

// ===== REPORTS API =====
export const reportsAPI = {
  getReports: async () => {
    try {
      const response = await api.get('/api/reports');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      throw error.response?.data || { 
        message: 'Failed to fetch reports' 
      };
    }
  },

  getReportById: async (reportId) => {
    try {
      const response = await api.get(`/api/reports/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch report:', error);
      throw error.response?.data || { 
        message: 'Failed to fetch report' 
      };
    }
  },

  createReport: async (reportData) => {
    try {
      const response = await api.post('/api/reports', reportData);
      return response.data;
    } catch (error) {
      console.error('Failed to create report:', error);
      throw error.response?.data || { 
        message: 'Failed to create report' 
      };
    }
  },

  updateReport: async (reportId, updateData) => {
    try {
      const response = await api.put(`/api/reports/${reportId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Failed to update report:', error);
      throw error.response?.data || { 
        message: 'Failed to update report' 
      };
    }
  }
};

// ===== HEALTH API =====
export const healthAPI = {
  checkHealth: async () => {
    try {
      const response = await api.get('/api/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error.response?.data || { 
        message: 'API health check failed' 
      };
    }
  }
};

export default api;
