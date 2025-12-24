import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>New Station Location</Popup>
    </Marker>
  );
}

const LocationEditor = () => {
  const defaultCenter = [20.5937, 78.9629];
  const defaultZoom = 5;
  const [position, setPosition] = useState(null);
  const [stationName, setStationName] = useState('');
  const [stationType, setStationType] = useState('monitoring');

  const handleSaveStation = () => {
    if (!position || !stationName) {
alert(`Station "${newStation.name}" saved at: ${newStation.location}`);
      return;
    }

    const newStation = {
      name: stationName,
      type: stationType,
      lat: position.lat,
      lng: position.lng,
      createdAt: new Date().toISOString()
    };

alert(`Station "${newStation.name}" saved at: ${newStation.location}`);
    console.log('New station:', newStation);
    
    // Reset form
    setStationName('');
    setPosition(null);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px', color: '#1F2937' }}>Location Editor</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        {/* Left Panel - Form */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '20px', color: '#374151' }}>Add New Station</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#4B5563' }}>
              Station Name
            </label>
            <input
              type="text"
              value={stationName}
              onChange={(e) => setStationName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              placeholder="Enter station name"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#4B5563' }}>
              Station Type
            </label>
            <select
              value={stationType}
              onChange={(e) => setStationType(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="monitoring">Monitoring Station</option>
              <option value="testing">Testing Lab</option>
              <option value="treatment">Treatment Plant</option>
              <option value="source">Water Source</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#F3F4F6', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '8px', color: '#374151' }}>Instructions</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#6B7280', fontSize: '14px' }}>
              <li>Click on the map to select location</li>
              <li>Enter station details</li>
              <li>Click "Save Station" to add</li>
            </ul>
          </div>

          <button
            onClick={handleSaveStation}
            disabled={!position || !stationName}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: position && stationName ? '#0D9488' : '#9CA3AF',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: position && stationName ? 'pointer' : 'not-allowed'
            }}
          >
            Save Station
          </button>

          {position && (
            <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#ECFDF5', borderRadius: '8px', fontSize: '14px' }}>
              <strong>Selected Location:</strong><br />
              Latitude: {position.lat.toFixed(6)}<br />
              Longitude: {position.lng.toFixed(6)}
            </div>
          )}
        </div>

        {/* Right Panel - Map */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '15px', color: '#374151' }}>Select Location</h3>
          <p style={{ marginBottom: '15px', color: '#6B7280', fontSize: '14px' }}>
            Click anywhere on the map to place a marker
          </p>
          
          <div style={{ height: '500px', borderRadius: '8px', overflow: 'hidden' }}>
            <MapContainer 
              center={defaultCenter} 
              zoom={defaultZoom} 
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationEditor;

