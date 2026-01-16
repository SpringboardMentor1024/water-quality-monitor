// frontend/src/services/stationService.js

const stationService = {
  getStationById: async (stationId) => {
    // Convert STN-XXX to integer ID for backend
    const numericId = parseInt(stationId.replace("STN-", ""), 10);

    const response = await fetch(`http://localhost:8000/api/stations/${numericId}`);
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
