import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../utils/fixLeafletIcons";

export default function DashboardMap({ stations }) {
  const validStations = (stations || []).filter(
    (s) => s.latitude !== null && s.longitude !== null
  );

  if (validStations.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No station locations available
      </div>
    );
  }

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={4}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {validStations.map((station) => (
        <Marker
          key={station.id}
          position={[station.latitude, station.longitude]}
          icon={L.divIcon({
            html: `<div style="
              background:${
                station.status === "Safe"
                  ? "#22c55e"
                  : station.status === "Warning"
                  ? "#facc15"
                  : "#ef4444"
              };
              width:12px;
              height:12px;
              border-radius:50%;
              border:2px solid white;
            "></div>`
          })}
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
