import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { getStations } from "../services/api";

export default function Search() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [allStations, setAllStations] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStations()
      .then((res) => {
        setAllStations(res.data);
        setResults(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Auto filter whenever query/status changes
  useEffect(() => {
    let filtered = allStations;

    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          String(s.id).includes(q)
      );
    }

    if (status !== "All") {
      filtered = filtered.filter((s) => s.status === status);
    }

    setResults(filtered);
  }, [query, status, allStations]);

  return (
    <div className="space-y-6 bg-[#F4FBFD] min-h-screen p-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Search Water Stations
      </h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow border grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Station Name / ID"
          className="border p-2 rounded-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="border p-2 rounded-lg"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Safe">Safe</option>
          <option value="Warning">Warning</option>
          <option value="Unsafe">Unsafe</option>
        </select>

        <button
          onClick={() => {
            setQuery("");
            setStatus("All");
          }}
          className="bg-gray-200 rounded-lg px-4 py-2 hover:bg-gray-300 transition"
        >
          Clear Filters
        </button>
      </div>

      {/* Result Info */}
      <p className="text-sm text-gray-600">
        Showing {results.length} of {allStations.length} stations
      </p>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        {loading ? (
          <p className="p-6 text-center">Loading stations...</p>
        ) : results.length === 0 ? (
          <p className="p-6 text-center text-gray-500">
            No stations match your filters
          </p>
        ) : (
          <table className="w-full text-left min-w-max">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((station) => (
                <tr key={station.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{station.id}</td>
                  <td className="p-3">{station.name}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        station.status === "Safe"
                          ? "bg-green-100 text-green-700"
                          : station.status === "Warning"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {station.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <Link
                      to={`/stations/${station.id}`}
                      className="inline-flex items-center justify-center w-8 h-8 bg-[#4FA3B5] text-white rounded-lg hover:bg-[#3D91A3]"
                    >
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
