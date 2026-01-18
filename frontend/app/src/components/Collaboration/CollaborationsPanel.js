//src/components/Collaboration/CollaborationsPanel.js
import React from 'react';

const CollaborationsPanel = () => {
  const activeCollaborations = [
    {
      id: 1,
      partnerName: 'GreenFuture NGO',
      contactPerson: 'Maria Rodriguez',
      lastActivity: '7 days ago',
      activeStations: 2,
      status: 'active'
    },
    {
      id: 2,
      partnerName: 'AquaGuard Alliance',
      contactPerson: 'Tom Jenkins',
      lastActivity: '12 weeks ago',
      activeStations: 1,
      status: 'active'
    },
    {
      id: 3,
      partnerName: 'RiverKeepers',
      contactPerson: 'Sarah Chen',
      lastActivity: '3 days ago',
      activeStations: 3,
      status: 'pending'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Active Collaborations</h2>
        <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
          + New Collaboration
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Partner NGO
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Person
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Activity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stations
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activeCollaborations.map(collab => (
              <tr key={collab.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{collab.partnerName}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {collab.contactPerson}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {collab.lastActivity}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {collab.activeStations} active
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    collab.status === 'active' ? 'bg-green-100 text-green-800' :
                    collab.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {collab.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    Contact
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    Details
                  </button>
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