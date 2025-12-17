import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Alerts from "./pages/Alerts";
import Stations from "./pages/Stations";
import Analytics from "./pages/Analytics";
import MapView from "./pages/MapView";

import MainLayout from "./layouts/MainLayout";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/stations" element={<Stations />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/map" element={<MapView />} />
        </Route>

      </Routes>
    </Router>
  );
}
