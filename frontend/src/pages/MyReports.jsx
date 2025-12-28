import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchUserReports();
  }, []);

  const fetchUserReports = async () => {
    try {
      // Replace with current logged-in user ID or email if available
      const res = await axios.get("http://127.0.0.1:8000/api/reports");
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching user reports:", err);
    }
  };

  return (
    <div className="p-8 bg-[#F4FBFD] min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow border border-[#C4E1E6] w-full max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          My Submitted Reports
        </h2>

        {reports.length === 0 ? (
          <p className="text-center text-gray-500">
            You haven’t submitted any reports yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-[#C4E1E6] text-sm">
              <thead className="bg-[#E3F5F9] text-gray-700">
                <tr>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Station</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-[#F4FBFD] transition">
                    <td className="p-3 font-medium text-gray-700">
                      {r.title || "Untitled"}
                    </td>
                    <td className="p-3">{r.station_name || "Unknown"}</td>
                    <td className="p-3">
                      {r.recorded_at
                        ? new Date(r.recorded_at).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td
                      className={`p-3 font-semibold ${
                        r.status === "Verified"
                          ? "text-green-600"
                          : r.status === "Rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {r.status || "Pending"}
                    </td>
                    <td className="p-3 text-gray-600">
                      {r.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
    </div>
  );
}
