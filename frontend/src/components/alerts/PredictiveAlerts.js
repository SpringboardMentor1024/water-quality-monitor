// src/pages/alerts/PredictiveAlerts.js

/* 
  Predictive Alerts Engine
  This module simulates an AI model that predicts future water alerts
  based on sensor history and threshold analysis.
*/

// ------------------ Safe Thresholds ------------------
const thresholds = {
  Turbidity: 10,     // NTU
  Ammonia: 2.0,     // mg/L
  DO: 5.0,          // mg/L
  pH: [6.5, 8.5],   // Safe Range
};

// ------------------ Seeded Demo Sensor History ------------------
const seededSensorData = [
  { station: "NGO-MH-002", type: "Turbidity", value: 9,  time: "2026-01-12T10:00" },
  { station: "NGO-MH-002", type: "Turbidity", value: 11, time: "2026-01-13T10:00" },
  { station: "NGO-MH-002", type: "Turbidity", value: 13, time: "2026-01-14T10:00" },

  { station: "NGO-DL-003", type: "Ammonia", value: 1.9, time: "2026-01-12T10:00" },
  { station: "NGO-DL-003", type: "Ammonia", value: 2.1, time: "2026-01-13T10:00" },
  { station: "NGO-DL-003", type: "Ammonia", value: 2.6, time: "2026-01-14T10:00" },

  { station: "NGO-KA-004", type: "DO", value: 6.7, time: "2026-01-12T10:00" },
  { station: "NGO-KA-004", type: "DO", value: 5.3, time: "2026-01-13T10:00" },
  { station: "NGO-KA-004", type: "DO", value: 4.9, time: "2026-01-14T10:00" },

  { station: "NGO-GJ-005", type: "pH", value: 7.2, time: "2026-01-12T10:00" },
  { station: "NGO-GJ-005", type: "pH", value: 8.8, time: "2026-01-13T10:00" },
];

// ------------------ Trend Analyzer ------------------
const analyzeTrend = (data) => {
  if (data.length < 2) return 0;
  return data[data.length - 1].value - data[0].value;
};

// ------------------ Risk Detector ------------------
const isDangerous = (type, value) => {
  if (type === "pH") {
    return value < thresholds.pH[0] || value > thresholds.pH[1];
  }
  return value > thresholds[type];
};

// ------------------ Calculate Probability ------------------
const calculateProbability = (type, currentValue, predictedValue, trend) => {
  let threshold = type === "pH" ? thresholds.pH[1] : thresholds[type];
  let safeRange = type === "pH" ? (thresholds.pH[1] - thresholds.pH[0]) : threshold;
  
  // Distance from threshold
  const distanceFromThreshold = Math.abs(predictedValue - threshold);
  
  // Trend factor (positive trend increases probability)
  const trendFactor = trend > 0 ? 1.2 : 0.8;
  
  // History factor (more historical data = higher confidence)
  const historyFactor = 1.1;
  
  // Base probability calculation
  let probability = 0;
  
  if (type === "pH") {
    // For pH, check if outside safe range
    if (predictedValue < thresholds.pH[0] || predictedValue > thresholds.pH[1]) {
      probability = 70 + (Math.abs(predictedValue - 7.5) * 10); // More extreme = higher probability
    } else {
      probability = 30 - (distanceFromThreshold * 10);
    }
  } else {
    // For other parameters
    if (predictedValue > threshold) {
      probability = 60 + ((predictedValue - threshold) / threshold * 40);
    } else {
      probability = 40 - ((threshold - predictedValue) / threshold * 20);
    }
  }
  
  // Apply factors
  probability *= trendFactor * historyFactor;
  
  // Cap between 5% and 95%
  probability = Math.max(5, Math.min(95, probability));
  
  return Math.round(probability);
};

// ------------------ Get Expected Date ------------------
const getExpectedDate = (probability) => {
  const today = new Date();
  if (probability >= 70) {
    today.setDate(today.getDate() + 2); // High risk: within 2 days
  } else if (probability >= 40) {
    today.setDate(today.getDate() + 7); // Medium risk: within 1 week
  } else {
    today.setDate(today.getDate() + 14); // Low risk: within 2 weeks
  }
  return today.toISOString().split('T')[0]; // YYYY-MM-DD format
};

