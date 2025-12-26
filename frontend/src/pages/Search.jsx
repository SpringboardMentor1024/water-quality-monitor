import { useEffect, useState } from "react";
import { getStations } from "../services/api";

export default function Search() {
  const [query, setQuery] = useState("");
  const [allStations, setAllStations] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // LOAD STATIONS ON PAGE LOAD
  useEffect(() => {
    getStations()
      .then((res) => {
        setAllStations(res.data);
        setResults(res.data); // ✅ show all initially
        setLoading(false);
      })
      .catch((err) => {
        console.error("Stations fetch error:", err);
        setLoading(false);
      });
  }, []);

  // SEARCH HANDLER
  const handleSearch = () => {
    if (!query.trim()) {
      setResults(allStations); // ✅ empty search → show all
      return;
    }

    const q = query.toLowerCase();

    const filtered = allStations.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        String(s.id).includes(q)
    );

    setResults(filtered);
  };

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">
        Search Water Stations
      </h1>

      {/* SEARCH BAR */}
      <div className="bg-white p-6 rounded-xl shadow border grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Station Name / ID"
          className="border p-2 rounded-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-[#4FA3B5] text-white rounded-lg px-4 py-2 hover:bg-[#3D91A3]"
        >
          Search
        </button>
      </div>

      {/* RESULTS */}
      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        {loading ? (
          <p className="p-6 text-center">Loading stations...</p>
        ) : results.length === 0 ? (
          <p className="p-6 text-center text-gray-500">
            No matching stations found
          </p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Station ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((station) => (
                <tr
                  key={station.id}
                  className="border-t hover:bg-gray-50"
                >
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
