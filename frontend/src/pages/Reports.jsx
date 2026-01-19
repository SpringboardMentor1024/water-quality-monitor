import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const token = localStorage.getItem("access");
  const role = localStorage.getItem("role"); // user | ngo | admin

  useEffect(() => {
    if (role === "user") {
      fetchMyReports();
    } else {
      fetchAllReports();
    }
  }, []);

  // ---------------- FETCH ----------------

  const fetchMyReports = async () => {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/user-reports/my",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setReports(res.data || []);
  };

  const fetchAllReports = async () => {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/user-reports",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setReports(res.data || []);
  };

  // ---------------- STATUS ----------------

  const statusLabel = (status) => {
    if (status === "verified") return "Approved";
    if (status === "rejected") return "Rejected";
    return "Pending Review";
  };

  // ---------------- ACTIONS (NGO / ADMIN) ----------------

  const updateStatus = async (id, status) => {
    await axios.patch(
      `http://127.0.0.1:8000/api/user-reports/${id}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchAllReports();
  };

  // ---------------- UI ----------------

  return (
    <div className="p-6 bg-[#F4FBFD] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">
          {role === "user" ? "My Reports" : "Verify User Reports"}
        </h2>

        {role === "user" && (
          <Link
            to="/reports/new"
            className="bg-[#4FA3B5] text-white px-4 py-2 rounded-lg"
          >
            + Submit New Report
          </Link>
        )}
      </div>

      {reports.length === 0 ? (
        <p className="text-gray-600">No reports available.</p>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div
              key={r.id}
              className="bg-white border rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{r.location}</h3>
                <span className="text-sm text-gray-600">
                  {statusLabel(r.status)}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-2">
                Water Source: {r.water_source}
              </p>

              <p className="mt-2">{r.description}</p>

              <p className="text-xs text-gray-500 mt-2">
                Submitted on{" "}
                {new Date(r.created_at).toLocaleDateString()}
              </p>

              {/* NGO / ADMIN ACTIONS */}
              {(role === "ngo" || role === "admin") &&
                r.status === "pending" && (
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
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
