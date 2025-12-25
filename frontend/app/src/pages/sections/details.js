import React, { useState } from "react";

export default function Details({ stationId, goToReports }) {
  const [showTrends, setShowTrends] = useState(false);

  if (!stationId) {
    return (
      <div className="bg-[#222831] p-6 rounded-xl text-gray-400">
        Select a station from the map to view details.
      </div>
    );
  }

  return (
    <div className="p-6 text-white space-y-6">

      <div className="bg-[#222831] p-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-3">Station Details</h1>

        <p><strong>Station ID:</strong> {stationId}</p>
        <p><strong>Name:</strong> Krishna Barrage Upstream Station</p>
        <p><strong>Location:</strong> Prakasam Barrage</p>
        <p><strong>Status:</strong> Active</p>
        <p><strong>Managed By:</strong> Irrigation Department</p> 
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setShowTrends(!showTrends)}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          {showTrends ? "Hide Trends" : "View Water Quality Trends"}
        </button>

        <button
          onClick={goToReports}
          className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
        >
          View / Verify Reports
        </button>
      </div>

      {showTrends && (
        <div className="bg-[#222831] p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">
            Water Quality Trends
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["pH", "Temperature", "Dissolved Oxygen", "Turbidity", "Arsenic", "E. Coli"].map(param => (
              <div
                key={param}
                className="border border-dashed border-gray-500 p-4 rounded-lg text-center text-gray-400"
              >
                {param} Trend Chart<br />
                <span className="text-xs">(Hourly / Daily / Monthly)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
