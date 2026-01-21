import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8000";

const NgoReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState({});

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/reports`);
      setReports(res.data || []);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(`${BASE_URL}/reports/${id}`, {
        status,
        moderation_notes: notes[id] || "",
      });

      setReports((prev) =>
        prev.map((r) => (r.id === id ? res.data : r))
      );
    } catch (err) {
      alert("Failed to update report");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold text-green-700">
          NGO Report Moderation
        </h1>

        {loading ? (
          <p>Loading reports...</p>
        ) : (
          reports.map((r) => (
            <div
              key={r.id}
              className="bg-white p-4 rounded-xl shadow space-y-3"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">{r.title}</h2>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    r.status === "verified"
                      ? "bg-green-100 text-green-700"
                      : r.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                📍 {r.location} | 💧 {r.water_source || "-"}
              </p>

              <p className="text-sm">{r.description}</p>

              <textarea
                placeholder="Moderation notes (optional)"
                value={notes[r.id] || ""}
                onChange={(e) =>
                  setNotes({ ...notes, [r.id]: e.target.value })
                }
                className="w-full border rounded px-3 py-2 text-sm"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => updateStatus(r.id, "verified")}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => updateStatus(r.id, "rejected")}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NgoReports;
