import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ModerateReports() {
  const [reports, setReports] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchAllReports();
  }, []);

  const fetchAllReports = async () => {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/user-reports",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setReports(res.data || []);
  };

  const updateStatus = async (id, status) => {
    await axios.patch(
      `http://127.0.0.1:8000/api/user-reports/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetchAllReports();
  };

  return (
    <div className="p-6 bg-[#F4FBFD] min-h-screen">
      <h2 className="text-2xl font-bold mb-6">
        Verify Water Quality Reports
      </h2>

      {reports.length === 0 ? (
        <p>No reports available.</p>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div key={r.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between">
                <h3 className="font-semibold">{r.location}</h3>
                <span className="text-sm">{r.status}</span>
              </div>

              <p className="text-sm mt-2">
                Water Source: {r.water_source}
              </p>

              <p className="mt-2">{r.description}</p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => updateStatus(r.id, "verified")}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => updateStatus(r.id, "rejected")}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
