
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/layout/Navigation';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PasswordRecoveryPage from './pages/auth/PasswordRecovery';
import ProfilePage from './pages/auth/ProfilePage';
import Dashboard from './pages/Dashboard.jsx';
import AlertsPage from './pages/AlertsPage';
import NewReportPage from './pages/NewReportPage';
import StationDetailsPage from './pages/StationDetailsPage';
import StationsPage from './pages/StationsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CollaborationsPage from './pages/CollaborationsPage';
import UserReportsPage from './pages/UserReportsPage';
import ReportDetailsPage from './pages/ReportDetailsPage';
import SettingsPage from './pages/SettingsPage';
import EnhancedBaseMap from './components/maps/EnhancedBaseMap';

// Main Layout Component with Navigation Sidebar
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes (without Navigation) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Main Routes (with Navigation Sidebar) */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        } />

        <Route path="/map" element={
          <MainLayout>
            <div className="p-8">
              <EnhancedBaseMap />
            </div>
          </MainLayout>
        } />

        <Route path="/station/:stationId" element={
          <MainLayout>
            <StationDetailsPage />
          </MainLayout>
        } />

        <Route path="/stations" element={
          <MainLayout>
            <StationsPage />
          </MainLayout>
        } />

        <Route path="/analytics" element={
          <MainLayout>
            <AnalyticsPage />
          </MainLayout>
        } />

        <Route path="/collaborations" element={
          <MainLayout>
            <CollaborationsPage />
          </MainLayout>
        } />

        <Route path="/user-reports" element={
          <MainLayout>
            <UserReportsPage />
          </MainLayout>
        } />

        <Route path="/new-report" element={
          <MainLayout>
            <NewReportPage />
          </MainLayout>
        } />

        <Route path="/report/:reportId" element={
          <MainLayout>
            <ReportDetailsPage />
          </MainLayout>
        } />

        <Route path="/alerts" element={
          <MainLayout>
            <AlertsPage />
          </MainLayout>
        } />

        {/* Placeholder pages for now */}
        <Route path="/settings" element={
          <MainLayout>
            <SettingsPage />
          </MainLayout>
        } />

        <Route path="/support" element={
          <MainLayout>
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Support</h1>
              <p className="text-gray-600">Help and support center coming soon...</p>
            </div>
          </MainLayout>
        } />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;









