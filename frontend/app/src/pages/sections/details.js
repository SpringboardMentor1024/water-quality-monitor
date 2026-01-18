// import React, { useState, useEffect } from "react";
// import TrendChart from "../../components/TrendChart";
// import { fetchStationReadings } from "../../services/api";
// import axios from "axios";
// import {
//   FaFlask,
//   FaChartLine,
//   FaClock,
//   FaMapMarkerAlt,
//   FaBuilding,
//   FaExclamationTriangle,
//   FaFileAlt
// } from "react-icons/fa";

// /* =================================================
//    TEMP MOCK STATION INFO — KEEP AS IS
// ================================================= */
// const mockStation = {
//   id: "STN-101",
//   name: "Water Monitoring Station",
//   location: "Unknown Location",
//   managed_by: "Local Authority",
//   status: "active",
//   lastUpdated: "Just now"
// };

// // PARAMETERS TO DISPLAY (UI)
// const PARAMETERS = ["pH", "turbidity", "DO", "temperature", "lead", "arsenic", "iron"];

// /* =================================================
//    DUMMY REPORTS (Report Management – Milestone 4)
// ================================================= */
// const dummyReports = [
//   {
//     id: 1,
//     title: "High Turbidity Observed",
//     status: "Pending",
//     submitted_by: "Citizen A",
//     date: "2026-01-10"
//   },
//   {
//     id: 2,
//     title: "Unusual Odor in Water",
//     status: "Verified",
//     submitted_by: "NGO Volunteer",
//     date: "2026-01-12"
//   }
// ];

// export default function Details({ stationId, goToReports }) {
//   const [showTrends, setShowTrends] = useState(false);
//   const [readings, setReadings] = useState([]);
//   const [loading, setLoading] = useState(false);

//   /* =================================================
//      FETCH DATA (DB OR USGS)
//   ================================================= */
//   useEffect(() => {
//     if (stationId === undefined || stationId === null) return;

//     const isUSGS = String(stationId).startsWith("USGS-");

//     /* ---------------- USGS STATION ---------------- */
//     if (isUSGS) {
//       const siteId = String(stationId).replace("USGS-", "");

//       const fetchUsgsData = () => {
//         setLoading(true);

//         Promise.allSettled([
//           axios.get(`http://127.0.0.1:8000/readings/usgs/${siteId}/ph`),
//           axios.get(`http://127.0.0.1:8000/readings/usgs/${siteId}/do`),
//           axios.get(`http://127.0.0.1:8000/readings/usgs/${siteId}/temperature`)
//         ])
//           .then((results) => {
//             const collected = [];

//             if (results[0].status === "fulfilled") {
//               collected.push({
//                 parameter: "ph",
//                 value: results[0].value.data.value,
//                 recorded_at: results[0].value.data.recorded_at
//               });
//             }
//             if (results[1].status === "fulfilled") {
//               collected.push({
//                 parameter: "do",
//                 value: results[1].value.data.value,
//                 recorded_at: results[1].value.data.recorded_at
//               });
//             }
//             if (results[2].status === "fulfilled") {
//               collected.push({
//                 parameter: "temperature",
//                 value: results[2].value.data.value,
//                 recorded_at: results[2].value.data.recorded_at
//               });
//             }

//             setReadings(collected);
//           })
//           .catch(() => setReadings([]))
//           .finally(() => setLoading(false));
//       };

//       fetchUsgsData();
//       const interval = setInterval(fetchUsgsData, 30000);
//       return () => clearInterval(interval);
//     }

//     /* ---------------- DB STATION ---------------- */
//     setLoading(true);
//     fetchStationReadings(stationId)
//       .then((res) => setReadings(res.data || []))
//       .catch(() => setReadings([]))
//       .finally(() => setLoading(false));
//   }, [stationId]);

//   /* =================================================
//      BUILD LATEST READING PER PARAMETER
//   ================================================= */
//   const latestReadings = {};
//   PARAMETERS.forEach((param) => {
//     latestReadings[param] =
//       readings.find(
//         (r) => r.parameter?.toLowerCase() === param.toLowerCase()
//       ) || null;
//   });

//   /* =================================================
//      GROUP READINGS FOR TRENDS
//   ================================================= */
//   const groupedReadings = readings.reduce((acc, r) => {
//     const key = r.parameter?.toLowerCase();
//     if (!key) return acc;
//     if (!acc[key]) acc[key] = [];
//     acc[key].push({
//       time: r.recorded_at
//         ? new Date(r.recorded_at).toLocaleTimeString()
//         : "—",
//       value: r.value
//     });
//     return acc;
//   }, {});

