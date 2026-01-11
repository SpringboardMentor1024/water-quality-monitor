import React, { useState, useEffect } from 'react';

const StationsPage = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('');

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/stations');
      
      if (response.ok) {
        const data = await response.json();
        setStations(data);
        setDataSource('Backend API');
      } else {
        setStations([]);
        setDataSource('No Data - Backend Error');
      }
    } catch (error) {
      console.error('Backend connection failed:', error);
      setStations([]);
      setDataSource('No Data - Backend Unavailable');
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Water Stations</h1>
        <p className="text-gray-600 mt-2">Monitor and manage all water quality monitoring stations</p>
        <div className="mt-2 text-sm text-blue-600">Data Source: {dataSource}</div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="text-2xl font-bold">{stations.length}</div>
          <div className="text-gray-600">Total Stations</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="text-2xl font-bold text-green-600">
            {stations.filter(s => s.status === 'active').length}
          </div>
          <div className="text-gray-600">Active</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="text-2xl font-bold text-yellow-600">
            {stations.filter(s => s.status === 'warning').length}
          </div>
          <div className="text-gray-600">Warnings</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="text-2xl font-bold text-red-600">
            {stations.filter(s => s.status === 'critical').length}
          </div>
          <div className="text-gray-600">Critical</div>
        </div>
      </div>

      {/* Stations Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {stations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Station Data Available</h3>
            <p className="text-gray-600 mb-4">{dataSource}</p>
            <p className="text-sm text-gray-500">Please ensure the backend server is running and accessible.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Station</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Water Quality</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reports</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stations.map((station) => (
                  <tr key={station.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{station.name}</div>
                      <div className="text-sm text-gray-500">{station.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(station.status)}`}>
                        {station.status?.toUpperCase() || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div>pH: {station.currentReading?.ph?.toFixed(1) || 'N/A'}</div>
                        <div>Temp: {station.currentReading?.temperature?.toFixed(1) || 'N/A'}°C</div>
                        <div>DO: {station.currentReading?.dissolved_oxygen?.toFixed(1) || 'N/A'} mg/L</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(station.lastUpdated || Date.now()).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div>{station.reportsCount || 0} reports</div>
                        <div>{station.alertsCount || 0} alerts</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StationsPage;