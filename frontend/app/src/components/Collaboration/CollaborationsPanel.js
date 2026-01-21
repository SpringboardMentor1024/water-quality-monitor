import React, { useEffect, useState } from 'react';
import {
  fetchCollaborations,
  createCollaboration,
  fetchSharedReports
} from '../../services/collaborationService';

const CollaborationsPanel = () => {
  const [activeCollaborations, setActiveCollaborations] = useState([]);
  const [selectedCollab, setSelectedCollab] = useState(null);
  const [sharedReports, setSharedReports] = useState([]);

  const [formData, setFormData] = useState({
    project_id: '',
    partner_ngo_id: ''
  });

  const ngoId = localStorage.getItem("ngo_id");

  useEffect(() => {
    if (!ngoId) return;
    loadCollaborations();
    loadSharedReports();
  }, [ngoId]);

  // -------------------------------
  // LOAD COLLABORATIONS
  // -------------------------------
  const loadCollaborations = () => {
    fetchCollaborations(ngoId)
      .then(res => {
        const data = res.data.map(c => ({
          id: c.id,
          projectDescription: c.project_description || "Project",
          partnerName: c.partner_ngo_name || "NGO",
          activeStations: c.active_stations ?? 0,
          status: c.status || "active"
        }));
        setActiveCollaborations(data);
      })
      .catch(err => console.error(err));
  };

  // -------------------------------
  // LOAD SHARED REPORTS
  // -------------------------------
  const loadSharedReports = () => {
    fetchSharedReports(ngoId)
      .then(res => {
        console.log("SHARED REPORTS 👉", res.data);
        setSharedReports(res.data);
      })
      .catch(err => console.error("SHARED REPORT ERROR", err));
  };

  // -------------------------------
  // CREATE COLLABORATION
  // -------------------------------
  const handleCreateCollaboration = async (e) => {
    e.preventDefault();
    if (!formData.project_id || !formData.partner_ngo_id) {
      alert('Please fill all fields');
      return;
    }

    try {
      await createCollaboration({
        project_id: Number(formData.project_id),
        ngo_id: Number(ngoId),
        partner_ngo_id: Number(formData.partner_ngo_id)
      });
      setFormData({ project_id: '', partner_ngo_id: '' });
      loadCollaborations();
      alert("Collaboration created");
    } catch (err) {
      alert("Failed to create collaboration");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Active Collaborations</h2>

      {/* ===================== TABLE ===================== */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Partner NGO</th>
              <th className="px-4 py-2">Project</th>
              <th className="px-4 py-2">Stations</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {activeCollaborations.map(collab => (
              <tr key={collab.id} className="border-t">
                <td className="px-4 py-2">{collab.partnerName}</td>
                <td className="px-4 py-2">{collab.projectDescription}</td>
                <td className="px-4 py-2">{collab.activeStations}</td>
                <td className="px-4 py-2">{collab.status}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setSelectedCollab(collab)}
                    className="text-blue-600 hover:underline"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===================== DETAILS ===================== */}
      {selectedCollab && (
        <div className="mt-6 border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Collaboration Details</h3>

          <p><b>Partner NGO:</b> {selectedCollab.partnerName}</p>
          <p><b>Project:</b> {selectedCollab.projectDescription}</p>
          <p><b>Active Stations:</b> {selectedCollab.activeStations}</p>
          <p><b>Status:</b> {selectedCollab.status}</p>

          <hr className="my-3" />

          <h4 className="font-semibold mb-2">Shared Reports</h4>

          {sharedReports.length === 0 ? (
            <p className="text-sm text-gray-500">No shared reports available</p>
          ) : (
            <ul className="space-y-2">
              {sharedReports.map(report => (
                <li
                  key={report.id}
                  className="border p-2 rounded bg-white text-sm"
                >
                  <p><b>Description:</b> {report.description}</p>
                  <p><b>Location:</b> {report.location}</p>
                  <p><b>Status:</b> {report.status}</p>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={() => setSelectedCollab(null)}
            className="mt-4 text-sm text-red-600 hover:underline"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default CollaborationsPanel;

