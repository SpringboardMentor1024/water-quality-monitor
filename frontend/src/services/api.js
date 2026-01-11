// FIXED API - Better error handling
const API_BASE = 'http://localhost:8000';

export const authAPI = {
    register: async (userData) => {
        const response = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || errorData.message || 'Registration failed');
        }
        
        return await response.json();
    },
    
    login: async (email, password) => {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || errorData.message || 'Login failed');
        }
        
        const data = await response.json();
        localStorage.setItem('authToken', data.access_token);
        return data;
    },
    
    getCurrentUser: async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return null;
        
        const response = await fetch(`${API_BASE}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        return response.ok ? await response.json() : null;
    },
    
    forgotPassword: async (email) => {
        const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to send reset email');
        }
        
        return await response.json();
    },
    
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }
};

export const alertsAPI = {
    getAllAlerts: async () => {
        const response = await fetch(`${API_BASE}/api/alerts`, {
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        return response.ok ? await response.json() : [];
    },
    
    getAlertById: async (alertId) => {
        const response = await fetch(`${API_BASE}/api/alerts/${alertId}`, {
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Alert not found');
        }
        
        return await response.json();
    },
    
    createAlert: async (alertData) => {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE}/api/alerts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(alertData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to create alert');
        }
        
        return await response.json();
    },
    
    getHistoricalData: async (period = '7d') => {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE}/api/alerts/historical?period=${period}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch historical data');
        }
        
        return await response.json();
    }
};

// Water Stations API
export const stationsAPI = {
    getAllStations: async () => {
        const response = await fetch(`${API_BASE}/api/stations`, {
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch stations');
        }
        
        return await response.json();
    },
    
    getStationById: async (stationId) => {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE}/api/stations/${stationId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            throw new Error('Station not found');
        }
        
        return await response.json();
    },
    
    getStationReadings: async (stationId) => {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE}/api/stations/${stationId}/readings`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch readings');
        }
        
        return await response.json();
    }
};

// Reports API
export const reportsAPI = {
    createReport: async (reportData) => {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE}/api/reports`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(reportData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to create report');
        }
        
        return await response.json();
    },
    
    getMyReports: async () => {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE}/api/reports/my`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        return response.ok ? await response.json() : [];
    },
    
    getAllReports: async () => {
        const response = await fetch(`${API_BASE}/api/reports`, {
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        return response.ok ? await response.json() : [];
    }
};

// Government Data API
export const govDataAPI = {
    getGovernmentData: async (country = 'USA', state = null) => {
        const token = localStorage.getItem('authToken');
        let url = `${API_BASE}/api/government-data?country=${country}`;
        if (state) url += `&state=${state}`;
        
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch government data');
        }
        
        return await response.json();
    }
};

// Water Quality API (alias for stations readings)
export const waterQualityAPI = {
    getReadings: async () => {
        const response = await fetch(`${API_BASE}/api/stations/1/readings`);
        return response.ok ? await response.json() : [];
    }
};
