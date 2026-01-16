import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../utils/fixLeafletIcons";
import { getStations } from "../services/api";
import { useNavigate } from "react-router-dom"; // ✅ import this

/* ---------------------------------
   CUSTOM MARKER ICON
----------------------------------- */
const getMarkerIcon = (status) =>
  L.divIcon({
    className: "river-marker",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
    html: `
      <div style="
        width:14px;
        height:14px;
        border-radius:50%;
        background:${
          status === "Safe"
            ? "#22c55e"
            : status === "Warning"
            ? "#facc15"
            : "#ef4444"
        };
        border:2px solid white;
        box-shadow:0 0 6px rgba(0,0,0,0.4);
      "></div>
    `,
  });

/* ---------------------------------
   MAP VIEW PAGE
----------------------------------- */
export default function MapView() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ initialize useNavigate

  useEffect(() => {
    getStations()
      .then((res) => {
        console.log("MapView stations:", res.data);
        setStations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("MapView fetch error:", err);
        setLoading(false);
      });
  }, []);

  // ✅ ONLY STATIONS WITH VALID COORDINATES
  const mapStations = stations.filter(
    (s) => s.latitude !== null && s.longitude !== null
  );

  if (loading) {
    return <p className="text-center mt-10">Loading map...</p>;
  }

  return (
    <div className="h-[85vh] rounded-xl overflow-hidden border border-[#A4CCD9] shadow">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={4}
        minZoom={3}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mapStations.map((station) => (
          <Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
            icon={getMarkerIcon(station.status)}
          >
            <Popup>
              <div className="space-y-1 text-sm">
                <h3 className="font-semibold text-[#2C7A7B]">
                  {station.name}
                </h3>
                <p>
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
                <p>pH: {station.ph}</p>
                <p>Turbidity: {station.turbidity}</p>
                <p>Temperature: {station.temperature} °C</p>

                {/* ✅ VIEW BUTTON */}
                <button
                  onClick={() => navigate(`/stations/${station.id}`)}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
