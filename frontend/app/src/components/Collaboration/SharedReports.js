import React, { useEffect, useState } from 'react';
import { fetchSharedReports } from '../../services/collaborationService';

const SharedReports = () => {
  const [sharedReports, setSharedReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const ngoId = localStorage.getItem("ngo_id");

  useEffect(() => {
    if (!ngoId) return;

    fetchSharedReports(ngoId)
      .then(res => {
        setSharedReports(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching shared reports", err);
        setLoading(false);
      });
  }, [ngoId]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Shared Reports</h2>

      {loading && (
        <p className="text-gray-500 text-sm">Loading shared reports...</p>
      )}

      {!loading && sharedReports.length === 0 && (
        <p className="text-sm text-gray-500">
          No shared reports available
        </p>
      )}

      <div className="space-y-4">
        {sharedReports.map(report => (
          <div
            key={report.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <h3 className="font-medium text-gray-900">
              {report.description}
            </h3>

            {/* ✅ STATION / RIVER NAME (ADDED) */}
            <p className="text-sm text-gray-700 mt-1">
              Station: {report.station_name}
            </p>

            <p className="text-sm text-gray-600 mt-1">
              {report.location}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              {report.created_at
                ? new Date(report.created_at).toLocaleDateString()
                : ''}
            </p>

            <span
              className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                report.status === 'verified'
                  ? 'bg-green-100 text-green-800'
                  : report.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {report.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SharedReports;
