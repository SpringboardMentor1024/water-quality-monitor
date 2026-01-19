import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const TestMapComponent = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        console.log('TestMapComponent: Fetching stations...');
        const response = await fetch('http://localhost:8000/api/stations');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('TestMapComponent: Received data:', data);
        
        const processedStations = data.map(station => ({
          id: station.id,
          name: station.name,
          lat: parseFloat(station.latitude),
          lng: parseFloat(station.longitude),
          location: station.location
        }));
        
        console.log('TestMapComponent: Processed stations:', processedStations);
        setStations(processedStations);
        
      } catch (err) {
        console.error('TestMapComponent: Error fetching stations:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p>Loading map...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>Error: {error}</p>
        <p>Make sure the backend is running on port 8000</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Test Map Component</h2>
      <p className="mb-4">Found {stations.length} stations</p>
      
      <div className="h-96 w-full border rounded">
        <MapContainer
          center={stations.length > 0 ? [stations[0].lat, stations[0].lng] : [40.7128, -74.0060]}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {stations.map((station) => {
            console.log('TestMapComponent: Rendering marker for:', station.name, 'at', station.lat, station.lng);
            return (
              <Marker
                key={station.id}
                position={[station.lat, station.lng]}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold">{station.name}</h3>
                    <p>ID: {station.id}</p>
                    <p>Location: {station.location}</p>
                    <p>Coordinates: {station.lat}, {station.lng}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
      
      <div className="mt-4">
        <h3 className="font-bold">Station List:</h3>
        <ul className="list-disc list-inside">
          {stations.map(station => (
            <li key={station.id}>
              {station.name} - ({station.lat}, {station.lng})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TestMapComponent;