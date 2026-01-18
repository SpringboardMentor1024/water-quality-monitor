import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MdWork, MdLocationOn, MdBarChart } from "react-icons/md";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function NgoDashboard() {
  const BACKEND_URL = "http://127.0.0.1:8000";
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/ngo/projects`)
      .then((res) => res.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() =>
        setProjects([
          {
            id: 1,
            name: "Clean River Drive",
            description: "Monitoring Yamuna River quality",
            due_date: "2026-03-01",
          },
          {
            id: 2,
            name: "Coastal Cleanup",
            description: "Chennai coastal region water tracking",
            due_date: "2026-04-15",
          },
        ])
      );

    fetch(`${BACKEND_URL}/ngo/stations`)
      .then((res) => res.json())
      .then((data) => setStations(Array.isArray(data) ? data : []))
      .catch(() =>
        setStations([
          {
            id: 1,
            name: "Station Alpha",
            latitude: 13.0827,
            longitude: 80.2707,
            location: "Chennai River",
          },
          {
            id: 2,
            name: "Station Beta",
            latitude: 12.9716,
            longitude: 77.5946,
            location: "Bangalore Lake",
          },
        ])
      );
  }, []);

  // ----------------------------
  // React component for map popup
  // ----------------------------
  const StationPopup = ({ station }) => (
    <div>
      <h3 className="font-semibold">{station.name}</h3>
      <p className="text-sm text-gray-600">{station.location}</p>
      <button
        onClick={() => navigate(`/station/${station.id}`)}
        className="inline-block mt-2 w-full bg-[#4FA3B5] text-white px-3 py-1 rounded text-xs hover:bg-[#3D91A3]"
      >
        View Details
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-[#F4FBFD] min-h-screen grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8">
      {/* LEFT COLUMN */}
      <div className="space-y-8">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-xl shadow border p-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              NGO Collaboration Dashboard
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Overview of your projects, assigned stations, and regional activities
            </p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => navigate("/add-project")}
              className="bg-[#4FA3B5] hover:bg-[#3D91A3] text-white px-4 py-2 rounded-lg text-sm shadow"
            >
              + Add Project
            </button>
            <button
              onClick={() => navigate("/reports")}
              className="border border-[#4FA3B5] text-[#4FA3B5] px-4 py-2 rounded-lg text-sm hover:bg-[#D1EFF5]"
            >
              View Reports
            </button>
            <button
              onClick={() => navigate("/analytics")}
              className="border border-[#00B894] text-[#00B894] px-4 py-2 rounded-lg text-sm hover:bg-[#D2F4EB]"
            >
              View Analytics
            </button>
          </div>
        </header>

        {/* QUICK STATS */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 bg-white p-5 rounded-xl shadow border">
            <div className="bg-[#D1EFF5] p-3 rounded-full">
              <MdWork size={26} className="text-[#4FA3B5]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <h2 className="text-xl font-semibold text-gray-800">{projects.length}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-5 rounded-xl shadow border">
            <div className="bg-[#D2F4EB] p-3 rounded-full">
              <MdLocationOn size={26} className="text-[#00B894]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Stations Monitored</p>
              <h2 className="text-xl font-semibold text-gray-800">{stations.length}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-5 rounded-xl shadow border">
            <div className="bg-[#FFF4D9] p-3 rounded-full">
              <MdBarChart size={26} className="text-[#F6C23E]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Reports Submitted</p>
              <h2 className="text-xl font-semibold text-gray-800">12</h2>
            </div>
          </div>
        </section>

        {/* PROJECTS LIST */}
        <section className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Your Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl shadow-sm hover:shadow-md transition border bg-white"
              >
                <h3 className="font-semibold text-[#4FA3B5]">{p.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                <p className="text-xs text-gray-500 mt-2">Due: {p.due_date}</p>
                {/* Project View Details button */}
                <button
                  onClick={() => navigate(`/project/${p.id}`)}
                  className="mt-3 w-full text-sm bg-[#4FA3B5] hover:bg-[#3D91A3] text-white px-3 py-1 rounded"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* MAP SECTION */}
        <section className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Water Stations Map
          </h2>
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            className="h-[500px] rounded-xl"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {stations.map((st) => (
              <Marker
                key={st.id}
                position={[st.latitude, st.longitude]}
                icon={L.icon({
                  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                  iconSize: [28, 28],
                })}
              >
                {/* Map View Details button */}
                <Popup closeOnClick={false}>
                  <StationPopup station={st} />
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>
      </div>

      {/* RIGHT COLUMN – TEAM & RECENT ACTIVITY */}
      <aside className="space-y-6">
        {/* TEAM MEMBERS */}
        <div className="bg-white rounded-xl shadow p-6 border">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <MdWork className="text-[#4FA3B5]" /> Team Collaboration
          </h3>
          <ul className="space-y-3">
            {[{ name: "Aarav Mehta", role: "Regional Coordinator", color: "bg-[#D1EFF5]" },
              { name: "Priya Nair", role: "Data Analyst", color: "bg-[#D2F4EB]" },
              { name: "Ravi Kumar", role: "Field Officer", color: "bg-[#FFF4D9]" }].map((member, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${member.color} flex items-center justify-center text-gray-700 font-medium`}>
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white rounded-xl shadow p-6 border">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <MdBarChart className="text-[#00B894]" /> Recent Activity
          </h3>
          <ul className="space-y-4 text-sm text-gray-600">
            <li className="flex justify-between">
              <span>📄 Report uploaded by Priya</span>
              <span className="text-gray-400">2 h ago</span>
            </li>
            <li className="flex justify-between">
              <span>⚠️ Turbidity alert from Station Beta</span>
              <span className="text-gray-400">5 h ago</span>
            </li>
            <li className="flex justify-between">
              <span>💧 New data from Station Alpha</span>
              <span className="text-gray-400">1 day ago</span>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
