import { useState } from "react";

export default function Search() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [area, setArea] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);

    const params = new URLSearchParams({
      query,
      region,
      area,
    });

    fetch(`http://127.0.0.1:8000/api/stations/search?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Search error:", err);
        setLoading(false);
      });
  };

  return (
    <div className="space-y-6">

      {/* PAGE TITLE */}
      <h1 className="text-2xl font-semibold">Search Water Stations</h1>

      {/* SEARCH FILTERS */}
      <div className="bg-white p-6 rounded-xl shadow border border-[#C4E1E6] grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Station Name / ID"
          className="border p-2 rounded-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <input
          type="text"
          placeholder="Region"
          className="border p-2 rounded-lg"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />

        <input
          type="text"
          placeholder="Area"
          className="border p-2 rounded-lg"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-[#4FA3B5] text-white rounded-lg px-4 py-2 hover:bg-[#3D91A3]"
        >
          Search
        </button>
      </div>

      {/* RESULTS */}
      <div className="bg-white rounded-xl shadow border border-[#C4E1E6] overflow-x-auto">
        {loading ? (
          <p className="p-6 text-center">Searching...</p>
        ) : results.length === 0 ? (
          <p className="p-6 text-center text-gray-500">
            No results found
          </p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Station ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Region</th>
                <th className="p-3">Area</th>
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
                  <td className="p-3">{station.region}</td>
                  <td className="p-3">{station.area}</td>
                  <td className="p-3 font-medium">
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
