//src/components/Collaboration/SharedReports.js
import React from 'react';

const SharedReports = () => {
  const sharedReports = [
    {
      id: 1,
      title: 'Turbidity Spike Detected at Station RW-003',
      author: 'Alice Smith (GreenFuture)',
      date: '2024-07-20',
      status: 'approved'
    },
    {
      id: 2,
      title: 'pH Imbalance in Willow Creek Sample',
      author: 'Tom Jenkins (AquaGuard)',
      date: '2024-07-18',
      status: 'approved'
    },
    {
      id: 3,
      title: 'New Report: Microplastic Analysis - Lake Vista',
      author: 'Sarah Chen (RiverKeepers)',
      date: '2024-07-15',
      status: 'pending'
    },
    {
      id: 4,
      title: 'Lead Contamination Findings - Old Mill Well',
      author: 'Bob Johnson (GreenFuture)',
      date: '2024-07-10',
      status: 'approved'
    },
    {
      id: 5,
      title: 'Suspicious Discharge Sighting - Industrial Zone',
      author: 'Emily White (Global Water Solutions)',
      date: '2024-07-05',
      status: 'rejected'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Shared Reports</h2>
        <button className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {sharedReports.map(report => (
          <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{report.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{report.author} • {report.date}</p>
              </div>
              <span className={`ml-4 px-2 py-1 text-xs rounded-full ${
                report.status === 'approved' ? 'bg-green-100 text-green-800' :
                report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {report.status}
              </span>
            </div>
            
            <div className="mt-3 flex justify-end space-x-2">
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View Report
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-800">
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SharedReports;