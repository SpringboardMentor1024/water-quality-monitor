import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import MyReports from "./pages/MyReports";
import Alerts from "./pages/AlertsPage";
import AlertTrendsPage from "./pages/AlertTrendsPage";
import Stations from "./pages/Stations";
import StationDetails from "./pages/StationDetails";
import Analytics from "./pages/Analytics";
import NgoDashboard from "./pages/NgoDashboard";
import AddProject from "./pages/AddProject";
import MapView from "./pages/MapView";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import Collaboration from "./pages/Collaboration";
import ProjectDetails from "./pages/ProjectDetails";
import PredictiveAlerts from "./pages/PredictiveAlerts";
import NewReport from "./pages/NewReport";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
        <Routes>
          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/my-reports" element={<MyReports />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/alert-trends" element={<AlertTrendsPage />} />
            <Route path="/stations" element={<Stations />} />
            <Route path="/stations/:id" element={<StationDetails />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ngo/dashboard" element={<NgoDashboard />} />
            <Route path="/add-project" element={<AddProject />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/reports/new" element={<NewReport />} />
            <Route path="/predictive-alerts" element={<PredictiveAlerts />} />
            <Route path="/collaboration" element={<Collaboration />} />
            <Route path="/collaboration/project/:id" element={<ProjectDetails />} />
          </Route>
        </Routes>
      
    </Router>
  );
}
