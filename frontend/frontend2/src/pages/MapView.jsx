import GoogleMapReact from "google-map-react";
import { useState } from "react";

// Dummy station data
const stations = [
  { id: 1, name: "Riverbank Station", lat: 12.97, lng: 77.59, status: "Unsafe" },
  { id: 2, name: "City Tank", lat: 12.98, lng: 77.60, status: "Safe" },
  { id: 3, name: "Borewell Area", lat: 12.965, lng: 77.58, status: "Warning" },
];

// Marker component
function Marker({ status }) {
  const color =
    status === "Safe"
      ? "bg-green-500"
      : status === "Warning"
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div
      className={`w-4 h-4 rounded-full border-2 border-white shadow ${color}`}
    ></div>
  );
}

export default function MapView() {
  const defaultProps = {
    center: { lat: 12.9716, lng: 77.5946 },
    zoom: 12,
  };

  const [filter, setFilter] = useState("All");

  const filteredStations =
    filter === "All"
      ? stations
      : stations.filter((s) => s.status === filter);

  return (
    <div className="flex h-[85vh] gap-4">

      {/* FILTER PANEL */}
      <div className="w-64 bg-white p-5 rounded-xl shadow border border-[#C4E1E6] h-full">
        <h2 className="text-xl font-bold mb-4">Filters</h2>

        <p className="font-medium mb-2">Water Status</p>

        <select
          className="w-full p-2 border rounded-lg"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Safe">Safe</option>
          <option value="Warning">Warning</option>
          <option value="Unsafe">Unsafe</option>
        </select>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Legend</h3>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span> Safe
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Warning
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span> Unsafe
          </div>
        </div>
      </div>

      {/* MAP SECTION */}
      <div className="flex-1 rounded-xl overflow-hidden border border-[#A4CCD9] shadow">
        <GoogleMapReact
          bootstrapURLKeys={{ key: "YOUR_GOOGLE_MAPS_API_KEY" }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          {filteredStations.map((s) => (
            <Marker
              key={s.id}
              lat={s.lat}
              lng={s.lng}
              status={s.status}
            />
          ))}
        </GoogleMapReact>
      </div>

    </div>
  );
}
