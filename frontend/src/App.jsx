import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout & UI
import Layout from "./components/Layout";

// Pages
import MonitorProfile from "./pages/MonitorProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StationReadings from "./pages/StationReadings";
import Alerts from "./pages/Alerts";
import Locations from "./pages/Locations";
import Settings from "./pages/Settings";
import BaseMap from "./pages/BaseMap";
import Search from "./pages/Search";
import Analysis from "./pages/Analysis";
import Profile from "./pages/Profile";
import AllUsers from "./pages/AllUsers";

/**
 * PROTECTION GUARD: The gatekeeper for the Authority System.
 * Checks for a valid authToken in localStorage before allowing access.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC PAGES: Accessible to everyone */}
        <Route path="/" element={<MonitorProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED AUTHORITY DASHBOARD: Requires login token */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/map" element={<BaseMap />} />
          <Route path="/search" element={<Search />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/station/:id" element={<StationReadings />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users" element={<AllUsers />} />
        </Route>

        {/* CATCH-ALL REDIRECT */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
