import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      setError("You must be logged in to view reports.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/user-reports",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReports(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Reports fetch failed:", err);

      if (err.response?.status === 403) {
        setError("You are not authorized to view all reports.");
      } else {
        setError("Failed to load reports.");
      }

      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-700 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading reports...</p>;
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-600 font-medium">
        {error}
      </p>
    );
  }

  return (
    <div className="p-6 bg-[#F4FBFD] min-h-screen">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">
        Water Quality Reports
      </h2>

      {reports.length === 0 ? (
        <p className="text-gray-600 text-center">
          No reports submitted yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-[#C4E1E6] rounded-xl shadow p-5"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-[#2C7A7B]">
                  {report.location}
                </h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full border ${statusBadge(
                    report.status
                  )}`}
                >
                  {report.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                <strong>Water Source:</strong> {report.water_source}
              </p>

              <p className="text-sm text-gray-700 mb-3">
                {report.description}
              </p>

              {report.photo_url && (
                <img
                  src={report.photo_url}
                  alt="Report"
                  className="rounded-lg w-full h-40 object-cover mb-3"
                />
              )}

              <p className="text-xs text-gray-500">
                Submitted on{" "}
                {new Date(report.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
