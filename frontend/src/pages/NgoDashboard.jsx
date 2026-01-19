import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MdWork, MdLocationOn, MdBarChart } from "react-icons/md";

// ---------------- FIX LEAFLET ICONS ----------------
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

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    // 1️⃣ FETCH PROJECTS (FROM COLLABORATIONS)
    fetch(`${BACKEND_URL}/api/collaborations`)
      .then((res) => res.json())
      .then((data) => {
        const uniqueProjects = {};
        data.forEach((item) => {
          uniqueProjects[item.project_id] = {
            id: item.project_id,
            name: item.project,
            description: "Water quality monitoring project",
            due_date: "2026-12-31",
          };
        });
        setProjects(Object.values(uniqueProjects));
      })
      .catch((err) => {
        console.error("Projects fetch error:", err);
        setProjects([]);
      });

    // 2️⃣ FETCH STATIONS (REAL COORDINATES)
    fetch(`${BACKEND_URL}/api/stations`)
      .then((res) => res.json())
      .then((data) => setStations(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Stations fetch error:", err);
        setStations([]);
      });
  }, []);

  // ---------------- MAP POPUP ----------------
  const StationPopup = ({ station }) => (
    <div>
      <h3 className="font-semibold">{station.name}</h3>
      <p className="text-sm text-gray-600">
        Status: {station.status}
      </p>
      <button
        onClick={() => navigate(`/stations/${station.id}`)}
        className="mt-2 w-full bg-[#4FA3B5] text-white px-3 py-1 rounded text-xs"
      >
        View Details
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-[#F4FBFD] min-h-screen space-y-8">
      {/* ---------------- HEADER ---------------- */}
      <header className="bg-white rounded-xl shadow border p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            NGO Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Projects, assigned stations, and monitoring overview
          </p>
        </div>
      </header>

      {/* ---------------- STATS ---------------- */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<MdWork size={26} />}
          title="Active Projects"
          value={projects.length}
          color="bg-[#D1EFF5]"
        />
        <StatCard
          icon={<MdLocationOn size={26} />}
          title="Stations Monitored"
          value={stations.length}
          color="bg-[#D2F4EB]"
        />
        <StatCard
          icon={<MdBarChart size={26} />}
          title="Reports Submitted"
          value="—"
          color="bg-[#FFF4D9]"
        />
      </section>

      {/* ---------------- PROJECTS ---------------- */}
      <section className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-lg font-semibold mb-4">Your Projects</h2>

        {projects.length === 0 ? (
          <p className="text-gray-500">No projects assigned</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <div
                key={p.id}
                className="border rounded-xl p-4 hover:shadow transition"
              >
                <h3 className="font-semibold text-[#4FA3B5]">
                  {p.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {p.description}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Due: {p.due_date}
                </p>
                <button
                  onClick={() => navigate(`/collaboration/project/${p.id}`)}
                  className="mt-3 w-full bg-[#4FA3B5] text-white px-3 py-1 rounded"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---------------- MAP ---------------- */}
      <section className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-lg font-semibold mb-4">
          Water Stations Map
        </h2>

        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={4}
          className="h-[450px] rounded-xl"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {stations.map((st) => (
            <Marker
              key={st.id}
              position={[st.latitude, st.longitude]}
            >
              <Popup>
                <StationPopup station={st} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </section>
    </div>
  );
}

// ---------------- STAT CARD ----------------
function StatCard({ icon, title, value, color }) {
  return (
    <div className="flex items-center gap-4 bg-white p-5 rounded-xl shadow border">
      <div className={`${color} p-3 rounded-full text-gray-700`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <h2 className="text-xl font-semibold text-gray-800">
          {value}
        </h2>
      </div>
    </div>
  );
}
