// src/services/stationService.js
export default {
  getStationById: async (stationId) => {
    // Return mock station data for development
    const mockStations = [
      {
        id: 'STN-001',
        name: 'Riverbend Monitoring Station A',
        latitude: 19.0760,
        longitude: 72.8777,
        location: 'Mumbai, Maharashtra',
        region: 'west',
        status: 'active',
        type: 'river_monitoring',
        waterSource: 'river',
        managedBy: 'Maharashtra Water Board',
        lastUpdated: new Date().toISOString(),
        currentReading: {
          ph: 7.2,
          temperature: 28.5,
          turbidity: 3.8,
            bacteria_concentration: 120,
          dissolved_oxygen: 6.8,
          arsenic: 0.005,
          lead: 0.002,
          conductivity: 420
        }
      },
      {
        id: 'STN-002',
        name: 'Lakeview Monitoring Point',
        latitude: 12.9716,
        longitude: 77.5946,
        location: 'Bangalore, Karnataka',
        region: 'south',
        status: 'warning',
        type: 'lake_monitoring',
        waterSource: 'lake',
        managedBy: 'Karnataka Water Authority',
        lastUpdated: new Date().toISOString(),
        currentReading: {
          ph: 6.8,
          temperature: 24.3,
          turbidity: 5.2,
            bacteria_concentration: 280,
          dissolved_oxygen: 5.9,
          arsenic: 0.008,
          lead: 0.004,
          conductivity: 380
        }
      },
      {
        id: 'STN-003',
        name: 'Ganges River Monitoring',
        latitude: 25.3176,
        longitude: 83.0059,
        location: 'Varanasi, Uttar Pradesh',
        region: 'north',
        status: 'critical',
        type: 'river_monitoring',
        waterSource: 'river',
        managedBy: 'Uttar Pradesh Water Department',
        lastUpdated: new Date().toISOString(),
        currentReading: {
          ph: 6.2,
          temperature: 26.8,
          turbidity: 8.5,
          dissolved_oxygen: 4.2,
          arsenic: 0.012,
          lead: 0.009,
          conductivity: 550
        }
      }
    ];
    
    return mockStations.find(s => s.id === stationId) || mockStations[0];
  },
  
  getStations: async () => {
    return [
      {
        id: 'STN-001',
        name: 'Riverbend Monitoring Station A',
        latitude: 19.0760,
        longitude: 72.8777,
        location: 'Mumbai, Maharashtra',
        region: 'west',
        status: 'active',
        type: 'river_monitoring',
        waterSource: 'river',
        managedBy: 'Maharashtra Water Board',
        lastUpdated: new Date().toISOString(),
        currentReading: {
          ph: 7.2,
          temperature: 28.5,
          turbidity: 3.8,
            bacteria_concentration: 120,
          dissolved_oxygen: 6.8,
          arsenic: 0.005,
          lead: 0.002,
          conductivity: 420
        }
      },
      {
        id: 'STN-002',
        name: 'Lakeview Monitoring Point',
        latitude: 12.9716,
        longitude: 77.5946,
        location: 'Bangalore, Karnataka',
        region: 'south',
        status: 'warning',
        type: 'lake_monitoring',
        waterSource: 'lake',
        managedBy: 'Karnataka Water Authority',
        lastUpdated: new Date().toISOString(),
        currentReading: {
          ph: 6.8,
          temperature: 24.3,
          turbidity: 5.2,
            bacteria_concentration: 280,
          dissolved_oxygen: 5.9,
          arsenic: 0.008,
          lead: 0.004,
          conductivity: 380
        }
      },
      {
        id: 'STN-003',
        name: 'Ganges River Monitoring',
        latitude: 25.3176,
        longitude: 83.0059,
        location: 'Varanasi, Uttar Pradesh',
        region: 'north',
        status: 'critical',
        type: 'river_monitoring',
        waterSource: 'river',
        managedBy: 'Uttar Pradesh Water Department',
        lastUpdated: new Date().toISOString(),
        currentReading: {
          ph: 6.2,
          temperature: 26.8,
          turbidity: 8.5,
          dissolved_oxygen: 4.2,
          arsenic: 0.012,
          lead: 0.009,
          conductivity: 550
        }
      }
    ];
  }
};

