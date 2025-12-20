import React, { useState } from "react";
import SearchStationsModal from "../../components/SearchStationsModal";

export default function Stations() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 text-white">

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Water Stations
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="px-6 py-2 bg-yellow-400 text-black rounded font-semibold"
        >
          Search Stations
        </button>
      </div>

      {/* Placeholder Content */}
      <div className="bg-[#222831] p-6 rounded-xl text-gray-400">
        Click <span className="text-white font-semibold">Search Stations</span> to open the search modal.
      </div>

      {/* Modal */}
      <SearchStationsModal
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
