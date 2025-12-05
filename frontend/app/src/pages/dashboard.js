import React, { useState, useEffect } from "react";
import { FaBars, FaPlus } from "react-icons/fa";
import MapView from "./sections/mapview";
import Reports from "./sections/report";
import Alerts from "./sections/alerts";
import Details from "./sections/details";
import Analytics from "./sections/analytics";
import Stations from "./sections/stations"; // optional
import axios from "axios";

// Dynamic Stats Panel with live updates
const StatsPanel = ({ stats, onFilter }) => {
return ( <div className="w-64 bg-gray-800 text-white p-4 rounded-lg flex flex-col gap-4">
<div
className="bg-gray-700 p-3 rounded cursor-pointer"
onClick={() => onFilter("alerts")}
>
Active Alerts: {stats.activeAlerts} </div>
<div
className="bg-gray-700 p-3 rounded cursor-pointer"
onClick={() => onFilter("reports")}
>
Open Reports: {stats.openReports} </div>
<div
className="bg-gray-700 p-3 rounded cursor-pointer"
onClick={() => onFilter("contaminated")}
>
Contaminated Sites: {stats.contaminatedSites} </div>
<div
className="bg-gray-700 p-3 rounded cursor-pointer"
onClick={() => onFilter("quality")}
>
Water Quality Index: {stats.waterQualityIndex.toFixed(1)} </div> </div>
);
};

// Sidebar Component
const Sidebar = ({ isOpen, toggle, setActiveSection }) => (

  <div className={`bg-gray-900 text-white p-4 h-screen fixed md:static z-50 flex flex-col justify-between transition-all duration-300 ${
      isOpen ? "left-0" : "-left-full"
    }`}
  >
    <div>
      <h2 className="text-xl font-bold mb-6">WaterWatch</h2>
      <ul className="flex flex-col gap-4">
        {["Map", "Reports", "Alerts", "Details", "Analytics", "Stations"].map((item) => (
          <li
            key={item}
            className="hover:bg-gray-700 p-2 rounded cursor-pointer"
            onClick={() => setActiveSection(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>


<div className="flex flex-col gap-2 relative">
  <button className="bg-yellow-500 text-black p-2 rounded w-full">Logout</button>
  <button className="md:hidden absolute top-0 right-0" onClick={toggle}>Close</button>
</div>


  </div>
);

// Dashboard Component
const Dashboard = () => {
const [sidebarOpen, setSidebarOpen] = useState(false);
const [activeSection, setActiveSection] = useState("Map");
const [filter, setFilter] = useState(null);
const [stations, setStations] = useState([]);
const [stats, setStats] = useState({
activeAlerts: 0,
openReports: 0,
contaminatedSites: 0,
waterQualityIndex: 0
});

const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

const handleFilter = (type) => setFilter(type);

// Fetch water stations and calculate stats
useEffect(() => {
axios.get("[http://localhost:8000/waterstations](http://localhost:8000/waterstations)") // your endpoint
.then(res => {
setStations(res.data);


    // Compute stats dynamically
    const activeAlerts = res.data.filter(s => s.active_alerts > 0).length;
    const openReports = res.data.filter(s => s.open_reports > 0).length;
    const contaminatedSites = res.data.filter(s => s.contaminated).length;
    const avgQuality = res.data.reduce((acc, s) => acc + s.water_quality_index, 0) / res.data.length || 0;

    setStats({
      activeAlerts,
      openReports,
      contaminatedSites,
      waterQualityIndex: avgQuality
    });
  })
  .catch(err => console.error(err));


}, []);

const renderSection = () => {
switch (activeSection) {
case "Map": return <MapView stations={stations} filter={filter} />;
case "Reports": return <Reports />;
case "Alerts": return <Alerts />;
case "Analytics": return <Analytics />;
case "Details": return <Details />;
case "Stations": return <Stations />;
default: return <MapView stations={stations} filter={filter} />;
}
};

return ( <div className="flex h-screen bg-gray-900 text-white"> <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} setActiveSection={setActiveSection} />


  <button className="md:hidden absolute top-4 left-4 z-50 text-white" onClick={toggleSidebar}>
    <FaBars size={24} />
  </button>

  <div className="flex-1 flex flex-col p-4 md:ml-64">
    <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>

    <div className="flex flex-1 flex-col md:flex-row gap-4">
      <div className="flex-1 h-[70vh] md:h-auto">{renderSection()}</div>
      <div className="hidden md:flex">
        <StatsPanel stats={stats} onFilter={handleFilter} />
      </div>
    </div>

    <button className="mt-4 bg-yellow-500 text-black p-2 rounded w-44">Submit Quick Report</button>
    <button className="md:hidden fixed bottom-4 right-4 bg-yellow-500 text-black p-4 rounded-full shadow-lg">
      <FaPlus />
    </button>
  </div>
</div>


);
};

export default Dashboard;
