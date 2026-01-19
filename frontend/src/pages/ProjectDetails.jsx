import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function ProjectDetails() {
  const { id } = useParams();
  const BACKEND_URL = "http://127.0.0.1:8000";

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/collaborations/projects/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch project");
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p className="p-6 text-gray-600">Loading project...</p>;
  }

  if (!project) {
    return <p className="p-6 text-red-600">Project not found</p>;
  }

  return (
    <div className="p-6 space-y-6 bg-[#F4FBFD] min-h-screen">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h1 className="text-2xl font-semibold text-gray-800">
          {project.name}
        </h1>
        <p className="text-gray-600 mt-2">{project.description}</p>
        <p className="text-sm text-gray-500 mt-1">
          Due Date: {project.due_date}
        </p>
      </div>

      {/* STATIONS LIST */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Assigned Water Stations
        </h2>

        {project.stations.length === 0 ? (
          <p className="text-gray-500">No stations assigned</p>
        ) : (
          <ul className="list-disc list-inside text-gray-700">
            {project.stations.map((s) => (
              <li key={s.id}>
                {s.name} ({s.lat}, {s.lon})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* MAP */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Stations Map
        </h2>

        <MapContainer
          center={
            project.stations.length
              ? [project.stations[0].lat, project.stations[0].lon]
              : [20.5937, 78.9629]
          }
          zoom={6}
          className="h-[450px] rounded-xl"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {project.stations.map((s) => (
            <Marker key={s.id} position={[s.lat, s.lon]}>
              <Popup>
                <b>{s.name}</b>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
