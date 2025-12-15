import React from 'react';
import Navigation from '../components/layout/Navigation';

const ReportsPage = () => {
  const allReports = [
    { id: 1, title: 'Weekly Water Quality Report', date: '2024-01-15', type: 'Automated', status: 'completed', description: 'Comprehensive weekly analysis of all monitoring stations' },
    { id: 2, title: 'Contamination Alert - Hudson River', date: '2024-01-14', type: 'User Report', status: 'investigating', description: 'User reported unusual water color and odor' },
    { id: 3, title: 'Monthly Compliance Report', date: '2024-01-01', type: 'Automated', status: 'completed', description: 'Monthly regulatory compliance assessment' },
    { id: 4, title: 'Emergency Response - Central Park', date: '2024-01-10', type: 'User Report', status: 'resolved', description: 'Fish kill incident reported and investigated' },
    { id: 5, title: 'Quarterly Environmental Assessment', date: '2024-01-01', type: 'Automated', status: 'completed', description: 'Comprehensive environmental impact analysis' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      investigating: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800',
      resolved: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || colors.pending;
  };

  const getTypeIcon = (type) => {
    return type === 'User Report' ? '👤' : '🤖';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Reports</h1>
            <p className="text-gray-600">View and manage water quality reports</p>
          </div>
          <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">
            Generate New Report
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="space-y-4">
              {allReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3 flex-1">
                      <span className="text-2xl">{getTypeIcon(report.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{report.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{report.date}</span>
                          <span>•</span>
                          <span>{report.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => alert(`Viewing report: ${report.title}`)}
                        className="bg-teal-600 text-white px-3 py-1 rounded text-sm hover:bg-teal-700"
                      >
                        View Report
                      </button>
                      <button 
                        onClick={() => alert(`Downloading: ${report.title}`)}
                        className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;