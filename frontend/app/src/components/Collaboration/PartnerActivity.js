//src/components/Collaboration/PartnerActivity.js
import React from 'react';

const PartnerActivity = () => {
  const activities = [
    {
      id: 1,
      description: 'Alice Smith assigned "Water Quality Monitoring" task to Bob Johnson.',
      time: '2 hours ago',
      status: 'approved'
    },
    {
      id: 2,
      description: 'Bob Johnson submitted a report for Station RW-003.',
      time: '5 hours ago',
      status: 'approved'
    },
    {
      id: 3,
      description: 'David Green updated project "Groundwater Contamination Study".',
      time: '1 day ago',
      status: 'approved'
    },
    {
      id: 4,
      description: 'Carol White commented on "Turbidity Spike" report.',
      time: '2 days ago',
      status: 'approved'
    },
    {
      id: 5,
      description: 'Eve Davis joined the "Coastal Erosion Impact Assessment" project.',
      time: '3 days ago',
      status: 'approved'
    },
    {
      id: 6,
      description: 'John Doe approved a new collaboration with AquaGuard Alliance.',
      time: '1 week ago',
      status: 'approved'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Partner Activity Log</h2>
      
      <div className="space-y-4">
        {activities.map(activity => (
          <div key={activity.id} className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="text-gray-800">{activity.description}</p>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-500">{activity.time}</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                activity.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {activity.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Load More Activity →
        </button>
      </div>
    </div>
  );
};

export default PartnerActivity;