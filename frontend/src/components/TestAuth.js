import React, { useEffect } from 'react';
import { authAPI, waterQualityAPI } from '../services/api';

const TestAuth = () => {
  useEffect(() => {
    console.log('🧪 Starting API Connection Tests...');
    
    // Test 1: Water Quality API
    console.log('📊 Testing Water Quality API...');
    waterQualityAPI.getReadings()
      .then(data => {
        console.log('✅ Water Quality API SUCCESS:', data);
      })
      .catch(err => {
        console.error('❌ Water Quality API FAILED:', err.message || err);
      });
    
    // Test 2: User Registration
    console.log('📝 Testing User Registration...');
    authAPI.register({
      email: 'test@example.com',
      password: 'password123',
      full_name: 'Test User',
      role: 'operator'
    })
    .then(data => {
      console.log('✅ User Registration SUCCESS:', data);
      
      // Test 3: User Login (after successful registration)
      console.log('🔑 Testing User Login...');
      return authAPI.login('test@example.com', 'password123');
    })
    .then(loginData => {
      console.log('✅ User Login SUCCESS:', loginData);
    })
    .catch(err => {
      console.error('❌ API Test FAILED:', err.message || err);
      // If registration fails, it might be because user already exists
      // Try login instead
      console.log('🔄 Trying login instead...');
      authAPI.login('test@example.com', 'password123')
        .then(data => console.log('✅ Login successful:', data))
        .catch(loginErr => console.error('❌ Login also failed:', loginErr.message || loginErr));
    });

  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      background: '#e8f5e9', 
      margin: '20px',
      borderRadius: '10px',
      border: '2px solid #4caf50',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>🧪 API Connection Tests Running...</h3>
      <p style={{ margin: '0 0 5px 0', color: '#555' }}>Check the browser Console (F12) for results</p>
      <ul style={{ margin: '10px 0 0 0', paddingLeft: '20px', color: '#666', fontSize: '14px' }}>
        <li>📊 Water Quality API Test</li>
        <li>📝 User Registration Test</li>
        <li>🔑 User Login Test</li>
      </ul>
    </div>
  );
};

export default TestAuth;