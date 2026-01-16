import React, { useState } from "react"; 
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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

  // ---------------- STATIONS ----------------
  const [stations] = useState([
    { id: "NGO-MH-001", name: "Mumbai Coast", lat: 19.0760, lng: 72.8777, status: "Normal", reading: "Salinity 32 PSU" },
    { id: "NGO-MH-002", name: "Thane Creek", lat: 19.2050, lng: 72.9736, status: "Alert", reading: "Turbidity 9 NTU" },
    { id: "NGO-DL-003", name: "Yamuna River Delhi", lat: 28.6139, lng: 77.2090, status: "Alert", reading: "High Ammonia" },
    { id: "NGO-KA-004", name: "Bellandur Lake Bangalore", lat: 12.9716, lng: 77.5946, status: "Normal", reading: "DO 6.7 mg/L" },
    { id: "NGO-GJ-005", name: "Sabarmati River", lat: 23.0225, lng: 72.5714, status: "Normal", reading: "pH 7.3" }
  ]);

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
        {["dashboard", "stations", "reports"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded ${activeTab===tab?"bg-blue-600 text-white":"bg-white"}`}>
            {tab.toUpperCase()}
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
                      onClick={() => {setSelectedStation(s.id); setActiveTab("stations");}}>
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
