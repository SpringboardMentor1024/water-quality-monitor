// src/services/api.js - Combined API with all endpoints and improved error handling
const API_BASE = 'http://localhost:8000';

// Helper function for consistent error handling
const handleResponse = async (response, defaultError) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || defaultError);
    }
    return await response.json();
};

// Helper function for headers
const getHeaders = (includeAuth = true, additionalHeaders = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...additionalHeaders
    };
    
    if (includeAuth) {
        const token = localStorage.getItem('authToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    
    return headers;
};

// ===== Auth API =====
export const authAPI = {
    register: async (userData) => {
        const response = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: getHeaders(false),
            body: JSON.stringify(userData)
        });
        return handleResponse(response, 'Registration failed');
    },

    login: async (email, password) => {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: getHeaders(false),
            body: JSON.stringify({ email, password })
        });
        
        const data = await handleResponse(response, 'Login failed');
        localStorage.setItem('authToken', data.access_token);
        return data;
    },

    getCurrentUser: async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return null;
        
        const response = await fetch(`${API_BASE}/api/auth/me`, {
            headers: getHeaders(true)
        });
        
        return response.ok ? await response.json() : null;
    },

    forgotPassword: async (email) => {
        const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
            method: 'POST',
            headers: getHeaders(false),
            body: JSON.stringify({ email })
        });
        
        return handleResponse(response, 'Failed to send reset email');
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }
};

// ===== NGOs API =====
export const ngosAPI = {
    getAllNGOs: async () => {
        const response = await fetch(`${API_BASE}/api/ngos`, {
            headers: getHeaders(false)
        });
        return handleResponse(response, 'Failed to fetch NGOs');
    },

    getNGOById: async (ngoId) => {
        const response = await fetch(`${API_BASE}/api/ngos/${ngoId}`, {
            headers: getHeaders(false)
        });
        return handleResponse(response, 'NGO not found');
    }
};

// ===== Projects API =====
export const projectsAPI = {
    getAllProjects: async () => {
        const response = await fetch(`${API_BASE}/api/projects`, {
            headers: getHeaders(false)
        });
        return handleResponse(response, 'Failed to fetch projects');
    },

    getProjectById: async (projectId) => {
        const response = await fetch(`${API_BASE}/api/projects/${projectId}`, {
            headers: getHeaders(false)
        });
        return handleResponse(response, 'Project not found');
    },

    getProjectsByNGO: async (ngoId) => {
        const response = await fetch(`${API_BASE}/api/projects?ngo_id=${ngoId}`, {
            headers: getHeaders(false)
        });
        return handleResponse(response, 'Failed to fetch NGO projects');
    }
};

// ===== Water Stations API =====
export const stationsAPI = {
    getAllStations: async () => {
        const response = await fetch(`${API_BASE}/api/stations`, {
            headers: getHeaders(false)
        });
        return handleResponse(response, 'Failed to fetch stations');
    },

    getStationById: async (stationId) => {
        const response = await fetch(`${API_BASE}/api/stations/${stationId}`, {
            headers: getHeaders(true)
        });
        return handleResponse(response, 'Station not found');
    },

    getStationReadings: async (stationId) => {
        const response = await fetch(`${API_BASE}/api/stations/${stationId}/readings`, {
            headers: getHeaders(true)
        });
        return handleResponse(response, 'Failed to fetch readings');
    }
};

// ===== Reports API =====
export const reportsAPI = {
    createReport: async (reportData) => {
        const response = await fetch(`${API_BASE}/api/reports`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify(reportData)
        });
        return handleResponse(response, 'Failed to create report');
    },

    getAllReports: async () => {
        const response = await fetch(`${API_BASE}/api/reports`, {
            headers: getHeaders(false)
        });
        return response.ok ? await response.json() : [];
    },

    getMyReports: async () => {
        const response = await fetch(`${API_BASE}/api/reports/my`, {
            headers: getHeaders(true)
        });
        return response.ok ? await response.json() : [];
    },

    getReportsByStation: async (stationId) => {
        const response = await fetch(`${API_BASE}/api/stations/${stationId}/reports`, {
            headers: getHeaders(false)
        });
        return handleResponse(response, 'Failed to fetch station reports');
    }
};

// ===== Alerts API =====
export const alertsAPI = {
    getAllAlerts: async () => {
        const response = await fetch(`${API_BASE}/api/alerts`, {
            headers: getHeaders(false)
        });
        return response.ok ? await response.json() : [];
    },

    getAlertById: async (alertId) => {
        const response = await fetch(`${API_BASE}/api/alerts/${alertId}`, {
            headers: getHeaders(false)
        });
        return handleResponse(response, 'Alert not found');
    },

    createAlert: async (alertData) => {
        const response = await fetch(`${API_BASE}/api/alerts`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify(alertData)
        });
        return handleResponse(response, 'Failed to create alert');
    },

    getAlertsByStation: async (stationId) => {
        const response = await fetch(`${API_BASE}/api/alerts?station_id=${stationId}`, {
            headers: getHeaders(false)
        });
        return handleResponse(response, 'Failed to fetch station alerts');
    },

    getPredictiveAlerts: async (stationId) => {
        const response = await fetch(`${API_BASE}/api/alerts/predictive?station_id=${stationId}`, {
            headers: getHeaders(true)
        });
        return handleResponse(response, 'Failed to fetch predictive alerts');
    },

    getHistoricalData: async (period = '7d') => {
        const response = await fetch(`${API_BASE}/api/alerts/historical?period=${period}`, {
            headers: getHeaders(true)
        });
        return handleResponse(response, 'Failed to fetch historical data');
    }
};

// ===== Government Data API =====
export const govDataAPI = {
    getGovernmentData: async (country = 'USA', state = null) => {
        let url = `${API_BASE}/api/government-data?country=${country}`;
        if (state) url += `&state=${state}`;
        
        const response = await fetch(url, {
            headers: getHeaders(true)
        });
        
        return handleResponse(response, 'Failed to fetch government data');
    }
};

// ===== Water Quality API =====
export const waterQualityAPI = {
    getReadings: async (stationId = 1) => {
        const response = await fetch(`${API_BASE}/api/stations/${stationId}/readings`, {
            headers: getHeaders(false)
        });
        return response.ok ? await response.json() : [];
    }
};

// Export a default object with all APIs for easier imports
export default {
    authAPI,
    ngosAPI,
    projectsAPI,
    stationsAPI,
    reportsAPI,
    alertsAPI,
    govDataAPI,
    waterQualityAPI
};