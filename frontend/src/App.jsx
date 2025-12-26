import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Alerts from "./pages/Alerts";
import Stations from "./pages/Stations";
import Analytics from "./pages/Analytics";
import MapView from "./pages/MapView";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Settings from "./pages/Settings";


import MainLayout from "./layouts/MainLayout";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* LOGIN PAGE (NO SIDEBAR) */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* APP PAGES (WITH SIDEBAR) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/stations" element={<Stations />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

      </Routes>
    </Router>
  );
}
