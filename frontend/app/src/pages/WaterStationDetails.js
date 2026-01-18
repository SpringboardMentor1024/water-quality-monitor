import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ngoService from "../services/ngoService";

const WaterStationDetails = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [station, setStation] = useState(null);
  const [reports, setReports] = useState([]);
  const [parameters, setParameters] = useState([]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const stationRes = await ngoService.getWaterStationDetails(stationId);
        setStation(stationRes);

        const reportsRes = await ngoService.getWaterStationReports(stationId);
        setReports(reportsRes || []);

        const readingsRes = await ngoService.getStationReadings(stationId);
        setParameters(readingsRes || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load water station details");
        navigate("/ngo/dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [stationId, navigate]);

  /* ================= HELPERS ================= */

  // Latest reading per parameter
  const getLatestReadings = () => {
    const latest = {};
    parameters.forEach((r) => {
      if (
        !latest[r.parameter] ||
        new Date(r.recorded_at) > new Date(latest[r.parameter].recorded_at)
      ) {
        latest[r.parameter] = r;
      }
    });
    return Object.values(latest);
  };

  // Parameter status logic
  const getStatus = (parameter, value) => {
    switch (parameter) {
      case "pH":
        if (value < 6.5 || value > 8.5) return "critical";
        if (value < 6.8 || value > 8.2) return "warning";
        return "safe";

      case "turbidity":
        if (value > 10) return "critical";
        if (value > 5) return "warning";
        return "safe";

      case "DO":
        if (value < 4) return "critical";
        if (value < 6) return "warning";
        return "safe";

      case "lead":
      case "arsenic":
        if (value > 0.01) return "critical";
        if (value > 0.005) return "warning";
        return "safe";

      case "e.coli":
        if (value > 10) return "critical";
        if (value > 0) return "warning";
        return "safe";

      default:
        return "safe";
    }
  };

  const statusColor = {
    safe: "bg-green-100 text-green-900",
    warning: "bg-yellow-100 text-yellow-900",
    critical: "bg-red-100 text-red-900",
  };

  const handleReportAction = async (reportId, status) => {
    try {
      await ngoService.updateReportStatus(reportId, status);
      const refreshed = await ngoService.getWaterStationReports(stationId);
      setReports(refreshed);
    } catch {
      alert("Failed to update report status");
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return <div className="p-6 text-gray-700">Loading station...</div>;
  }

  if (!station) {
    return <div className="p-6 text-red-600">Station not found</div>;
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-gray-900">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl mb-8 shadow">
        <h1 className="text-2xl font-bold">{station.name}</h1>
        <p className="opacity-90">{station.location}</p>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-white text-blue-600 px-4 py-2 rounded"
        >
          ← Back
        </button>
      </div>

      {/* STATION DETAILS */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Station Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Managed By</p>
            <p className="font-medium text-gray-900">{station.managed_by}</p>
          </div>
          <div>
            <p className="text-gray-500">Latitude</p>
            <p className="font-medium">{station.latitude}</p>
          </div>
          <div>
            <p className="text-gray-500">Longitude</p>
            <p className="font-medium">{station.longitude}</p>
          </div>
        </div>
      </div>

      {/* PARAMETERS */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">
          Water Quality Parameters (Latest)
        </h2>

        {parameters.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No parameter readings available.
          </p>
        ) : (
          <table className="w-full text-sm border text-gray-900">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2 text-left">Parameter</th>
                <th className="p-2 text-left">Value</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Updated</th>
              </tr>
            </thead>
            <tbody>
              {getLatestReadings().map((p) => {
                const status = getStatus(p.parameter, p.value);
                return (
                  <tr key={p.parameter} className="border-t">
                    <td className="p-2 capitalize font-medium">
                      {p.parameter}
                    </td>
                    <td className="p-2">{p.value}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${statusColor[status]}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="p-2">
                      {new Date(p.recorded_at).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* REPORT MANAGEMENT */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Submitted Reports</h2>

          <button
            onClick={() =>
              navigate(`/ngo/water-stations/${stationId}/submit-report`)
            }
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            + Submit New Report
          </button>
        </div>

        {reports.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No reports submitted for this station.
          </p>
        ) : (
          <table className="w-full text-sm border text-gray-900">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Description</th>
                <th className="p-2">Status</th>
                <th className="p-2">Date</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">#{r.id}</td>
                  <td className="p-2">{r.description}</td>
                  <td className="p-2 capitalize">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        r.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : r.status === "verified"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-2">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-2 flex gap-2">
                    {r.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleReportAction(r.id, "verified")
                          }
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleReportAction(r.id, "rejected")
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WaterStationDetails;
