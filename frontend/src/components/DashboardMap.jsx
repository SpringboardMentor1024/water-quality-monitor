import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../utils/fixLeafletIcons";

/* ---------------- FIT BOUNDS ---------------- */
function FitBounds({ stations }) {
  const map = useMap();

  useEffect(() => {
    if (stations.length > 0) {
      const bounds = stations.map((s) => [s.latitude, s.longitude]);
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [stations, map]);

  return null;
}

/* ---------------- CUSTOM MARKER ---------------- */
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
        width:12px;
        height:12px;
        border-radius:50%;
        border:2px solid white;
      "></div>
    `,
  });

/* ---------------- DASHBOARD MAP ---------------- */
export default function DashboardMap({ stations }) {
  return (
    <MapContainer
      center={[23.5937, 80.9629]} // India center
      zoom={5}
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      zoomControl={false}
      style={{ height: "220px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      <FitBounds stations={stations} />

      {stations.map((station) => (
        <Marker
          key={station.id}
          position={[station.latitude, station.longitude]}
          icon={getMarkerIcon(station.status)}
        >
          <Popup>
            <strong>{station.name}</strong>
            <br />
            Status: {station.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
