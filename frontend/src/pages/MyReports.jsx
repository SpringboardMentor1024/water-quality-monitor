import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserReports();
  }, []);

  const fetchUserReports = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/user-reports/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReports(res.data || []);
    } catch (err) {
      console.error("Error fetching user reports:", err.response?.data || err);
      alert("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#F4FBFD] min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow border border-[#C4E1E6] w-full max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          My Submitted Reports
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading reports...</p>
        ) : reports.length === 0 ? (
          <p className="text-center text-gray-500">
            You haven’t submitted any reports yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-[#C4E1E6] text-sm">
              <thead className="bg-[#E3F5F9] text-gray-700">
                <tr>
                  <th className="p-3 text-left">Water Source</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t hover:bg-[#F4FBFD] transition"
                  >
                    <td className="p-3 font-medium text-gray-700">
                      {r.water_source || "—"}
                    </td>

                    <td className="p-3">
                      {r.location || "—"}
                    </td>

                    <td className="p-3">
                      {r.created_at
                        ? new Date(r.created_at).toLocaleDateString()
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
                      {r.remarks || "—"}
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