//   if (!stationId) {
//     return (
//       <div className="h-full flex items-center justify-center p-6">
//         <p className="text-gray-400">Select a station from the map</p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full overflow-y-auto bg-gray-50">
//       <div className="p-4 md:p-6 max-w-6xl mx-auto">

//         {/* ================= HEADER ================= */}
//         <div className="bg-white rounded-lg border p-6 mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">
//             {mockStation.name}
//           </h1>

//           <div className="flex flex-wrap gap-4 text-gray-600 mt-2">
//             <span className="flex items-center gap-2">
//               <FaMapMarkerAlt /> {mockStation.location}
//             </span>
//             <span className="flex items-center gap-2">
//               <FaBuilding /> {mockStation.managed_by}
//             </span>
//             <span className="flex items-center gap-2">
//               <FaClock /> Updated {mockStation.lastUpdated}
//             </span>
//           </div>

//           <div className="flex gap-3 mt-4">
//             <button
//               onClick={() => setShowTrends(!showTrends)}
//               className="px-4 py-2 bg-blue-600 text-white rounded"
//             >
//               <FaChartLine className="inline mr-2" />
//               {showTrends ? "Hide Trends" : "View Trends"}
//             </button>
//           </div>
//         </div>

//         {/* ================= READINGS ================= */}
//         <div className="bg-white rounded-lg border p-6 mb-6">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">
//             Live Water Quality Readings
//           </h2>

