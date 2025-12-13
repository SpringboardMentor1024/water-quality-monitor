import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PasswordRecoveryPage from './pages/auth/PasswordRecovery';
import ProfilePage from './pages/auth/ProfilePage'; // ← ADD THIS IMPORT
import Dashboard from './pages/Dashboard';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';
import NewReportPage from './pages/NewReportPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-teal-100 to-teal-50">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
          <Route path="/profile" element={<ProfilePage />} /> {/* ← ADD THIS LINE */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/new-report" element={<NewReportPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;