import React, { useEffect, useMemo, useState } from "react";
import { getStations } from "../utils/api";

const PAGE_SIZE = 6;

export default function Search() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [area, setArea] = useState("");
  const [page, setPage] = useState(1);

  // Load stations from backend only
  useEffect(() => {
    const loadStations = async () => {
      try {
        const data = await getStations();
        setStations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load stations", err);
        setError("Failed to load stations from server");
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, []);

  // Extract regions & areas from location
  const { regions, areas } = useMemo(() => {
    const r = new Set();
    const a = new Set();

    stations.forEach((s) => {
      if (s.location) {
        const parts = s.location.split(",").map((p) => p.trim());
        if (parts.length > 1) {
          a.add(parts[0]);
          r.add(parts[parts.length - 1]);
        } else {
          r.add(parts[0]);
        }
      }
    });

    return {
      regions: Array.from(r).sort(),
      areas: Array.from(a).sort(),
    };
  }, [stations]);

  // Filtering logic
  const filtered = useMemo(() => {
    let list = [...stations];

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          (s.name || "").toLowerCase().includes(q) ||
          String(s.id) === q
      );
    }

    if (region) {
      list = list.filter((s) =>
        (s.location || "").toLowerCase().includes(region.toLowerCase())
      );
    }

    if (area) {
      list = list.filter((s) =>
        (s.location || "").toLowerCase().includes(area.toLowerCase())
      );
    }

    return list;
  }, [stations, query, region, area]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [query, region, area]);

  return (
    <div className="p-6 bg-gray-500 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 text-white">
        Search Water Stations
      </h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 bg-blue-50 p-4 rounded-lg shadow">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Station name or ID"
          className="p-2 border rounded"
        />

        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Filter by Region</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Filter by Area</option>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setQuery("");
              setRegion("");
              setArea("");
            }}
            className="px-3 py-2 bg-gray-200 rounded"
          >
            Reset
          </button>

          <button
            onClick={() => setPage(1)}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded shadow p-4">
        <div className="mb-3 text-sm text-gray-600">
          {filtered.length} results
        </div>

        {loading && <div>Loading stations...</div>}
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-gray-500">No stations found</div>
        )}

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {pageItems.map((s) => (
            <li
              key={s.id}
              className="border rounded p-3 bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">
                    {s.name}{" "}
                    <span className="text-xs text-gray-500">
                      #{s.id}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {s.location}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {s.latitude?.toFixed?.(2)},
                  {s.longitude?.toFixed?.(2)}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() =>
                setPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={page >= totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
