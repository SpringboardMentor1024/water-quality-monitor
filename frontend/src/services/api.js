// SIMPLE FIX - Works with test_backend.py
const API_BASE = 'http://localhost:8000';

export const authAPI = {
    login: async (email, password) => {
        try {
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            if (!response.ok) {
                throw new Error('Login failed');
            }
            
            const data = await response.json();
            console.log('Login success:', data);
            
            // Save token
            localStorage.setItem('authToken', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            return data;
        } catch (error) {
            console.error('Login error:', error);
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
    
    // ADD THIS LOGOUT FUNCTION
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        console.log('User logged out');
    }
};

