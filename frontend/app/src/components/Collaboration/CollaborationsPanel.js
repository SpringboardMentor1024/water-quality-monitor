// src/components/Collaboration/CollaborationsPanel.js
import React, { useEffect, useState } from 'react';
import { fetchCollaborations, createCollaboration } from '../../services/collaborationService';

const CollaborationsPanel = () => {
  const [activeCollaborations, setActiveCollaborations] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    project_id: '',
    partner_ngo_id: ''
  });
  const ngoId = localStorage.getItem("ngo_id");

  useEffect(() => {
    if (!ngoId) return;
    loadCollaborations();
  }, [ngoId]);

  const loadCollaborations = () => {
    fetchCollaborations(ngoId)
      .then(res => {
        const data = res.data.map(c => ({
          id: c.id,
          partnerName: c.partner_ngo_name || `NGO ${c.partner_ngo_id}`,
          contactPerson: "N/A",
          lastActivity: "Recently updated",
          activeStations: c.active_stations || 0,
          status: c.status
        }));
        setActiveCollaborations(data);
      })
      .catch(err => console.error(err));
  };

  const handleCreateCollaboration = async (e) => {
    e.preventDefault();
    if (!formData.project_id || !formData.partner_ngo_id) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const collaborationData = {
        project_id: parseInt(formData.project_id),
        ngo_id: parseInt(ngoId),
        partner_ngo_id: parseInt(formData.partner_ngo_id)
      };

      await createCollaboration(collaborationData);
      setIsCreating(false);
      setFormData({ project_id: '', partner_ngo_id: '' });
      loadCollaborations(); // Refresh the list
      alert('Collaboration created successfully!');
    } catch (error) {
      console.error('Error creating collaboration:', error);
      alert('Failed to create collaboration. Please check the IDs.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Active Collaborations</h2>
        <button 
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          onClick={() => setIsCreating(true)}
        >
          + New Collaboration
        </button>
      </div>

      {/* Create Collaboration Modal/Form */}
      {isCreating && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">Create New Collaboration</h3>
          <form onSubmit={handleCreateCollaboration}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project ID *
                </label>
                <input
                  type="number"
                  name="project_id"
                  value={formData.project_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter project ID"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Partner NGO ID *
                </label>
                <input
                  type="number"
                  name="partner_ngo_id"
                  value={formData.partner_ngo_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter partner NGO ID"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setFormData({ project_id: '', partner_ngo_id: '' });
                }}
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Collaboration
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Partner NGO
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Contact Person
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Last Activity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Stations
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {activeCollaborations.map(collab => (
              <tr key={collab.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{collab.partnerName}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {collab.contactPerson}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {collab.lastActivity}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {collab.activeStations} active
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    collab.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {collab.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <button className="text-blue-600 mr-3 hover:underline">Contact</button>
                  <button className="text-green-600 hover:underline">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollaborationsPanel;