import React from "react";

export default function SearchStationsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#222831] text-white p-6 rounded-xl w-96">
        <h2 className="text-xl font-bold mb-4">Search Water Stations</h2>

        <input
          type="text"
          placeholder="Enter station name..."
          className="w-full p-2 rounded bg-gray-700 text-white mb-4 outline-none"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 rounded"
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
