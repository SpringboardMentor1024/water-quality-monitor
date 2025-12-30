// frontend/app/src/pages/WqpDashboard.js
import React, { useEffect, useState } from "react";
import { fetchWqpResults, fetchNearbyStations } from "../services/api";

export default function WqpDashboard() {
  const [view, setView] = useState("results"); // 'results' or 'nearby'

  const [stateInput, setStateInput] = useState("CA");
  const [pageInput, setPageInput] = useState(1);
  const [pageSizeInput, setPageSizeInput] = useState(20);
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);

  const [latInput, setLatInput] = useState(36.7783);
  const [lonInput, setLonInput] = useState(-119.4179);
  const [radiusInput, setRadiusInput] = useState(10);
  const [limitInput, setLimitInput] = useState(10);
  const [nearby, setNearby] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(false);

  const loadResults = async () => {
    setLoadingResults(true);
    try {
      const data = await fetchWqpResults(stateInput, pageInput, pageSizeInput);
      setResults(data.records || []);
    } catch (err) {
      console.error("WQP Results fetch error:", err);
      setResults([]);
    } finally {
      setLoadingResults(false);
    }
  };

  const loadNearby = async () => {
    setLoadingNearby(true);
    try {
      const data = await fetchNearbyStations(latInput, lonInput, radiusInput, limitInput);
      setNearby(data || []);
    } catch (err) {
      console.error("Nearby stations fetch error:", err);
      setNearby([]);
    } finally {
      setLoadingNearby(false);
    }
  };

  // Optional: initial load
  useEffect(() => {
    if (view === "results") loadResults();
    else loadNearby();
  }, [view]);

  return (
    <div className="p-4">
      <h2 className="text-white text-2xl mb-4 text-center">WQP Dashboard</h2>

      {/* Toggle Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded ${view === "results" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
          onClick={() => setView("results")}
        >
          WQP Results
        </button>
        <button
          className={`px-3 py-1 rounded ${view === "nearby" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"}`}
          onClick={() => setView("nearby")}
        >
          Nearby Stations
        </button>
      </div>

      {/* Conditionally Render Sections */}
      {view === "results" && (
        <section className="mb-6">
          <h3 className="text-white font-semibold mb-2">Search WQP Results</h3>
          <div className="flex flex-wrap gap-2 items-center mb-2">
            <div>
              <label className="text-white mr-1">State:</label>
              <input
                type="text"
                value={stateInput}
                onChange={(e) => setStateInput(e.target.value.toUpperCase())}
                className="px-2 py-1 rounded text-black w-20"
              />
            </div>
            <div>
              <label className="text-white mr-1">Page:</label>
              <input
                type="number"
                min={1}
                value={pageInput}
                onChange={(e) => setPageInput(Number(e.target.value))}
                className="px-2 py-1 rounded text-black w-16"
              />
            </div>
            <div>
              <label className="text-white mr-1">Page Size:</label>
              <input
                type="number"
                min={1}
                max={100}
                value={pageSizeInput}
                onChange={(e) => setPageSizeInput(Number(e.target.value))}
                className="px-2 py-1 rounded text-black w-16"
              />
            </div>
            <button
              onClick={loadResults}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Search
            </button>
          </div>

          {loadingResults ? (
            <p className="text-gray-400">Loading results...</p>
          ) : results.length === 0 ? (
            <p className="text-gray-400">No results found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-white border border-gray-700">
                <thead>
                  <tr>
                    <th className="px-2 py-1 border border-gray-700">Location</th>
                    <th className="px-2 py-1 border border-gray-700">State</th>
                    <th className="px-2 py-1 border border-gray-700">Latitude</th>
                    <th className="px-2 py-1 border border-gray-700">Longitude</th>
                    <th className="px-2 py-1 border border-gray-700">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.MonitoringLocationIdentifier}>
                      <td className="px-2 py-1 border border-gray-700">{r.MonitoringLocationName}</td>
                      <td className="px-2 py-1 border border-gray-700">{r.StateAbbr}</td>
                      <td className="px-2 py-1 border border-gray-700">{r.LatitudeMeasure}</td>
                      <td className="px-2 py-1 border border-gray-700">{r.LongitudeMeasure}</td>
                      <td className="px-2 py-1 border border-gray-700">{r.MonitoringLocationTypeName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {view === "nearby" && (
        <section>
          <h3 className="text-white font-semibold mb-2">Nearby Stations</h3>
          <div className="flex flex-wrap gap-2 items-center mb-2">
            <div>
              <label className="text-white mr-1">Latitude:</label>
              <input
                type="number"
                value={latInput}
                onChange={(e) => setLatInput(Number(e.target.value))}
                className="px-2 py-1 rounded text-black w-24"
              />
            </div>
            <div>
              <label className="text-white mr-1">Longitude:</label>
              <input
                type="number"
                value={lonInput}
                onChange={(e) => setLonInput(Number(e.target.value))}
                className="px-2 py-1 rounded text-black w-24"
              />
            </div>
            <div>
              <label className="text-white mr-1">Radius (km):</label>
              <input
                type="number"
                value={radiusInput}
                onChange={(e) => setRadiusInput(Number(e.target.value))}
                className="px-2 py-1 rounded text-black w-20"
              />
            </div>
            <div>
              <label className="text-white mr-1">Limit:</label>
              <input
                type="number"
                value={limitInput}
                onChange={(e) => setLimitInput(Number(e.target.value))}
                className="px-2 py-1 rounded text-black w-16"
              />
            </div>
            <button
              onClick={loadNearby}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Search Nearby
            </button>
          </div>

          {loadingNearby ? (
            <p className="text-gray-400">Loading nearby stations...</p>
          ) : nearby.length === 0 ? (
            <p className="text-gray-400">No nearby stations found</p>
          ) : (
            <ul className="list-disc pl-5 text-white">
              {nearby.map((n) => (
                <li key={n.id}>
                  {n.name} ({n.type}) - {n.distance_km} km away
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
