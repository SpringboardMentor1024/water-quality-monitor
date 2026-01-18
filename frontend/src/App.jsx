import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout
import Layout from "./components/Layout";

// Standard Pages
import MonitorProfile from "./pages/MonitorProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StationReadings from "./pages/StationReadings";
import Alerts from "./pages/Alerts";
import Locations from "./pages/Locations";
import Settings from "./pages/Settings";
import Search from "./pages/Search";
import Analysis from "./pages/Analysis";
import Profile from "./pages/Profile";
import AllUsers from "./pages/AllUsers";
import AlertDetails from "./pages/AlertDetails";
import UserReports from "./pages/UserReports";
import Analytics from "./pages/Analytics";
import Collaborations from "./pages/Collaborations";
import PredictionDetails from "./pages/PredictionDetails";

// NEW: Milestone 4 NGO Page (Ensure you create this file)
import NGOStationDetails from "./pages/NGOStationDetails";

/* ================= PROTECTED ROUTE ================= */
/**
 * Guard component that checks for the 'authToken' in localStorage.
 * Redirects to login if the user is not authenticated.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<MonitorProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= PROTECTED (AUTH-REQUIRED) ROUTES ================= */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* 1. MONITORING & GENERAL DASHBOARD */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/search" element={<Search />} />

          {/* 2. SPECIALIZED NGO STATION DETAILS (Milestone 4 Addition) */}
          {/* This route serves the management-focused page with Report Mgmt and AI Forecasts */}
          <Route path="/ngo/station/:id" element={<NGOStationDetails />} />

          {/* 3. ANALYTICS & AI PREDICTIONS */}
          <Route path="/analysis/:stationId" element={<Analysis />} />
          <Route path="/analytics/:id?" element={<Analytics />} />
          <Route path="/prediction-details/:id/:parameter" element={<PredictionDetails />} />

          {/* 4. STANDARD STATION READINGS & ALERTS */}
          <Route path="/station/:id" element={<StationReadings />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/alerts/:id" element={<AlertDetails />} />

          {/* 5. COLLABORATIONS & USER INTERACTION */}
          <Route path="/collaborations" element={<Collaborations />} />
          <Route path="/userreports" element={<UserReports />} />

          {/* 6. USER ACCOUNT & SYSTEM CONFIG */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users" element={<AllUsers />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}