//           {loading && <p className="text-gray-400">Loading...</p>}

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {Object.entries(latestReadings).map(([param, r]) => (
//               <div key={param} className="p-4 border rounded">
//                 <div className="flex items-center gap-2 mb-2">
//                   <FaFlask />
//                   <h3 className="font-bold">{param}</h3>
//                 </div>
//                 <p className="text-2xl font-bold">
//                   {r ? r.value : "—"}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {showTrends && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
//               {Object.entries(groupedReadings).map(([param, data]) => (
//                 <TrendChart
//                   key={param}
//                   title={`${param.toUpperCase()} Trend`}
//                   data={data}
//                   unit=""
//                   color="#38bdf8"
//                 />
//               ))}
//             </div>
//           )}
//         </div>

//         {/* ================= REPORT MANAGEMENT ================= */}
//         <div className="bg-white rounded-lg border p-6">
//           <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//             <FaFileAlt /> Reports & Observations
//           </h2>

//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//                   Title
//                 </th>
//                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//                   Submitted By
//                 </th>
//                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//                   Status
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y">
//               {dummyReports.map((r) => (
//                 <tr key={r.id}>
//                   <td className="px-4 py-2">{r.title}</td>
//                   <td className="px-4 py-2">{r.submitted_by}</td>
//                   <td className="px-4 py-2">
//                     <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
//                       {r.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import TrendChart from "../../components/TrendChart";
import { fetchStationReadings } from "../../services/api";
import axios from "axios";
import {
  FaFlask,
  FaChartLine,
  FaClock,
  FaMapMarkerAlt,
  FaBuilding,
  FaFileAlt
} from "react-icons/fa";

/* =================================================
   DEFAULT STATION (USED AS FALLBACK)
================================================= */
const defaultStation = {
  id: "",
  name: "Unknown Station",
  location: "Unknown Location",
  managed_by: "Unknown Authority",
  status: "inactive",
  lastUpdated: "—"
};

/* PARAMETERS TO DISPLAY */
const PARAMETERS = [
  "pH",
  "turbidity",
  "DO",
  "temperature",
  "lead",
  "arsenic",
  "iron"
];

/* DUMMY REPORTS (Milestone 4) */
const dummyReports = [
  {
    id: 1,
    title: "High Turbidity Observed",
    status: "Pending",
    submitted_by: "Citizen A",
    date: "2026-01-10"
  },
  {
    id: 2,
    title: "Unusual Odor in Water",
    status: "Verified",
    submitted_by: "NGO Volunteer",
    date: "2026-01-12"
  }
];

export default function Details({ stationId }) {
  const [showTrends, setShowTrends] = useState(false);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [station, setStation] = useState(defaultStation);

  /* =================================================
     FETCH STATION INFO
  ================================================= */
  useEffect(() => {
    if (!stationId) return;

    axios
      .get(`http://127.0.0.1:8000/stations/${stationId}`)
      .then((res) => {
        setStation({
          ...res.data,
          lastUpdated: "Just now"
        });
      })
      .catch(() => {
        setStation(defaultStation);
      });
  }, [stationId]);

  /* =================================================
     FETCH READINGS
  ================================================= */
  useEffect(() => {
    if (!stationId) return;

    const isUSGS = String(stationId).startsWith("USGS-");

    if (isUSGS) {
      const siteId = String(stationId).replace("USGS-", "");
      setLoading(true);

      Promise.allSettled([
        axios.get(`http://127.0.0.1:8000/readings/usgs/${siteId}/ph`),
        axios.get(`http://127.0.0.1:8000/readings/usgs/${siteId}/do`),
        axios.get(
          `http://127.0.0.1:8000/readings/usgs/${siteId}/temperature`
        )
      ])
        .then((results) => {
          const collected = [];

          results.forEach((r) => {
            if (r.status === "fulfilled") {
              collected.push({
                parameter: r.value.data.parameter,
                value: r.value.data.value,
                recorded_at: r.value.data.recorded_at
              });
            }
          });

          setReadings(collected);
        })
        .catch(() => setReadings([]))
        .finally(() => setLoading(false));

      return;
    }

    setLoading(true);
    fetchStationReadings(stationId)
      .then((res) => setReadings(res.data || []))
      .catch(() => setReadings([]))
      .finally(() => setLoading(false));
  }, [stationId]);

  /* =================================================
     LATEST READING PER PARAMETER
  ================================================= */
  const latestReadings = {};
  PARAMETERS.forEach((param) => {
    latestReadings[param] =
      readings.find(
        (r) => r.parameter?.toLowerCase() === param.toLowerCase()
      ) || null;
  });

  /* =================================================
     GROUP FOR TRENDS
  ================================================= */
  const groupedReadings = readings.reduce((acc, r) => {
    const key = r.parameter?.toLowerCase();
    if (!key) return acc;

    if (!acc[key]) acc[key] = [];
    acc[key].push({
      time: r.recorded_at
        ? new Date(r.recorded_at).toLocaleTimeString()
        : "—",
      value: r.value
    });
    return acc;
  }, {});

  if (!stationId) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-400">Select a station from the map</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="p-6 max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {station.name}
          </h1>

          <div className="flex flex-wrap gap-4 text-gray-600 mt-2">
            <span className="flex items-center gap-2">
              <FaMapMarkerAlt /> {station.location}
            </span>
            <span className="flex items-center gap-2">
              <FaBuilding /> {station.managed_by}
            </span>
            <span className="flex items-center gap-2">
              <FaClock /> Updated {station.lastUpdated}
            </span>
          </div>

          <button
            onClick={() => setShowTrends(!showTrends)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            <FaChartLine className="inline mr-2" />
            {showTrends ? "Hide Trends" : "View Trends"}
          </button>
        </div>

        {/* READINGS */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Live Water Quality Readings
          </h2>

          {loading && <p className="text-gray-400">Loading...</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(latestReadings).map(([param, r]) => (
              <div key={param} className="p-4 border rounded bg-gray-50">
                <div className="flex items-center gap-2 mb-2 text-gray-700">
                  <FaFlask />
                  <h3 className="font-semibold">{param}</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {r ? r.value : "—"}
                </p>
              </div>
            ))}
          </div>

          {showTrends && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {Object.entries(groupedReadings).map(([param, data]) => (
                <TrendChart
                  key={param}
                  title={`${param.toUpperCase()} Trend`}
                  data={data}
                  unit=""
                  color="#38bdf8"
                />
              ))}
            </div>
          )}
        </div>

        {/* REPORTS */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaFileAlt /> Reports & Observations
          </h2>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Submitted By
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            {/* <tbody className="divide-y">
              {dummyReports.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2">{r.title}</td>
                  <td className="px-4 py-2">{r.submitted_by}</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody> */}
            <tbody className="divide-y divide-gray-200">
            {dummyReports.map((r) => (
              <tr key={r.id} className="bg-white">
                <td className="px-4 py-2 text-gray-800">
                  {r.title}
                </td>
                <td className="px-4 py-2 text-gray-800">
                  {r.submitted_by}
                </td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}
