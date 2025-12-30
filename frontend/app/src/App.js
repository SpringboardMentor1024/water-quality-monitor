// frontend/app/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* ✅ NEW IMPORTS */
import Details from "./pages/sections/details";
import Reports from "./pages/sections/report";
import CpcbDashboard from "./pages/CpcbDashboard"; // CPCB
import WqpDashboard from "./pages/WqpDashboard";   // WQP
import WhoDashboard from "./pages/WhoDashboard"; // NEW


import "./App.css";

// Utility function to check token
const isAuthenticated = () => !!localStorage.getItem("token");

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* =====================
            PROTECTED ROUTES
        ===================== */}
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/profile"
          element={isAuthenticated() ? <Profile /> : <Navigate to="/login" replace />}
        />

        {/* =====================
            NEW ROUTES (SAFE)
        ===================== */}
        <Route
          path="/details/:stationId"
          element={isAuthenticated() ? <Details /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/reports"
          element={isAuthenticated() ? <Reports /> : <Navigate to="/login" replace />}
        />

        {/* =====================
            CPCB & WQP DASHBOARDS
        ===================== */}
        <Route
          path="/who"
          element={isAuthenticated() ? <WhoDashboard /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/cpcb"
          element={isAuthenticated() ? <CpcbDashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/wqp"
          element={isAuthenticated() ? <WqpDashboard /> : <Navigate to="/login" replace />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
