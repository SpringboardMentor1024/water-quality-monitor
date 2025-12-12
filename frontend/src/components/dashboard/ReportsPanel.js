import React from 'react';

const ReportsPanel = () => {
  const recentReports = [
    {
      id: 1,
      title: 'Weekly Water Quality Report',
      date: '2024-01-15',
      type: 'Automated',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Contamination Alert - Hudson River',
      date: '2024-01-14',
      type: 'User Report',
      status: 'investigating'
    },
    {
      id: 3,
      title: 'Monthly Compliance Report',
      date: '2024-01-01',
      type: 'Automated',
      status: 'completed'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      investigating: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.pending;
  };

  const getTypeIcon = (type) => {
    return type === 'User Report' ? '👤' : '🤖';
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 space-y-2 sm:space-y-0">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Reports</h2>
        <button className="bg-teal-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm hover:bg-teal-700">
          New Report
        </button>
      </div>
      
      <div className="space-y-2 sm:space-y-3">
        {recentReports.map((report) => (
          <div key={report.id} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50">
            <div className="flex items-start justify-between space-x-2">
              <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
                <span className="text-base sm:text-lg flex-shrink-0">{getTypeIcon(report.type)}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{report.title}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mt-1">
                    <span className="text-xs sm:text-sm text-gray-500">{report.date}</span>
                    <span className="hidden sm:inline text-sm text-gray-400">•</span>
                    <span className="text-xs sm:text-sm text-gray-500">{report.type}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(report.status)}`}>
                {report.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
        <button className="w-full text-center text-xs sm:text-sm text-teal-600 hover:text-teal-700 font-medium">
          View All Reports
        </button>
      </div>
    </div>
  );
};

export default ReportsPanel;