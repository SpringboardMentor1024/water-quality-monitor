// FIXED API - Better error handling
const API_BASE = 'http://localhost:8000';

export const authAPI = {
    register: async (userData) => {
        console.log('🔄 Attempting registration with:', userData);
        
        try {
            const response = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            console.log('📡 Response status:', response.status);
            
            if (!response.ok) {
                let errorMessage = 'Registration failed';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.detail || errorData.message || errorMessage;
                } catch (parseError) {
                    errorMessage = `Server error: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            console.log('✅ Registration success:', data);
            return data;
        } catch (error) {
            console.error('❌ Registration error:', error);
            
            // Handle network errors specifically
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:8000');
            }
            
            // Handle CORS errors
            if (error.message.includes('CORS') || error.message.includes('Access-Control')) {
                throw new Error('Server connection blocked. Please check CORS configuration.');
            }
            
            throw error;
        }
    },
    
    login: async (email, password) => {
        console.log('🔄 Attempting login with:', email);
        
        try {
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            console.log('📡 Login response status:', response.status);
            
            if (!response.ok) {
                let errorMessage = 'Login failed';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.detail || errorData.message || errorMessage;
                } catch (parseError) {
                    errorMessage = `Server error: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            console.log('✅ Login success:', data);
            
            // Save token
            localStorage.setItem('authToken', data.access_token);
            
            return data;
        } catch (error) {
            console.error('❌ Login error:', error);
            
            // Handle network errors
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Cannot connect to server. Please ensure the backend is running.');
            }
            
            throw error;
        }
    },
    
    getCurrentUser: async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return null;
        
        try {
            const response = await fetch(`${API_BASE}/api/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (error) {
            console.error('Get user error:', error);
            return null;
        }
    },
    
    forgotPassword: async (email) => {
        try {
            const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            if (response.ok) {
                return await response.json();
            }
            
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to send reset email');
        } catch (error) {
            console.error('Forgot password error:', error);
            throw error;
        }
    },
    
    // ADD THIS LOGOUT FUNCTION
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        console.log('User logged out');
    }
};

export const alertsAPI = {
    getAllAlerts: async () => {
        try {
            const response = await fetch(`${API_BASE}/api/alerts`, {
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                return await response.json();
            }
            
            // If API fails, return empty array to show "No Active Alerts"
            console.warn('Alerts API failed, returning empty array');
            return [];
        } catch (error) {
            console.error('Get alerts error:', error);
            // Return empty array instead of throwing error
            return [];
        }
    },
    
    getAlertById: async (alertId) => {
        try {
            const response = await fetch(`${API_BASE}/api/alerts/${alertId}`, {
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to fetch alert details');
        } catch (error) {
            console.error('Get alert details error:', error);
            throw error;
        }
    },
    
    createAlert: async (alertData) => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${API_BASE}/api/alerts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(alertData)
            });
            
            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to create alert');
        } catch (error) {
            console.error('Create alert error:', error);
            throw error;
        }
    },
    
    getHistoricalData: async (period = '7d') => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${API_BASE}/api/alerts/historical?period=${period}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to fetch historical data');
        } catch (error) {
            console.error('Get historical data error:', error);
            throw error;
        }
    }
};

// Water Stations API
export const stationsAPI = {
    getAllStations: async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${API_BASE}/api/stations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) return await response.json();
            throw new Error('Failed to fetch stations');
        } catch (error) {
            console.error('Get stations error:', error);
            throw error;
        }
    },
    
    getStationById: async (stationId) => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${API_BASE}/api/stations/${stationId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) return await response.json();
            throw new Error('Failed to fetch station');
        } catch (error) {
            console.error('Get station error:', error);
            throw error;
        }
    },
    
    getStationReadings: async (stationId) => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${API_BASE}/api/stations/${stationId}/readings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) return await response.json();
            throw new Error('Failed to fetch readings');
        } catch (error) {
            console.error('Get readings error:', error);
            throw error;
        }
    }
};

// Reports API
export const reportsAPI = {
    createReport: async (reportData) => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${API_BASE}/api/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify(reportData)
            });
            
            if (response.ok) {
                return await response.json();
            }
            
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to create report');
        } catch (error) {
            console.error('Create report error:', error);
            throw error;
        }
    },
    
    getMyReports: async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${API_BASE}/api/reports/my`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                return await response.json();
            }
            // Return empty array if API fails
            return [];
        } catch (error) {
            console.error('Get reports error:', error);
            // Return empty array instead of throwing
            return [];
        }
    },
    
    getAllReports: async () => {
        try {
            const response = await fetch(`${API_BASE}/api/reports`, {
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                return await response.json();
            }
            // Return empty array if API fails
            return [];
        } catch (error) {
            console.error('Get all reports error:', error);
            // Return empty array instead of throwing
            return [];
        }
    }
};

// Government Data API
export const govDataAPI = {
    getGovernmentData: async (country = 'USA', state = null) => {
        const token = localStorage.getItem('authToken');
        try {
            let url = `${API_BASE}/api/government-data?country=${country}`;
            if (state) url += `&state=${state}`;
            
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) return await response.json();
            throw new Error('Failed to fetch government data');
        } catch (error) {
            console.error('Get government data error:', error);
            throw error;
        }
    }
};

