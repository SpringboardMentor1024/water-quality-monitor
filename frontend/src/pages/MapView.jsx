import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../utils/fixLeafletIcons";
import { useNavigate } from "react-router-dom";

function FitBounds({ stations }) {
  const map = useMap();

  useEffect(() => {
    if (stations.length > 0) {
      const validStations = stations.filter(
        (s) => s.latitude && s.longitude
      );
      if (validStations.length > 0) {
        const bounds = validStations.map((s) => [s.latitude, s.longitude]);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [stations, map]);

  return null;
}

const getMarkerIcon = (status) =>
  L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background:${
          status === "Safe"
            ? "#22c55e"
            : status === "Warning"
            ? "#facc15"
            : "#ef4444"
        };
        width:16px;
        height:16px;
        border-radius:50%;
        border:2px solid white;
        box-shadow:0 0 5px rgba(0,0,0,0.3);
      "></div>
    `,
  });

export default function MapView() {
  const [stations, setStations] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch stations from backend
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/stations")
      .then((res) => res.json())
      .then((data) => {
        setStations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching stations:", err);
        setLoading(false);
      });
  }, []);

  // ✅ Filtering logic
  const filteredStations =
    filter === "All"
      ? stations
      : stations.filter((s) => s.status === filter);

  if (loading) {
    return <p className="text-center mt-10">Loading map...</p>;
  }

  return (
    <div className="flex h-[85vh] gap-4">
      {/* === FILTER PANEL === */}
      <div className="w-64 bg-white p-5 rounded-xl shadow border border-[#C4E1E6]">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Filters</h2>

        <label className="block font-medium mb-2 text-gray-700">
          Water Status
        </label>
        <select
          className="w-full p-2 border rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Safe">Safe</option>
          <option value="Warning">Warning</option>
          <option value="Unsafe">Unsafe</option>
        </select>

        {/* Legend */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2 text-gray-700">Legend</h3>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-green-500"></span> Safe
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Warning
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span> Unsafe
          </div>
        </div>
      </div>

      {/* === MAP AREA === */}
      <div className="flex-1 rounded-xl overflow-hidden border border-[#A4CCD9] shadow">
        <MapContainer
          center={[23.5937, 80.9629]} // India center
          zoom={5}
          minZoom={4}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />

          <FitBounds stations={filteredStations} />

          {filteredStations.map((station) => (
            <Marker
              key={station.id}
              position={[station.latitude, station.longitude]}
              icon={getMarkerIcon(station.status)}
            >
              <Popup>
                <div className="w-[200px]">
                  <h3 className="font-semibold text-[#2C7A7B] mb-1">
                    {station.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        station.status === "Safe"
                          ? "text-green-600"
                          : station.status === "Warning"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {station.status}
                    </span>
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 mb-2">
                    <p>pH: {station.ph}</p>
                    <p>Turbidity: {station.turbidity}</p>
                    <p>Temp: {station.temperature}°C</p>
                  </div>
                  <button
                    onClick={() => navigate(`/stations/${station.id}`)}
                    className="w-full bg-[#4FA3B5] hover:bg-[#3D91A3] text-white py-1 rounded text-xs transition"
                  >
                    View Station
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
