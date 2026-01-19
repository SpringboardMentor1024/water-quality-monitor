// src/components/Collaboration/PartnerActivity.js
import React, { useEffect, useState } from 'react';
import { fetchPartnerActivity } from '../../services/collaborationService';

const PartnerActivity = () => {

  const [activities, setActivities] = useState([]);
  const ngoId = localStorage.getItem("ngo_id");

  useEffect(() => {
    if (!ngoId) return;

    fetchPartnerActivity(ngoId)
      .then(res => setActivities(res.data))
      .catch(err => console.error(err));
  }, [ngoId]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Partner Activity Log</h2>

      <div className="space-y-4">
        {activities.map(activity => (
          <div key={activity.id} className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="text-gray-800">{activity.description}</p>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-500">{activity.time}</span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                {activity.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="text-sm text-blue-600 font-medium">
          Load More Activity →
        </button>
      </div>
    </div>
  );
};

export default PartnerActivity;
