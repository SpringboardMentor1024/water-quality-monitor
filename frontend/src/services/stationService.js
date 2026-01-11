// src/services/stationService.js
const stationService = {
  getStationById: async (stationId) => {
    const response = await fetch(`http://localhost:8000/api/stations/${stationId}`);
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Station not found or backend unavailable');
  },
  
  getStations: async () => {
    const response = await fetch('http://localhost:8000/api/stations');
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Backend unavailable');
  }
};

export default stationService;