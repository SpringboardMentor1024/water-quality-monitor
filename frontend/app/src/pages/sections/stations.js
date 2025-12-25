import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function Stations({ onViewStation }) {
  const [stations, setStations] = useState([
    {
      id: "STN-001",
      name: "Sample Station 001",
      region: "Sample Region",
      area: "Sample Area",
      status: "Safe",
    },
    {
      id: "STN-002",
      name: "Sample Station 002",
      region: "Sample Region",
      area: "Sample Area",
      status: "Safe",
    },
    {
      id: "STN-003",
      name: "Sample Station 003",
      region: "Another Region",
      area: "Urban Area",
      status: "Contaminated",
    },
  ]);

  const [editingStation, setEditingStation] = useState(null);

  /* =====================
     DELETE (frontend)
  ===================== */
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this station?")) {
      setStations(stations.filter((s) => s.id !== id));
    }
  };

  /* =====================
     SAVE EDIT (frontend)
  ===================== */
  const handleSaveEdit = () => {
    setStations((prev) =>
      prev.map((s) => (s.id === editingStation.id ? editingStation : s))
    );
    setEditingStation(null);
  };

  return (
    <div className="bg-[#222831] p-6 rounded-xl w-full text-white">
      <h2 className="text-xl font-bold mb-4">Search Water Stations</h2>

      {/* =====================
          FILTERS (UI ONLY)
      ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input className="bg-black p-2 rounded" placeholder="Region (State)" />
        <input className="bg-black p-2 rounded" placeholder="Area (City / District)" />
        <input className="bg-black p-2 rounded" placeholder="Station Name / ID" />
        <select className="bg-black p-2 rounded">
          <option>Status</option>
          <option>Safe</option>
          <option>Contaminated</option>
        </select>
      </div>

      {/* =====================
          RESULTS TABLE
      ===================== */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-gray-400 border-b border-gray-700">
            <tr>
              <th className="py-2 text-left">ID</th>
              <th>Name</th>
              <th>Region</th>
              <th>Area</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {stations.map((station) => (
              <tr
                key={station.id}
                className="border-b border-gray-700 hover:bg-gray-800"
              >
                <td className="py-2">{station.id}</td>
                <td>{station.name}</td>
                <td>{station.region}</td>
                <td>{station.area}</td>
                <td
                  className={
                    station.status === "Safe"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {station.status}
                </td>

                {/* =====================
                    ACTION ICONS
                ===================== */}
                <td className="flex gap-4 justify-center py-2">
                  {/* VIEW */}
                  <button
                    title="View Analytics"
                    onClick={() => onViewStation(station.id)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <FaEye />
                  </button>

                  {/* EDIT */}
                  <button
                    title="Edit Station"
                    onClick={() => setEditingStation(station)}
                    className="text-yellow-400 hover:text-yellow-300"
                  >
                    <FaEdit />
                  </button>

                  {/* DELETE */}
                  <button
                    title="Delete Station"
                    onClick={() => handleDelete(station.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =====================
          EDIT MODAL
      ===================== */}
      {editingStation && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#222831] p-6 rounded-xl w-96 space-y-4">
            <h3 className="text-lg font-semibold">Edit Station</h3>

            <input
              className="w-full bg-black p-2 rounded"
              value={editingStation.name}
              onChange={(e) =>
                setEditingStation({ ...editingStation, name: e.target.value })
              }
            />

            <input
              className="w-full bg-black p-2 rounded"
              value={editingStation.area}
              onChange={(e) =>
                setEditingStation({ ...editingStation, area: e.target.value })
              }
            />

            <select
              className="w-full bg-black p-2 rounded"
              value={editingStation.status}
              onChange={(e) =>
                setEditingStation({ ...editingStation, status: e.target.value })
              }
            >
              <option>Safe</option>
              <option>Contaminated</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-600 rounded"
                onClick={() => setEditingStation(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-yellow-500 text-black rounded"
                onClick={handleSaveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
