import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";


const SearchStationsModal = ({ onClose, onViewDetails }) => {
  const [stations] = useState([
    {
      id: 1,
      code: "STN-001",
      name: "Sample Station 001",
      region: "Sample Region",
      area: "Sample Area",
      status: "Safe",
    },
    {
      id: 2,
      code: "STN-002",
      name: "Sample Station 002",
      region: "Sample Region",
      area: "Sample Area",
      status: "Safe",
    },
    {
      id: 3,
      code: "STN-003",
      name: "Sample Station 003",
      region: "Another Region",
      area: "Urban Area",
      status: "Contaminated",
    },
  ]);

  const handleDelete = (station) => {
    if (window.confirm(`Delete ${station.name}?`)) {
      alert("Delete action (backend not connected)");
    }
  };

  const handleEdit = (station) => {
    alert(`Edit ${station.name} (sample only)`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#222831] w-[90%] max-w-5xl p-6 rounded-xl text-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Search Water Stations</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Filters (UI only) */}
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

        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-600">
              <tr className="text-left text-gray-400">
                <th className="py-2">ID</th>
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
                  <td className="py-2">{station.code}</td>
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

                  {/* ACTION ICONS */}
                  <td className="flex gap-4 justify-center py-2">
                    <button
                      title="View Details"
                      onClick={() => {
                        onViewDetails(station.id);
                        onClose();
                      }}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <FaEye />
                    </button>

                    <button
                      title="Edit Station"
                      onClick={() => handleEdit(station)}
                      className="text-yellow-400 hover:text-yellow-300"
                    >
                      <FaEdit />
                    </button>

                    <button
                      title="Delete Station"
                      onClick={() => handleDelete(station)}
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
      </div>
    </div>
  );
};

export default SearchStationsModal;
