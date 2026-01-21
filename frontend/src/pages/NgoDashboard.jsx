import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NgoMap from "../components/NgoMap";
import api from "../utils/api";

export default function NgoDashboard() {
  const navigate = useNavigate();
  const [selectedNgo, setSelectedNgo] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [allStations, setAllStations] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const stationsRes = await api.get("/stations/");
        setAllStations(stationsRes.data);

        const stationNgos = [
          ...new Set(stationsRes.data.map(s => s.managed_by).filter(Boolean))
        ];
        const ngoData = stationNgos.map((name, i) => ({
          id: i + 1,
          name: name || "Government"
        }));
        setNgos(ngoData);

        const collabData = stationsRes.data.slice(0, 12).map((station, i) => ({
          id: i + 1,
          ngo_id: i % ngoData.length + 1,
          ngo: ngoData[i % ngoData.length],
          station_id: station.id,
          role: "Water Quality Monitoring"
        }));
        setCollaborations(collabData);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStationStatus = (station) => {
    const rand = Math.random();
    if (rand < 0.05) return "offline";
    if (rand < 0.15) return "warning";
    return "active";
  };

  const filteredStations = allStations.filter(station => {
    const status = getStationStatus(station);
    const ngoMatch =
      selectedNgo === "All" ||
      station.managed_by === selectedNgo ||
      collaborations.some(
        c =>
          c.station_id === station.id &&
          ngos.find(n => n.id === c.ngo_id)?.name === selectedNgo
      );

    const statusMatch = selectedStatus === "all" || status === selectedStatus;
    const searchMatch =
      !searchTerm ||
      station.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.location?.toLowerCase().includes(searchTerm.toLowerCase());

    return ngoMatch && statusMatch && searchMatch;
  });

  const statusCounts = {
    all: filteredStations.length,
    active: filteredStations.filter(s => getStationStatus(s) === "active").length,
    warning: filteredStations.filter(s => getStationStatus(s) === "warning").length,
    offline: filteredStations.filter(s => getStationStatus(s) === "offline").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-bold">Loading NGO Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white">

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black">WaterWatch</h1>
            <p className="text-blue-100 font-semibold">NGO Dashboard</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black">{filteredStations.length}</div>
            <div className="text-sm text-blue-100">Stations</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ================= NGO MODERATION CARD (NEW) ================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => navigate("/ngo/reports")}
            className="cursor-pointer bg-white rounded-2xl shadow-lg p-6 border hover:border-green-400 hover:shadow-xl transition"
          >
            <h2 className="text-xl font-bold text-green-700">
              Review User Reports
            </h2>
            <p className="text-gray-600 mt-2">
              Approve or reject water quality reports submitted by users
            </p>
            <div className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-lg">
              Open Reports Moderation →
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border">
            <h2 className="text-xl font-bold text-blue-700">
              Stations Overview
            </h2>
            <p className="text-gray-600 mt-2">
              Monitor station status and collaborations
            </p>
          </div>
        </section>

        {/* ================= MAP ================= */}
        <section className="bg-black rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-black text-white px-6 py-4 font-bold">
            Live Stations Map
          </div>
          <div className="h-80 p-4">
            <NgoMap stations={filteredStations} />
          </div>
        </section>

        {/* ================= TABLE ================= */}
        <section className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4 font-bold">
            Stations Overview
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left">Station</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Managed By</th>
              </tr>
            </thead>
            <tbody>
              {filteredStations.slice(0, 6).map(station => {
                const status = getStationStatus(station);
                return (
                  <tr
                    key={station.id}
                    onClick={() => navigate(`/ngo/station/${station.id}`)}
                    className="border-t hover:bg-blue-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 font-semibold">
                      {station.name || `STN-${station.id}`}
                    </td>
                    <td className="px-6 py-4 capitalize">{status}</td>
                    <td className="px-6 py-4">
                      {station.managed_by || "Government"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

      </div>
    </div>
  );
}
