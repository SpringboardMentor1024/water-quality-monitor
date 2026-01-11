import React, { useEffect, useState } from 'react';
import { authAPI, stationsAPI } from '../services/api';

const TestAuth = () => {
  const [testResults, setTestResults] = useState({
    stations: 'pending',
    auth: 'pending'
  });

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    // Test 1: Stations API
    try {
      const stations = await stationsAPI.getAllStations();
      setTestResults(prev => ({ ...prev, stations: `success (${stations.length} stations)` }));
    } catch (err) {
      setTestResults(prev => ({ ...prev, stations: 'failed' }));
    }

    // Test 2: Auth API
    try {
      await authAPI.login('test@example.com', 'testpass');
      setTestResults(prev => ({ ...prev, auth: 'success' }));
    } catch (err) {
      setTestResults(prev => ({ ...prev, auth: 'expected failure (no test user)' }));
    }
  };

  return (
    <div className="bg-green-50 border-2 border-green-500 rounded-lg p-5 m-5">
      <h3 className="text-green-800 font-bold mb-3">🧪 API Connection Status</h3>
      <div className="space-y-2 text-sm">
        <div>📊 Stations API: <span className="font-medium">{testResults.stations}</span></div>
        <div>🔑 Auth API: <span className="font-medium">{testResults.auth}</span></div>
      </div>
    </div>
  );
};

export default TestAuth;