// ------------------ Get Review Content ------------------
const getReviewContent = (type, station, probability, currentValue, predictedValue) => {
  const reviews = {
    Turbidity: `Station ${station} shows increasing turbidity trends. Current: ${currentValue} NTU, Predicted: ${predictedValue} NTU (threshold: ${thresholds.Turbidity} NTU). ${probability >= 70 ? 'Immediate monitoring recommended.' : 'Regular monitoring sufficient.'}`,
    Ammonia: `Ammonia levels at ${station} are trending upward. Current: ${currentValue} mg/L, Predicted: ${predictedValue} mg/L (safe limit: ${thresholds.Ammonia} mg/L). ${probability >= 70 ? 'Potential source investigation needed.' : 'Within acceptable seasonal variation.'}`,
    DO: `Dissolved oxygen at ${station} shows declining trend. Current: ${currentValue} mg/L, Predicted: ${predictedValue} mg/L (minimum: ${thresholds.DO} mg/L). ${probability >= 70 ? 'Risk to aquatic life - increase aeration.' : 'Marginal but monitoring advised.'}`,
    pH: `pH levels at ${station} moving outside optimal range (${thresholds.pH[0]}-${thresholds.pH[1]}). Current: ${currentValue}, Predicted: ${predictedValue}. ${probability >= 70 ? 'Chemical treatment may be required.' : 'Natural fluctuation expected.'}`
  };
  
  return reviews[type] || `Parameter ${type} at station ${station} shows concerning trends. Probability of exceeding safe limits: ${probability}%.`;
};

// ------------------ Predictive Model ------------------
export const runPredictionModel = () => {
  const grouped = {};

  // Group readings by station + type
  seededSensorData.forEach(d => {
    const key = `${d.station}_${d.type}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(d);
  });

  const predictions = [];

  Object.keys(grouped).forEach((key, index) => {
    const history = grouped[key];
    const last = history[history.length - 1];
    const trend = analyzeTrend(history);

    const futureValue = last.value + trend * 0.6; // simple linear projection
    const willBeDangerous = isDangerous(last.type, futureValue);
    
    // Calculate probability
    const probability = calculateProbability(last.type, last.value, futureValue, trend);
    
    // Get expected date
    const expectedDate = getExpectedDate(probability);
    
    // Get review content
    const review = getReviewContent(last.type, last.station, probability, last.value, futureValue);

    predictions.push({
      id: index + 1, // Simple numeric ID
      parameter: last.type,
      probability: probability, // This is the key field that was missing!
      type: last.type.toLowerCase().replace(' ', '_'),
      station: last.station,
      currentValue: last.value,
      predictedValue: Number(futureValue.toFixed(2)),
      expectedDate: expectedDate,
      trend: trend > 0 ? "Increasing" : "Decreasing",
      riskLevel: willBeDangerous ? "High" : "Low",
      predictedAlert: willBeDangerous,
      review: review, // Add review content
      message: willBeDangerous
        ? `⚠ ${last.type} likely to cross safe limits (${probability}% probability)`
        : `✔ ${last.type} expected to remain stable (${probability}% probability)`
    });
  });

  return predictions;
};

// ------------------ Hook for UI ------------------
export const getPredictiveAlerts = () => {
  const predictions = runPredictionModel();
  
  // Ensure all predictions have proper probability values
  return predictions.map(p => ({
    ...p,
    // Ensure probability is a number between 0-100
    probability: typeof p.probability === 'number' ? 
      Math.max(0, Math.min(100, Math.round(p.probability))) : 
      0
  }));
};

// ------------------ Get mock predictive alerts (for testing) ------------------
export const getMockPredictiveAlerts = () => {
  return [
    {
      id: 1,
      parameter: "Turbidity",
      probability: 75,
      type: "turbidity",
      station: "NGO-MH-002",
      currentValue: 13,
      predictedValue: 14.8,
      expectedDate: "2026-01-16",
      review: "Station NGO-MH-002 shows increasing turbidity trends. Current: 13 NTU, Predicted: 14.8 NTU (threshold: 10 NTU). Immediate monitoring recommended.",
      message: "⚠ Turbidity likely to cross safe limits (75% probability)"
    },
    {
      id: 2,
      parameter: "Ammonia",
      probability: 65,
      type: "ammonia",
      station: "NGO-DL-003",
      currentValue: 2.6,
      predictedValue: 2.9,
      expectedDate: "2026-01-21",
      review: "Ammonia levels at NGO-DL-003 are trending upward. Current: 2.6 mg/L, Predicted: 2.9 mg/L (safe limit: 2 mg/L). Potential source investigation needed.",
      message: "⚠ Ammonia likely to cross safe limits (65% probability)"
    },
    {
      id: 3,
      parameter: "DO",
      probability: 45,
      type: "dissolved_oxygen",
      station: "NGO-KA-004",
      currentValue: 4.9,
      predictedValue: 4.7,
      expectedDate: "2026-01-28",
      review: "Dissolved oxygen at NGO-KA-004 shows declining trend. Current: 4.9 mg/L, Predicted: 4.7 mg/L (minimum: 5 mg/L). Marginal but monitoring advised.",
      message: "⚠ DO likely to cross safe limits (45% probability)"
    },
    {
      id: 4,
      parameter: "pH",
      probability: 35,
      type: "ph_level",
      station: "NGO-GJ-005",
      currentValue: 8.8,
      predictedValue: 8.9,
      expectedDate: "2026-01-28",
      review: "pH levels at NGO-GJ-005 moving outside optimal range (6.5-8.5). Current: 8.8, Predicted: 8.9. Natural fluctuation expected.",
      message: "⚠ pH likely to cross safe limits (35% probability)"
    }
  ];
};
