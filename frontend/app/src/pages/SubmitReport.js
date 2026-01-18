import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ngoService from "../services/ngoService";

const SubmitReport = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();

  const [station, setStation] = useState(null);
  const [description, setDescription] = useState("");
  const [waterSource, setWaterSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadStation = async () => {
      try {
        const data = await ngoService.getWaterStationDetails(stationId);
        setStation(data);
      } catch (err) {
        alert("Failed to load station");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadStation();
  }, [stationId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !waterSource) {
      alert("Please fill all fields");
      return;
    }

    try {
      setSubmitting(true);

      await ngoService.submitWaterReport({
        stationId: Number(stationId),   // ensure number
        description,
        water_source: waterSource,
      });

      alert("Report submitted successfully");
      navigate(`/ngo/water-stations/${stationId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-gray-800">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl mb-8 shadow">
        <h1 className="text-2xl font-bold">Submit Water Quality Report</h1>
        <p className="opacity-90">
          {station.name} — {station.location}
        </p>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-white text-blue-600 px-4 py-2 rounded"
        >
          ← Back
        </button>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6 max-w-xl"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Water Source
          </label>
          <input
            type="text"
            value={waterSource}
            onChange={(e) => setWaterSource(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="River / Lake / Well"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Description / Issue Observed
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border rounded px-3 py-2"
            placeholder="Describe the issue..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

export default SubmitReport;
