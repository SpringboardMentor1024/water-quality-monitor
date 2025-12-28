import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import MyReports from "./pages/MyReports";
import Alerts from "./pages/Alerts";
import Stations from "./pages/Stations";
import Analytics from "./pages/Analytics";
import StationDetails from "./pages/StationDetails";
import MapView from "./pages/MapView";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Settings from "./pages/Settings";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  return (
    <Router>
      <Routes>

        {/* ROOT REDIRECT */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* PUBLIC AUTH PAGES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />


        {/* PROTECTED APP PAGES */}
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
          <Route path="/stations" element={<Stations />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/stations/:id" element={<StationDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
          

        </Route>


      </Routes>
    </Router>
  );
}
