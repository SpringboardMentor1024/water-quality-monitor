import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// MapComponent accepts `stations` prop and displays their locations; supports optional clustering if 'react-leaflet-cluster' is available
const MapComponent = ({ stations = [] }) => {
  const [Cluster, setCluster] = useState(null);

  useEffect(() => {
    let mounted = true;
    // try to dynamically import clustering plugin; fall back silently if not installed
    const pkg = "react-leaflet-cluster";
    import(/* @vite-ignore */ pkg)
      .then((mod) => {
        if (mounted && mod && mod.default) setCluster(() => mod.default);
      })
      .catch(() => {
        // clustering not available - ignore
      });

    return () => {
      mounted = false;
    };
  }, []);

  // helper to create a pulsing div icon
  const createPulseIcon = () => {
    return L.divIcon({
      className: "pulse-icon",
      html: '<div class="pulse"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // If we have stations, compute bounds to fit them, otherwise use India center
  const hasStations = stations && stations.length > 0;
  const bounds = hasStations ? stations.map((s) => [s.latitude, s.longitude]) : null;
  const center = hasStations
    ? [
        stations.reduce((acc, s) => acc + s.latitude, 0) / stations.length,
        stations.reduce((acc, s) => acc + s.longitude, 0) / stations.length,
      ]
    : [20.5937, 78.9629]; // India center

  const markers = hasStations
    ? stations.map((st) => (
        <Marker key={st.id} position={[st.latitude, st.longitude]} icon={createPulseIcon()}>
          <Popup>
            <div className="text-sm">
              <strong>{st.name}</strong>
              <div className="text-xs text-gray-600">{st.location}</div>
              {st.latest_reading ? (
                <div className="mt-2">
                  <div>pH: <strong>{st.latest_reading.ph}</strong></div>
                  <div>Turbidity: <strong>{st.latest_reading.turbidity}</strong></div>
                  <div>Dissolved O₂: <strong>{st.latest_reading.dissolved_oxygen}</strong></div>
                  <div className="text-xs text-gray-500">{new Date(st.latest_reading.recorded_at).toLocaleString()}</div>
                </div>
              ) : (
                <div className="mt-2 text-gray-500">No recent reading</div>
              )}
            </div>
          </Popup>
        </Marker>
      ))
    : null;

  return (
    <MapContainer center={center} bounds={bounds} zoom={hasStations ? 6 : 5} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

      {Cluster ? <Cluster>{markers}</Cluster> : markers}
    </MapContainer>
  );
};

export default MapComponent;
