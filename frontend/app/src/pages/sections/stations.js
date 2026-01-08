import React, { useEffect, useState } from "react";
import { fetchStations } from "../../services/api";

const Stations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStations()
      .then((res) => {
        const mappedStations = res.data.map((s) => ({
          id: `STN-${s.id}`,
          name: s.name,
          region: s.location,
          area: s.location,
          status: s.contaminated ? "Contaminated" : "Safe",
          waterQuality: s.water_quality_index
            ? Math.round(s.water_quality_index)
            : "-",
          alerts: s.active_alerts ?? 0,
          lastUpdated: s.created_at
            ? new Date(s.created_at).toISOString().split("T")[0]
            : "-",
          type: "River",
        }));

        setStations(mappedStations);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch stations:", err);
        setError("Unable to load stations");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-4">Loading stations...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Water Stations</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Station ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Region</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Water Quality</th>
              <th className="px-4 py-2 border">Alerts</th>
              <th className="px-4 py-2 border">Last Updated</th>
            </tr>
          </thead>

          <tbody>
            {stations.map((station) => (
              <tr key={station.id} className="text-center">
                <td className="px-4 py-2 border">{station.id}</td>
                <td className="px-4 py-2 border">{station.name}</td>
                <td className="px-4 py-2 border">{station.region}</td>
                <td
                  className={`px-4 py-2 border font-medium ${
                    station.status === "Contaminated"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {station.status}
                </td>
                <td className="px-4 py-2 border">
                  {station.waterQuality}
                </td>
                <td className="px-4 py-2 border">{station.alerts}</td>
                <td className="px-4 py-2 border">
                  {station.lastUpdated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stations;
