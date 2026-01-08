import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout
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
import AlertDetails from "./pages/AlertDetails";
 import UserReports from "./pages/UserReports";
 import Analytics from "./pages/Analytics";
import Collaborations from "./pages/Collaborations";
import PredictionDetails from "./pages/PredictionDetails";
 
/* ================= PROTECTED ROUTE ================= */
/* 🔴 FIXED: token key now matches Layout + login logic */
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

        {/* ================= PROTECTED ROUTES ================= */}
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

          {/* Station Analysis */}
          <Route path="/analysis/:stationId" element={<Analysis />} />

          {/* Station Details */}
          <Route path="/station/:id" element={<StationReadings />} />

          {/* Alerts */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/alerts/:id" element={<AlertDetails />} />
 
          {/* User + Settings */}
           <Route path="/analytics/:id?" element={<Analytics />} />
          <Route path="/prediction-details/:id/:parameter" element={<PredictionDetails />} />
          <Route path="/collaborations" element={<Collaborations />} />
           <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users" element={<AllUsers />} />

          {/* ✅ USER REPORTS (WORKING NOW) */}
          <Route path="/userreports" element={<UserReports />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
