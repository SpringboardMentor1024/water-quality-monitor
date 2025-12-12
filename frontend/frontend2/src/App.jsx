import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Reports from './pages/Reports.jsx'
import Alerts from './pages/Alerts.jsx'
import Stations from './pages/Stations.jsx'
import Analytics from './pages/Analytics.jsx'
import MapView from './pages/MapView.jsx'

export default function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/stations" element={<Stations />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/map" element={<MapView />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
