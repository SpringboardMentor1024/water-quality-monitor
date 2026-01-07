import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../utils/fixLeafletIcons";
import { getStations } from "../services/api";

/* ---------------------------------
   CUSTOM MARKER ICON
----------------------------------- */
const getMarkerIcon = (status) =>
  L.divIcon({
    className: "",
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -12],
    html: `
      <div class="marker-circle ${
        status === "Safe"
          ? "marker-safe"
          : status === "Warning"
          ? "marker-warning"
          : "marker-unsafe"
      }"></div>
    `,
  });

/* ---------------------------------
   MAP VIEW PAGE
----------------------------------- */
export default function MapView() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

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
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}