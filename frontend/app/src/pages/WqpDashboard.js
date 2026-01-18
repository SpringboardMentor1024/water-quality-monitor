// frontend/app/src/pages/WqpDashboard.js
import React, { useEffect, useState } from "react";
import { fetchWqpResults, fetchNearbyStations } from "../services/api";

export default function WqpDashboard() {
  const [view, setView] = useState("results");

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

  const stateList = [
    ["Alabama", "AL"], ["Alaska", "AK"], ["Arizona", "AZ"], ["Arkansas", "AR"],
    ["California", "CA"], ["Colorado", "CO"], ["Connecticut", "CT"], ["Delaware", "DE"],
    ["District of Columbia", "DC"], ["Florida", "FL"], ["Georgia", "GA"], ["Hawaii", "HI"],
    ["Idaho", "ID"], ["Illinois", "IL"], ["Indiana", "IN"], ["Iowa", "IA"], ["Kansas", "KS"],
    ["Kentucky", "KY"], ["Louisiana", "LA"], ["Maine", "ME"], ["Maryland", "MD"], ["Massachusetts", "MA"],
    ["Michigan", "MI"], ["Minnesota", "MN"], ["Mississippi", "MS"], ["Missouri", "MO"], ["Montana", "MT"],
    ["Nebraska", "NE"], ["Nevada", "NV"], ["New Hampshire", "NH"], ["New Jersey", "NJ"], ["New Mexico", "NM"],
    ["New York", "NY"], ["North Carolina", "NC"], ["North Dakota", "ND"], ["Ohio", "OH"], ["Oklahoma", "OK"],
    ["Oregon", "OR"], ["Pennsylvania", "PA"], ["Rhode Island", "RI"], ["South Carolina", "SC"],
    ["South Dakota", "SD"], ["Tennessee", "TN"], ["Texas", "TX"], ["Utah", "UT"], ["Vermont", "VT"],
    ["Virginia", "VA"], ["Washington", "WA"], ["West Virginia", "WV"], ["Wisconsin", "WI"], ["Wyoming", "WY"]
  ];

  const loadResults = async () => {
    setLoadingResults(true);
    try {
      const data = await fetchWqpResults(stateInput, pageInput, pageSizeInput);
      setResults(data.records || []);
    } catch {
      setResults([]);
    } finally {
      setLoadingResults(false);
    }
  };

  const loadNearby = async () => {
    setLoadingNearby(true);
    try {
      const data = await fetchNearbyStations(
        latInput,
        lonInput,
        radiusInput,
        limitInput
      );
      setNearby(data || []);
    } catch {
      setNearby([]);
    } finally {
      setLoadingNearby(false);
    }
  };

  useEffect(() => {
    view === "results" ? loadResults() : loadNearby();
  }, [view]);

  return (
    <div className="p-6 bg-[#1e242d] rounded-xl shadow-lg text-white h-full">

      {/* Page Title */}
      <h2 className="text-2xl font-semibold mb-6 text-center text-blue-400">
        US WQP Dashboard
      </h2>

      {/* View Switch */}
      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={() => setView("results")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            view === "results"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          US WQP Results
        </button>

        <button
          onClick={() => setView("nearby")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            view === "nearby"
              ? "bg-green-600 text-white shadow"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Nearby US WQP Stations
        </button>
      </div>

      {/* ================= RESULTS ================= */}
      {view === "results" && (
        <section className="bg-gray-800/60 p-5 rounded-lg mb-4 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-blue-300">
            Search US WQP Results
          </h3>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">

            {/* State Dropdown */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">State</label>
              <select
                value={stateInput}
                onChange={(e) => setStateInput(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {stateList.map(([name, code]) => (
                  <option key={code} value={code}>
                    {name} ({code})
                  </option>
                ))}
              </select>
            </div>

            {/* Page Input */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Page</label>
              <input
                type="number"
                value={pageInput}
                min={1}
                onChange={(e) => setPageInput(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Page Size Input */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Page Size</label>
              <input
                type="number"
                value={pageSizeInput}
                min={1}
                max={100}
                onChange={(e) => setPageSizeInput(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={loadResults}
                className="w-full px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition font-medium"
              >
                Search
              </button>
            </div>

          </div>

          {/* Results Table */}
          {loadingResults ? (
            <p className="text-gray-400">Loading results...</p>
          ) : results.length === 0 ? (
            <p className="text-gray-400">No results found</p>
          ) : (
            <div className="overflow-auto rounded-lg border border-gray-700">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-900 sticky top-0">
                  <tr>
                    {["Location", "State", "Latitude", "Longitude", "Type"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left border-b border-gray-700"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr
                      key={i}
                      className="odd:bg-gray-800 even:bg-gray-900 hover:bg-blue-900/30"
                    >
                      <td className="px-3 py-2">{r.MonitoringLocationName}</td>
                      <td className="px-3 py-2">{r.StateAbbr}</td>
                      <td className="px-3 py-2">{r.LatitudeMeasure}</td>
                      <td className="px-3 py-2">{r.LongitudeMeasure}</td>
                      <td className="px-3 py-2">{r.MonitoringLocationTypeName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ================= NEARBY ================= */}
      {view === "nearby" && (
        <section className="bg-gray-800/60 p-5 rounded-lg border border-gray-700">

          <h3 className="text-lg font-semibold mb-4 text-green-300">
            Nearby US WQP Stations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {[["Latitude", latInput, setLatInput],
              ["Longitude", lonInput, setLonInput],
              ["Radius (km)", radiusInput, setRadiusInput],
              ["Limit", limitInput, setLimitInput],
            ].map(([label, value, setter], i) => (
              <div key={i}>
                <label className="block text-xs text-gray-400 mb-1">{label}</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setter(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            ))}

            <div className="flex items-end col-span-4">
              <button
                onClick={loadNearby}
                className="w-full px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 transition font-medium"
              >
                Search Nearby
              </button>
            </div>
          </div>

          {loadingNearby ? (
            <p className="text-gray-400">Loading nearby stations...</p>
          ) : nearby.length === 0 ? (
            <p className="text-gray-400">No nearby stations found</p>
          ) : (
            <ul className="space-y-2">
              {nearby.map((n) => (
                <li key={n.id} className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                  <div className="font-medium">{n.name}</div>
                  <div className="text-xs text-gray-400">{n.type} • {n.distance_km} km away</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
