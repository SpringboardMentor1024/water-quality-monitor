// src/utils/api.js

import axios from 'axios';

// ⚠️ IMPORTANT: Set the base URL for your backend API.
// Assuming your backend is running locally on port 5000:
const BASE_URL = 'http://localhost:5000/api'; 

// Create an Axios instance with a default configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ----------------------------------------------------
// Interceptor for Authentication (Attaches token automatically)
// This runs before every request
api.interceptors.request.use(
  config => {
    // Check local storage for the authentication token
    const token = localStorage.getItem('authToken');
    if (token) {
      // If found, attach it to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
// ----------------------------------------------------

export default api;