import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ================= LAYOUT ================= */
import Layout from "./components/Layout";

/* ================= PAGES ================= */
import MonitorProfile from "./pages/MonitorProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Locations from "./pages/Locations";
import Search from "./pages/Search";
import Analysis from "./pages/Analysis";
import StationReadings from "./pages/StationReadings";
import Alerts from "./pages/Alerts";
import AlertDetails from "./pages/AlertDetails";
import Analytics from "./pages/Analytics";
import PredictionDetails from "./pages/PredictionDetails";
import Collaborations from "./pages/Collaborations";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import AllUsers from "./pages/AllUsers";
import UserReports from "./pages/UserReports";

/* ================= NGO PAGES ================= */
import NgoDashboard from "./pages/NgoDashboard";
import NGOStationDetails from "./pages/NGOStationDetails";

/* ================= PROTECTED ROUTE ================= */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<MonitorProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTES */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Main */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/search" element={<Search />} />

          {/* Stations */}
          <Route path="/station/:id" element={<StationReadings />} />
          <Route path="/analysis/:stationId" element={<Analysis />} />

          {/* Alerts */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/alerts/:id" element={<AlertDetails />} />

          {/* NGO (FIXED ✅) */}
          <Route path="/ngo" element={<NgoDashboard />} />
          <Route path="/ngos" element={<NgoDashboard />} />
          <Route path="/ngo/station/:id" element={<NGOStationDetails />} />

          {/* Analytics & Predictions */}
          <Route path="/analytics/:id?" element={<Analytics />} />
          <Route
            path="/prediction-details/:id/:parameter"
            element={<PredictionDetails />}
          />

          {/* Admin / User */}
          <Route path="/collaborations" element={<Collaborations />} />
          <Route path="/users" element={<AllUsers />} />
          <Route path="/userreports" element={<UserReports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
