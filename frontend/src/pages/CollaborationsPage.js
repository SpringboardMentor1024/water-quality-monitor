import React, { useState, useEffect } from "react"; 
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Droplets, Activity, Gauge, Thermometer, Plus, Trash2, Edit2, FileText, X } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts";
import "leaflet/dist/leaflet.css";

// ---------------- Auto Zoom Controller ----------------
const FlyToStation = ({ station }) => {
  const map = useMap();
  if (station) {
    map.flyTo([station.lat, station.lng], 13, { duration: 1.5 });
  }
  return null;
};

const CollaborationsPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedStation, setSelectedStation] = useState(null);
  const [modalProject, setModalProject] = useState(null);
  const [taskInput, setTaskInput] = useState("");
  
  // 🧩 2️⃣ Add Selected Project State
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // NEW: Station Details States
  const [stationDetails, setStationDetails] = useState(null);
  const [stationLoading, setStationLoading] = useState(false);
  const [stationReports, setStationReports] = useState([]);
  const [parameterData, setParameterData] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [predictiveData, setPredictiveData] = useState([]);
  const [activeChartTab, setActiveChartTab] = useState('parameters');
  const [showReportForm, setShowReportForm] = useState(false);
  const [newReport, setNewReport] = useState({ location: '', description: '', water_source: '', photo_url: '' });

  // ---------------- PROJECTS ----------------
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Community Water Quality Initiative - Riverbend",
      description: "Monitoring water quality in the Riverbend area, focusing on industrial runoff and agricultural impact.",
      status: "Active",
      due: "2026-01-31",
      tasks: ["Collect water samples", "Analyze pH levels", "Submit preliminary report"]
    },
    {
      id: 2,
      name: "Groundwater Contamination Study - Northridge",
      description: "Investigating lead and arsenic levels in local groundwater sources and informing residents.",
      status: "Pending",
      due: "2025-11-15",
      tasks: ["Map groundwater wells", "Test for heavy metals"]
    },
    {
      id: 3,
      name: "Coastal Erosion Impact Assessment - Seaville",
      description: "Assessing the impact of coastal erosion on marine ecosystems and water quality.",
      status: "Active",
      due: "2026-03-01",
      tasks: ["Drone survey of coastline", "Measure erosion rate"]
    },
    {
      id: 4,
      name: "Rainwater Harvesting Project - Upland",
      description: "Implementing rainwater harvesting systems for improved water supply and reduced runoff.",
      status: "Completed",
      due: "2025-06-30",
      tasks: ["Install rooftop tanks", "Train community members", "Finalize report"]
    }
  ]);

  // ---------------- PARTNER ACTIVITY LOG ----------------
  const activities = [
    { id: 1, text: "Assigned 'Water Quality Sampling' task for Riverbend project.", time: "2 hours ago" },
    { id: 2, text: "Submitted preliminary groundwater report for Northridge.", time: "5 hours ago" },
    { id: 3, text: "Updated Coastal Erosion project with new survey results.", time: "1 day ago" },
    { id: 4, text: "Commented on Rainwater Harvesting implementation plan.", time: "2 days ago" },
    { id: 5, text: "Added new sensors to Riverbend water stations.", time: "3 days ago" },
    { id: 6, text: "Approved collaboration with EcoWater Alliance.", time: "4 days ago" }
  ];

  // ---------------- STATIONS - Use real backend data ----------------
  const [stations, setStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(true);

  // Load real stations from backend
  useEffect(() => {
    const loadStations = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/stations');
        if (response.ok) {
          const data = await response.json();
          // Force the exact NGO station format you want
          const transformedStations = [
            {
              id: "NGO-MH-001",
              name: "Mumbai Coast",
              lat: 19.0760,
              lng: 72.8777,
              status: "Normal",
              reading: "Salinity 32 PSU"
            },
            {
              id: "NGO-MH-002",
              name: "Thane Creek",
              lat: 19.2050,
              lng: 72.9736,
              status: "Alert",
              reading: "Turbidity 9 NTU"
            },
            {
              id: "NGO-DL-003",
              name: "Yamuna River Delhi",
              lat: 28.6139,
              lng: 77.2090,
              status: "Alert",
              reading: "High Ammonia"
            },
            {
              id: "NGO-KA-004",
              name: "Bellandur Lake Bangalore",
              lat: 12.9716,
              lng: 77.5946,
              status: "Normal",
              reading: "DO 6.7 mg/L"
            },
            {
              id: "NGO-GJ-005",
              name: "Sabarmati River",
              lat: 23.0225,
              lng: 72.5714,
              status: "Normal",
              reading: "pH 7.2"
            }
          ];
          setStations(transformedStations);
        }
      } catch (error) {
        console.error('Failed to load stations:', error);
        // Fallback to exact format you want
        const fallbackStations = [
          {
            id: "NGO-MH-001",
            name: "Mumbai Coast",
            lat: 19.0760,
            lng: 72.8777,
            status: "Normal",
            reading: "Salinity 32 PSU"
          },
          {
            id: "NGO-MH-002",
            name: "Thane Creek",
            lat: 19.2050,
            lng: 72.9736,
            status: "Alert",
            reading: "Turbidity 9 NTU"
          },
          {
            id: "NGO-DL-003",
            name: "Yamuna River Delhi",
            lat: 28.6139,
            lng: 77.2090,
            status: "Alert",
            reading: "High Ammonia"
          },
          {
            id: "NGO-KA-004",
            name: "Bellandur Lake Bangalore",
            lat: 12.9716,
            lng: 77.5946,
            status: "Normal",
            reading: "DO 6.7 mg/L"
          },
          {
            id: "NGO-GJ-005",
            name: "Sabarmati River",
            lat: 23.0225,
            lng: 72.5714,
            status: "Normal",
            reading: "pH 7.2"
          }
        ];
        setStations(fallbackStations);
      } finally {
        setStationsLoading(false);
      }
    };
    
    loadStations();
  }, []);

  // 🧩 1️⃣ Add Project → Station Mapping (Data Layer)
  // ---------------- PROJECT → STATION MAPPING ----------------
  const projectStations = {
    1: ["NGO-MH-001", "NGO-MH-002"],      // Riverbend
    2: ["NGO-DL-003"],                  // Northridge
    3: ["NGO-KA-004"],                  // Seaville
    4: ["NGO-GJ-005"]                   // Upland
  };

  // 🧩 3️⃣ Compute Project-specific Stations (logic)
  const filteredStations = selectedProjectId
    ? stations.filter(s => projectStations[selectedProjectId]?.includes(s.id))
    : stations;

  // ---------------- REPORTS ----------------
  const [reports, setReports] = useState([
    { 
      id: 1, 
      title: "Thane Creek Turbidity Alert", 
      station: "NGO-MH-002",
      waterResource: "Thane Creek", 
      lat: 19.2050, 
      lng: 72.9736, 
      description: "High turbidity levels detected.", 
      subject: "Water Quality Alert",
      status: "Pending" 
    },
    { 
      id: 2, 
      title: "Yamuna Pollution Check", 
      station: "NGO-DL-003",
      waterResource: "Yamuna River", 
      lat: 28.6139, 
      lng: 77.2090, 
      description: "Ammonia levels above safe threshold.", 
      subject: "Pollution Check",
      status: "Approved" 
    },
    { 
      id: 3, 
      title: "Bellandur DO Levels", 
      station: "NGO-KA-004",
      waterResource: "Bellandur Lake", 
      lat: 12.9716, 
      lng: 77.5946, 
      description: "DO levels measured.", 
      subject: "Water Quality Measurement",
      status: "Approved" 
    },
    { 
      id: 4, 
      title: "Sabarmati pH Report", 
      station: "NGO-GJ-005",
      waterResource: "Sabarmati River", 
      lat: 23.0225, 
      lng: 72.5714, 
      description: "pH values recorded.", 
      subject: "Water Quality Monitoring",
      status: "Pending" 
    }
  ]);

  const [editingReport, setEditingReport] = useState(null);
  const [newReportData, setNewReportData] = useState({
    title: "",
    waterResource: "",
    lat: "",
    lng: "",
    description: "",
    subject: "",
    station: "",
    status: "Pending"
  });

  const updateReportStatus = (id, status) => {
    setReports(reports.map(r => (r.id === id ? { ...r, status } : r)));
  };

  const addReport = () => {
    if (!newReportData.title) return;
    setReports([...reports, { id: Date.now(), ...newReportData }]);
    setNewReportData({
      title: "",
      waterResource: "",
      lat: "",
      lng: "",
      description: "",
      subject: "",
      station: "",
      status: "Pending"
    });
  };

  const updateReport = () => {
    setReports(reports.map(r => r.id === editingReport.id ? editingReport : r));
    setEditingReport(null);
  };

  // NEW: Station Details Functions
  const fetchStationDetails = async (stationId) => {
    setStationLoading(true);
    try {
      // Always ensure we have station details - use fallback data first
      const mockData = {
        "NGO-MH-001": { id: stationId, name: "Mumbai Coast", ph: 7.8, temperature: 28.5, do: 6.2, turbidity: 4.1, lat: 19.0760, lng: 72.8777, location: "Mumbai, Maharashtra", managed_by: "Maharashtra Water Board" },
        "NGO-MH-002": { id: stationId, name: "Thane Creek", ph: 6.9, temperature: 29.1, do: 5.8, turbidity: 9.0, lat: 19.2050, lng: 72.9736, location: "Thane, Maharashtra", managed_by: "Maharashtra Water Board" },
        "NGO-DL-003": { id: stationId, name: "Yamuna River Delhi", ph: 7.1, temperature: 26.8, do: 4.9, turbidity: 12.5, lat: 28.6139, lng: 77.2090, location: "Delhi", managed_by: "Delhi Water Board" },
        "NGO-KA-004": { id: stationId, name: "Bellandur Lake Bangalore", ph: 7.3, temperature: 25.2, do: 6.7, turbidity: 3.2, lat: 12.9716, lng: 77.5946, location: "Bangalore, Karnataka", managed_by: "Karnataka Water Authority" },
        "NGO-GJ-005": { id: stationId, name: "Sabarmati River", ph: 7.2, temperature: 27.8, do: 6.1, turbidity: 4.5, lat: 23.0225, lng: 72.5714, location: "Ahmedabad, Gujarat", managed_by: "Gujarat Water Board" }
      };
      
      // Set fallback data immediately
      setStationDetails(mockData[stationId] || mockData["NGO-MH-001"]);
      
      // Try to get real data from backend to enhance the display
      try {
        const stationMapping = {
          "NGO-MH-001": 1,
          "NGO-MH-002": 2,
          "NGO-DL-003": 3,
          "NGO-KA-004": 4,
          "NGO-GJ-005": 5
        };
        
        const backendId = stationMapping[stationId] || 1;
        const response = await fetch(`http://localhost:8000/api/stations/${backendId}`);
        
        if (response.ok) {
          const data = await response.json();
          // Update with real data if available
          setStationDetails({
            id: stationId,
            name: data.name || mockData[stationId]?.name,
            ph: data.currentReading?.ph || mockData[stationId]?.ph || 7.0,
            temperature: data.currentReading?.temperature || mockData[stationId]?.temperature || 20.0,
            do: data.currentReading?.dissolved_oxygen || mockData[stationId]?.do || 8.0,
            turbidity: data.currentReading?.turbidity || mockData[stationId]?.turbidity || 2.0,
            lat: parseFloat(data.latitude) || mockData[stationId]?.lat,
            lng: parseFloat(data.longitude) || mockData[stationId]?.lng,
            location: data.location || mockData[stationId]?.location,
            managed_by: data.managed_by || mockData[stationId]?.managed_by
          });
        }
      } catch (backendError) {
        console.log('Backend not available, using fallback data:', backendError.message);
        // Fallback data is already set above
      }
      
      // Always set chart data (fallback first, then try to enhance with real data)
      setParameterData([
        { timestamp: 'Jan 10', ph: 7.2, temperature: 28, do: 6.5, turbidity: 4 },
        { timestamp: 'Jan 11', ph: 7.1, temperature: 28.5, do: 6.3, turbidity: 4.2 },
        { timestamp: 'Jan 12', ph: 7.0, temperature: 29, do: 6.1, turbidity: 4.5 },
        { timestamp: 'Jan 13', ph: 6.9, temperature: 29.2, do: 5.9, turbidity: 4.8 },
        { timestamp: 'Jan 14', ph: 6.8, temperature: 29.5, do: 5.7, turbidity: 5.1 }
      ]);
      
      setAlertsData([
        { type: 'pH', count: 2 },
        { type: 'Temperature', count: 1 },
        { type: 'DO', count: 3 },
        { type: 'Turbidity', count: 1 }
      ]);
      
      setPredictiveData([
        { date: 'Jan 15', prediction: 85 },
        { date: 'Jan 16', prediction: 78 },
        { date: 'Jan 17', prediction: 92 },
        { date: 'Jan 18', prediction: 67 },
        { date: 'Jan 19', prediction: 73 }
      ]);
      
      // Try to get enhanced data from backend
      try {
        const stationMapping = {
          "NGO-MH-001": 1,
          "NGO-MH-002": 2,
          "NGO-DL-003": 3,
          "NGO-KA-004": 4,
          "NGO-GJ-005": 5
        };
        const backendId = stationMapping[stationId] || 1;
        
        // Try to fetch real reports
        const reportsRes = await fetch(`http://localhost:8000/api/reports`);
        if (reportsRes.ok) {
          const allReports = await reportsRes.json();
          setStationReports(allReports.slice(0, 3) || []);
        }
        
        // Try to fetch real readings data
        const readingsRes = await fetch(`http://localhost:8000/api/stations/${backendId}/readings`);
        if (readingsRes.ok) {
          const readings = await readingsRes.json();
          
          if (readings && readings.length > 0) {
            // Transform real API data into chart format
            const groupedData = {};
            readings.forEach(reading => {
              const date = new Date(reading.recorded_at);
              const timestamp = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              
              if (!groupedData[timestamp]) {
                groupedData[timestamp] = { timestamp };
              }
              
              const paramName = reading.parameter.toLowerCase();
              const value = parseFloat(reading.value);
              
              if (paramName === 'ph') {
                groupedData[timestamp].ph = value;
              } else if (paramName === 'temperature') {
                groupedData[timestamp].temperature = value;
              } else if (paramName.includes('oxygen') || paramName === 'do') {
                groupedData[timestamp].do = value;
              } else if (paramName === 'turbidity') {
                groupedData[timestamp].turbidity = value;
              }
            });
            
            const transformedData = Object.values(groupedData);
            if (transformedData.length > 0) {
              setParameterData(transformedData);
            }
          }
        }
        
        // Try to fetch real alerts data
        const alertsRes = await fetch(`http://localhost:8000/api/alerts`);
        if (alertsRes.ok) {
          const alerts = await alertsRes.json();
          
          if (alerts && alerts.length > 0) {
            // Count alerts by type
            const alertCounts = { 'pH': 0, 'Temperature': 0, 'DO': 0, 'Turbidity': 0 };
            
            alerts.forEach(alert => {
              const type = alert.type || alert.message || '';
              const typeLower = type.toLowerCase();
              
              if (typeLower.includes('ph')) {
                alertCounts['pH']++;
              } else if (typeLower.includes('temperature') || typeLower.includes('temp')) {
                alertCounts['Temperature']++;
              } else if (typeLower.includes('oxygen') || typeLower.includes('do')) {
                alertCounts['DO']++;
              } else if (typeLower.includes('turbidity')) {
                alertCounts['Turbidity']++;
              }
            });
            
            const transformedAlerts = Object.entries(alertCounts).map(([type, count]) => ({ type, count }));
            setAlertsData(transformedAlerts);
          }
        }
        
      } catch (enhancementError) {
        console.log('Could not fetch enhanced data from backend:', enhancementError.message);
        // Fallback data is already set above
      }
      
    } catch (error) {
      console.error('Error fetching station details:', error);
      // Even if there's an error, we should have fallback data set above
    }
    setStationLoading(false);
  };



  // Handle Create Report
  const handleCreateReport = async () => {
    if (!newReport.title.trim()) {
      alert('Please enter a report title');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8000/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newReport.title,
          description: newReport.description,
          station_id: selectedStation,
          status: newReport.status
        })
      });
      
      if (response.ok) {
        const created = await response.json();
        setStationReports([...stationReports, created]);
        setNewReport({ title: '', description: '', status: 'pending' });
        setShowReportForm(false);
      }
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  // Handle Update Report
  const handleUpdateReport = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/reports/${editingReport.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingReport.title,
          description: editingReport.description,
          status: editingReport.status
        })
      });
      
      if (response.ok) {
        setStationReports(stationReports.map(r => r.id === editingReport.id ? editingReport : r));
        setEditingReport(null);
      }
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  // Handle Delete Report
  const handleDeleteReport = async (reportId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/reports/${reportId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setStationReports(stationReports.filter(r => r.id !== reportId));
      }
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  // ---------------- Add Task to Project ----------------
  const addTaskToProject = () => {
    if (!taskInput) return;
    setProjects(projects.map(proj => 
      proj.id === modalProject.id ? { ...proj, tasks: [...proj.tasks, taskInput] } : proj
    ));
    setTaskInput("");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">NGO Collaboration Dashboard</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {["dashboard", "stations", "station-details", "reports"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded ${activeTab===tab?"bg-blue-600 text-white":"bg-white"}`}>
            {tab === "station-details" ? "STATION DETAILS" : tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ---------------- DASHBOARD ---------------- */}
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          {/* Projects Grid */}
          <div>
            <h2 className="font-bold text-xl mb-4">Your Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {projects.map(p => (
                <div key={p.id} className="bg-white text-gray-900 p-5 rounded-lg shadow hover:shadow-lg transition duration-200">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">{p.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${p.status==="Active"?"bg-gray-300":p.status==="Completed"?"bg-green-300":"bg-gray-200"}`}>{p.status}</span>
                  </div>
                  <div className="flex mt-4 gap-2">
                    <button className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400" onClick={()=>setModalProject(p)}>View Details</button>
                    <button className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400" onClick={()=>setModalProject(p)}>Assign Task</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partner Activity Log */}
          <div>
            <h2 className="font-bold text-xl mb-4">Partner Activity Log</h2>
            <div className="bg-white p-5 rounded-lg shadow space-y-3">
              {activities.map(a => (
                <div key={a.id} className="flex items-start space-x-3 border-b border-gray-200 pb-2 last:border-b-0 hover:bg-gray-50 p-2 rounded">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">{a.text.charAt(0)}</div>
                  <div className="flex-1">
                    <p>{a.text}</p>
                    <span className="text-gray-500 text-xs">{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 🧩 4️⃣ Add Project Selector UI (Dashboard) */}
          {/* Project Filter */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Select Project</label>
            <select
              value={selectedProjectId || ""}
              onChange={(e) => setSelectedProjectId(Number(e.target.value) || null)}
              className="border p-2 rounded w-64"
            >
              <option value="">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Water Stations Table */}
          <div>
            <h2 className="font-bold mb-3">Water Stations</h2>
            <div className="bg-white rounded shadow">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Station ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Reading</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 🧩 5️⃣ Update Water Stations Table */}
                  {filteredStations.map(s => (
                    <tr key={s.id} className="border-t hover:bg-gray-50 hover:shadow-md cursor-pointer"
                      onClick={() => {
                        setSelectedStation(s.id); 
                        setActiveTab("station-details");
                        fetchStationDetails(s.id);
                      }}>
                      <td className="p-3 text-blue-600">{s.id}</td>
                      <td className="p-3">{s.name}</td>
                      <td className={`p-3 ${s.status==="Alert"?"text-red-600 font-bold animate-pulse":"text-green-600"}`}>{s.status}</td>
                      <td className="p-3">{s.reading}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Modal ---------------- */}
      {modalProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={()=>setModalProject(null)}>✕</button>
            <h2 className="text-xl font-bold mb-2">{modalProject.name}</h2>
            <p className="mb-2">{modalProject.description}</p>
            <p className="mb-4">Due Date: {modalProject.due}</p>
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Tasks:</h3>
              {modalProject.tasks.length === 0 ? (
                <p className="text-gray-500 text-sm">No tasks assigned yet.</p>
              ) : (
                <ul className="list-disc list-inside text-sm">
                  {modalProject.tasks.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              )}
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Assign Task:</label>
              <input type="text" value={taskInput} onChange={e=>setTaskInput(e.target.value)} className="border p-2 w-full rounded" placeholder="Enter task"/>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={addTaskToProject}>Assign</button>
          </div>
        </div>
      )}

      {/* ---------------- MAP ---------------- */}
      {activeTab === "stations" && (
        <div className="bg-white p-4 rounded shadow">
          <MapContainer center={[22.9734, 78.6569]} zoom={5} style={{ height: "500px" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {/* 🧩 6️⃣ Update Map to Show Project Stations */}
            {selectedStation && <FlyToStation station={filteredStations.find(s => s.id === selectedStation)} />}
            {/* 🧩 6️⃣ Update Map to Show Project Stations */}
            {filteredStations.map(st => (
              <Marker key={st.id} position={[st.lat, st.lng]}>
                <Popup autoOpen={st.id===selectedStation}>
                  <strong>{st.id}</strong><br />
                  {st.name}<br />
                  Status: {st.status}<br />
                  {st.reading}
                  {selectedStation===st.id && <div className="text-green-600 font-semibold mt-1">Selected Station</div>}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* ---------------- STATION DETAILS (NEW) ---------------- */}
      {activeTab === "station-details" && (
        <div className="bg-white p-6 rounded shadow">
          {/* Station Selector */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Select Water Station:</label>
            <select
              value={selectedStation || ""}
              onChange={(e) => {
                const stationId = e.target.value;
                if (stationId) {
                  setSelectedStation(stationId);
                  fetchStationDetails(stationId);
                }
              }}
              className="border p-2 rounded w-full md:w-96"
            >
              <option value="">-- Choose a Station --</option>
              {stations.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
              ))}
            </select>
          </div>

          {!selectedStation ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg mb-4">Please select a station from the dropdown above</p>
              <button 
                onClick={() => setActiveTab("dashboard")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Go to Dashboard
              </button>
            </div>
          ) : stationLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading station details...</p>
            </div>
          ) : stationDetails ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="border-b pb-4">
                <h2 className="text-2xl font-bold">{stationDetails.name || selectedStation}</h2>
                <p className="text-gray-600">Station ID: {selectedStation}</p>
              </div>

              {/* Parameter Cards */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Water Quality Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'pH Level', value: stationDetails.ph || 'N/A', icon: Droplets, unit: '' },
                    { name: 'Temperature', value: stationDetails.temperature || 'N/A', icon: Thermometer, unit: '°C' },
                    { name: 'Dissolved Oxygen', value: stationDetails.do || 'N/A', icon: Activity, unit: 'mg/L' },
                    { name: 'Turbidity', value: stationDetails.turbidity || 'N/A', icon: Gauge, unit: 'NTU' }
                  ].map((param, idx) => {
                    const Icon = param.icon;
                    return (
                      <div key={idx} className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm text-gray-700">{param.name}</h4>
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-2xl font-bold text-blue-900">{param.value}</p>
                        {param.unit && <p className="text-xs text-gray-600">{param.unit}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Report Management Section */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Report Management</h3>
                  <button 
                    onClick={() => setShowReportForm(!showReportForm)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> New Report
                  </button>
                </div>

                {/* Create Report Form */}
                {showReportForm && (
                  <div className="bg-gray-50 p-4 rounded mb-4 border">
                    <div className="space-y-3">
                      <input 
                        type="text"
                        placeholder="Report Title *"
                        value={newReport.title}
                        onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                        className="w-full border p-2 rounded"
                      />
                      <textarea 
                        placeholder="Description"
                        value={newReport.description}
                        onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                        className="w-full border p-2 rounded"
                        rows="3"
                      />
                      <select 
                        value={newReport.status}
                        onChange={(e) => setNewReport({...newReport, status: e.target.value})}
                        className="w-full border p-2 rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <div className="flex gap-2">
                        <button 
                          onClick={handleCreateReport}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Save Report
                        </button>
                        <button 
                          onClick={() => setShowReportForm(false)}
                          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reports List */}
                {stationReports.length > 0 ? (
                  <div className="space-y-2">
                    {stationReports.map(report => (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                        <div className="flex items-center gap-3 flex-1">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-semibold">{report.title}</p>
                            <p className="text-xs text-gray-600">{report.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : report.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {report.status}
                          </span>
                          <button 
                            onClick={() => setEditingReport(report)}
                            className="p-1 hover:bg-blue-100 rounded"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button 
                            onClick={() => handleDeleteReport(report.id)}
                            className="p-1 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No reports yet for this station</p>
                )}

                {/* Edit Report Form */}
                {editingReport && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
                      <button 
                        onClick={() => setEditingReport(null)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <h3 className="text-lg font-bold mb-4">Edit Report</h3>
                      <div className="space-y-3">
                        <input 
                          type="text"
                          value={editingReport.title}
                          onChange={(e) => setEditingReport({...editingReport, title: e.target.value})}
                          className="w-full border p-2 rounded"
                        />
                        <textarea 
                          value={editingReport.description}
                          onChange={(e) => setEditingReport({...editingReport, description: e.target.value})}
                          className="w-full border p-2 rounded"
                          rows="3"
                        />
                        <select 
                          value={editingReport.status}
                          onChange={(e) => setEditingReport({...editingReport, status: e.target.value})}
                          className="w-full border p-2 rounded"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <div className="flex gap-2">
                          <button 
                            onClick={handleUpdateReport}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex-1"
                          >
                            Update
                          </button>
                          <button 
                            onClick={() => setEditingReport(null)}
                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 flex-1"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Visualization Charts Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Visualization Charts & Trends</h3>
                
                {/* Chart Tabs */}
                <div className="flex gap-2 mb-4">
                  {['parameters', 'alerts', 'predictive'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveChartTab(tab)}
                      className={`px-4 py-2 rounded ${activeChartTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                      {tab === 'parameters' ? 'Parameter Trends' : tab === 'alerts' ? 'Alerts History' : 'Predictive Alerts'}
                    </button>
                  ))}
                </div>

                {/* Parameter Trends Chart */}
                {activeChartTab === 'parameters' && (
                  <div className="bg-gray-50 p-4 rounded">
                    {parameterData && parameterData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={parameterData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="timestamp" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="ph" stroke="#8884d8" name="pH" />
                          <Line type="monotone" dataKey="temperature" stroke="#82ca9d" name="Temperature" />
                          <Line type="monotone" dataKey="do" stroke="#ffc658" name="DO" />
                          <Line type="monotone" dataKey="turbidity" stroke="#ff7c7c" name="Turbidity" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No parameter data available</p>
                    )}
                  </div>
                )}

                {/* Alerts History Chart */}
                {activeChartTab === 'alerts' && (
                  <div className="bg-gray-50 p-4 rounded">
                    {alertsData && alertsData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={alertsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="type" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8884d8" name="Alert Count" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No alert data available</p>
                    )}
                  </div>
                )}

                {/* Predictive Alerts Chart */}
                {activeChartTab === 'predictive' && (
                  <div className="bg-gray-50 p-4 rounded">
                    {predictiveData && predictiveData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={predictiveData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="prediction" fill="#82ca9d" stroke="#82ca9d" name="Prediction" />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No predictive data available</p>
                    )}
                  </div>
                )}
              </div>

              {/* Load Station Button */}
              <div className="flex gap-2">
                <button 
                  onClick={() => fetchStationDetails(selectedStation)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Refresh Data
                </button>
                <button 
                  onClick={() => { setSelectedStation(null); setStationDetails(null); }}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Close Details
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Station details not found</p>
              <button 
                onClick={() => setActiveTab("dashboard")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      )}

      {/* ---------------- REPORTS ---------------- */}
      {activeTab === "reports" && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-4">Shared Reports</h2>

          {/* Report List */}
          {reports.map(r => (
            <div key={r.id} className="flex justify-between p-2 border-b items-center">
              <div>
                <span className="font-semibold">{r.title}</span> ({r.station})
                <p className="text-sm text-gray-500">{r.subject} - {r.waterResource}</p>
              </div>
              <div className="flex items-center gap-2">
                <select value={r.status} onChange={e=>updateReportStatus(r.id,e.target.value)} className="border px-2">
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
                <button className="text-blue-600 hover:underline text-sm" onClick={()=>setEditingReport({...r})}>View / Edit</button>
              </div>
            </div>
          ))}

          {/* Edit Modal */}
          {editingReport && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={()=>setEditingReport(null)}>✕</button>
                <h2 className="font-bold text-xl mb-2">Edit Report</h2>
                <div className="space-y-2">
                  <input className="border p-2 w-full rounded" placeholder="Title" value={editingReport.title} 
                    onChange={e=>setEditingReport({...editingReport, title:e.target.value})} />
                  <input className="border p-2 w-full rounded" placeholder="Water Resource" value={editingReport.waterResource} 
                    onChange={e=>setEditingReport({...editingReport, waterResource:e.target.value})} />
                  <input className="border p-2 w-full rounded" placeholder="Latitude" value={editingReport.lat} 
                    onChange={e=>setEditingReport({...editingReport, lat:e.target.value})} />
                  <input className="border p-2 w-full rounded" placeholder="Longitude" value={editingReport.lng} 
                    onChange={e=>setEditingReport({...editingReport, lng:e.target.value})} />
                  <input className="border p-2 w-full rounded" placeholder="Subject" value={editingReport.subject} 
                    onChange={e=>setEditingReport({...editingReport, subject:e.target.value})} />
                  <textarea className="border p-2 w-full rounded" placeholder="Description" value={editingReport.description} 
                    onChange={e=>setEditingReport({...editingReport, description:e.target.value})} />
                  <input className="border p-2 w-full rounded" placeholder="Station" value={editingReport.station} 
                    onChange={e=>setEditingReport({...editingReport, station:e.target.value})} />
                  <select className="border p-2 w-full rounded" value={editingReport.status} onChange={e=>setEditingReport({...editingReport, status:e.target.value})}>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full" onClick={updateReport}>Update</button>
                </div>
              </div>
            </div>
          )}

          {/* Add New Report */}
          <div className="mt-4 space-y-2">
            <input className="border p-2 w-full rounded" placeholder="Title" value={newReportData.title} onChange={e=>setNewReportData({...newReportData,title:e.target.value})} />
            <input className="border p-2 w-full rounded" placeholder="Water Resource" value={newReportData.waterResource} onChange={e=>setNewReportData({...newReportData,waterResource:e.target.value})} />
            <input className="border p-2 w-full rounded" placeholder="Latitude" value={newReportData.lat} onChange={e=>setNewReportData({...newReportData,lat:e.target.value})} />
            <input className="border p-2 w-full rounded" placeholder="Longitude" value={newReportData.lng} onChange={e=>setNewReportData({...newReportData,lng:e.target.value})} />
            <input className="border p-2 w-full rounded" placeholder="Subject" value={newReportData.subject} onChange={e=>setNewReportData({...newReportData,subject:e.target.value})} />
            <textarea className="border p-2 w-full rounded" placeholder="Description" value={newReportData.description} onChange={e=>setNewReportData({...newReportData,description:e.target.value})} />
            <input className="border p-2 w-full rounded" placeholder="Station" value={newReportData.station} onChange={e=>setNewReportData({...newReportData,station:e.target.value})} />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full" onClick={addReport}>Submit New Report</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CollaborationsPage;