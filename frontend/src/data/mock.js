// Shared mock data used across pages
export const SAMPLE_STATIONS = [
  { id: 1, name: 'Ganga River Station', location: 'Haridwar, Uttarakhand', latitude: 29.9457, longitude: 78.1642 },
  { id: 2, name: 'Yamuna Station', location: 'Delhi, India', latitude: 28.6139, longitude: 77.2090 },
  { id: 3, name: 'Godavari Station', location: 'Rajahmundry', latitude: 16.9891, longitude: 81.7874 },
  { id: 4, name: 'Cauvery Station', location: 'Mysore', latitude: 12.2958, longitude: 76.6394 },
  { id: 5, name: 'Narmada Station', location: 'Jabalpur', latitude: 23.1815, longitude: 79.9864 },
  { id: 6, name: 'Brahmaputra Station', location: 'Guwahati', latitude: 26.1445, longitude: 91.7362 },
  { id: 7, name: 'Tungabhadra Station', location: 'Hampi', latitude: 15.3350, longitude: 76.4600},
  { id: 8, name: 'Krishna Station', location: 'Vijayawada, Andhra Pradesh', latitude: 16.5062, longitude: 80.6480 },
  { id: 9, name: "Mahanadi Station", location: "Cuttack, Odisha", latitude: 20.4625, longitude: 85.8830 },
  { id: 10, name: "Sabarmati Station", location: "Ahmedabad, Gujarat", latitude: 23.0225, longitude: 72.5714 },
  { id: 11, name: "Periyar Station", location: "Kochi, Kerala", latitude: 9.9312, longitude: 76.2673 },
  { id: 12, name: "Tapti Station", location: "Surat, Gujarat", latitude: 21.1702, longitude: 72.8311 },
  { id: 13, name: "Musi River Station", location: "Hyderabad, Telangana", latitude: 17.3850, longitude: 78.4867 },
  { id: 14, name: "Hooghly Station", location: "Kolkata, West Bengal", latitude: 22.5726, longitude: 88.3639 },
  { id: 15, name: "Pennar Station", location: "Nellore, Andhra Pradesh", latitude: 14.4426, longitude: 79.9865 },
  { id: 16, name: "Chambal Station", location: "Kota, Rajasthan", latitude: 25.2138, longitude: 75.8648 },
  { id: 17, name: "Luni River Station", location: "Jodhpur, Rajasthan", latitude: 26.2389, longitude: 73.0243 },
  { id: 18, name: "Kosi Station", location: "Saharsa, Bihar", latitude: 25.8800, longitude: 86.6000 },
  { id: 19, name: "Barak Station", location: "Silchar, Assam", latitude: 24.8333, longitude: 92.7789 },
  { id: 20, name: "Teesta Station", location: "Siliguri, West Bengal", latitude: 26.7271, longitude: 88.3953 },
];

// Simple generator for mock timeseries readings for analysis
export function getMockReadings(stationId, points = 48) {
  const now = new Date();
  const readings = [];
  // Seed based on stationId for deterministic variation
  const seed = (stationId % 10) + 1;
  let basePh = 7.0 + (seed - 5) * 0.05;
  let baseTurbidity = 1.5 + (seed % 4) * 0.5;
  let baseDo = 8.0 - (seed % 3) * 0.3;

  for (let i = points - 1; i >= 0; i--) {
    const ts = new Date(now.getTime() - i * 60 * 60 * 1000); // hourly points
    // add gentle periodic fluctuation
    const ph = +(basePh + Math.sin(i / 3 + seed) * 0.2 + ((seed % 3) * 0.02)).toFixed(2);
    const turbidity = +(baseTurbidity + Math.cos(i / 4 + seed) * 0.4 + ((seed % 2) * 0.1)).toFixed(2);
    const dissolved_oxygen = +(baseDo + Math.sin(i / 5) * 0.3).toFixed(2);
    readings.push({ id: `${stationId}-${i}`, station_id: stationId, recorded_at: ts.toISOString(), ph, turbidity, dissolved_oxygen });
  }
  return readings;
}
