import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash, FaSearch, FaPlus, FaFilter, FaDownload, FaSync, FaMapMarkerAlt, FaWater, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function Stations({ onViewStation }) {
  const [stations, setStations] = useState([
    {
      id: "STN-001",
      name: "Riverhead Main Station",
      region: "Northern Region",
      area: "Riverhead District",
      status: "Safe",
      waterQuality: 85,
      alerts: 0,
      lastUpdated: "2024-03-15",
      type: "River"
    },
    {
      id: "STN-002",
      name: "Lakeview Monitoring",
      region: "Western Region",
      area: "Lakeside City",
      status: "Safe",
      waterQuality: 92,
      alerts: 1,
      lastUpdated: "2024-03-14",
      type: "Lake"
    },
    {
      id: "STN-003",
      name: "Industrial Zone Checkpoint",
      region: "Eastern Region",
      area: "Industrial Park",
      status: "Contaminated",
      waterQuality: 32,
      alerts: 3,
      lastUpdated: "2024-03-15",
      type: "Industrial"
    },
    {
      id: "STN-004",
      name: "Coastal Watch Station",
      region: "Southern Region",
      area: "Coastal Bay",
      status: "Safe",
      waterQuality: 78,
      alerts: 0,
      lastUpdated: "2024-03-14",
      type: "Coastal"
    },
    {
      id: "STN-005",
      name: "Mountain Spring Source",
      region: "Northern Region",
      area: "Highland Valley",
      status: "Safe",
      waterQuality: 95,
      alerts: 0,
      lastUpdated: "2024-03-13",
      type: "Spring"
    },
    {
      id: "STN-006",
      name: "Urban Reservoir Center",
      region: "Central Region",
      area: "Metro City",
      status: "Warning",
      waterQuality: 45,
      alerts: 2,
      lastUpdated: "2024-03-15",
      type: "Reservoir"
    },
    {
      id: "STN-007",
      name: "Agricultural Zone Monitor",
      region: "Western Region",
      area: "Farmland District",
      status: "Safe",
      waterQuality: 72,
      alerts: 1,
      lastUpdated: "2024-03-12",
      type: "Agricultural"
    },
    {
      id: "STN-008",
      name: "Desert Oasis Station",
      region: "Southern Region",
      area: "Arid Zone",
      status: "Contaminated",
      waterQuality: 28,
      alerts: 4,
      lastUpdated: "2024-03-15",
      type: "Oasis"
    },
  ]);

  const [editingStation, setEditingStation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newStation, setNewStation] = useState({
    id: "",
    name: "",
    region: "",
    area: "",
    status: "Safe",
    waterQuality: 0,
    alerts: 0,
    type: "River"
  });

  const regions = ["All", "Northern Region", "Western Region", "Eastern Region", "Southern Region", "Central Region"];
  const statuses = ["All", "Safe", "Warning", "Contaminated"];
  const types = ["All", "River", "Lake", "Industrial", "Coastal", "Spring", "Reservoir", "Agricultural", "Oasis"];

  /* =====================
     FILTERED STATIONS
  ===================== */
  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = !selectedRegion || selectedRegion === "All" || station.region === selectedRegion;
    const matchesStatus = !selectedStatus || selectedStatus === "All" || station.status === selectedStatus;
    const matchesType = !selectedType || selectedType === "All" || station.type === selectedType;
    
    return matchesSearch && matchesRegion && matchesStatus && matchesType;
  });

  /* =====================
     STATS CALCULATION
  ===================== */
  const stats = {
    total: stations.length,
    safe: stations.filter(s => s.status === "Safe").length,
    warning: stations.filter(s => s.status === "Warning").length,
    contaminated: stations.filter(s => s.status === "Contaminated").length,
    avgQuality: (stations.reduce((acc, s) => acc + s.waterQuality, 0) / stations.length).toFixed(1),
    totalAlerts: stations.reduce((acc, s) => acc + s.alerts, 0)
  };

  /* =====================
     DELETE STATION
  ===================== */
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this station? This action cannot be undone.")) {
      setStations(stations.filter((s) => s.id !== id));
    }
  };

  /* =====================
     SAVE EDIT
  ===================== */
  const handleSaveEdit = () => {
    if (editingStation) {
      setStations((prev) =>
        prev.map((s) => (s.id === editingStation.id ? editingStation : s))
      );
      setEditingStation(null);
    }
  };

  /* =====================
     ADD NEW STATION
  ===================== */
  const handleAddNew = () => {
    if (!newStation.id || !newStation.name || !newStation.region || !newStation.area) {
      alert("Please fill in all required fields (ID, Name, Region, Area)");
      return;
    }

    if (stations.some(s => s.id === newStation.id)) {
      alert("Station ID already exists. Please use a unique ID.");
      return;
    }

    setStations([...stations, { ...newStation }]);
    setIsAddingNew(false);
    setNewStation({
      id: "",
      name: "",
      region: "",
      area: "",
      status: "Safe",
      waterQuality: 0,
      alerts: 0,
      type: "River"
    });
  };

  /* =====================
     EXPORT DATA
  ===================== */
  const handleExport = () => {
    const dataStr = JSON.stringify(filteredStations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'water_stations_data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  /* =====================
     REFRESH DATA
  ===================== */
  const handleRefresh = () => {
    // Simulate data refresh
    setSearchTerm("");
    setSelectedRegion("");
    setSelectedStatus("");
    setSelectedType("");
  };

  /* =====================
     GET STATUS BADGE STYLE
  ===================== */
  const getStatusStyle = (status) => {
    switch(status) {
      case "Safe": return "bg-green-100 text-green-800 border-green-200";
      case "Warning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Contaminated": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  /* =====================
     GET TYPE ICON
  ===================== */
  const getTypeIcon = (type) => {
    switch(type) {
      case "River": return <FaWater className="text-blue-600" />;
      case "Lake": return <FaWater className="text-cyan-600" />;
      case "Industrial": return <FaExclamationTriangle className="text-orange-600" />;
      case "Coastal": return <FaWater className="text-teal-600" />;
      case "Spring": return <FaWater className="text-emerald-600" />;
      case "Reservoir": return <FaWater className="text-indigo-600" />;
      case "Agricultural": return <FaWater className="text-lime-600" />;
      case "Oasis": return <FaWater className="text-amber-600" />;
      default: return <FaWater className="text-gray-600" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white p-4 md:p-6">
      {/* Header Section - Clean & White */}
      <div className="mb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Monitoring Stations</h2>
            <p className="text-gray-600 text-sm">Manage all water quality stations</p>
          </div>
          
          <div className="flex gap-2 mt-2 md:mt-0">
            <button
              onClick={() => setIsAddingNew(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg text-white font-medium transition-all duration-200 text-sm shadow-sm"
            >
              <FaPlus size={12} /> Add Station
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-gray-700 font-medium transition-all duration-200 text-sm shadow-sm"
            >
              <FaDownload size={12} /> Export
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-gray-700 font-medium transition-all duration-200 text-sm shadow-sm"
              title="Refresh Data"
            >
              <FaSync size={12} />
            </button>
          </div>
        </div>

        {/* Stats Cards - Clean White Design */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium">TOTAL</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <FaMapMarkerAlt className="text-blue-600 text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium">SAFE</p>
                <p className="text-2xl font-bold text-green-600">{stats.safe}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <FaCheckCircle className="text-green-600 text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-yellow-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium">WARNING</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.warning}</p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <FaExclamationTriangle className="text-yellow-600 text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-red-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium">CONTAMINATED</p>
                <p className="text-2xl font-bold text-red-600">{stats.contaminated}</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <FaTimesCircle className="text-red-600 text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-cyan-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium">AVG WQI</p>
                <p className="text-2xl font-bold text-cyan-600">{stats.avgQuality}</p>
              </div>
              <div className="p-2 bg-cyan-50 rounded-lg">
                <FaWater className="text-cyan-600 text-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters - Clean Design */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4">
          <div className="flex flex-col lg:flex-row gap-3 mb-3">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search stations by ID, name, or area..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <select
                className="px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="">All Regions</option>
                {regions.filter(r => r !== "All").map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>

              <select
                className="px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Status</option>
                {statuses.filter(s => s !== "All").map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                className="px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Types</option>
                {types.filter(t => t !== "All").map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-sm">
              Showing <span className="text-gray-800 font-semibold">{filteredStations.length}</span> of <span className="text-gray-800 font-semibold">{stations.length}</span> stations
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedRegion("");
                setSelectedStatus("");
                setSelectedType("");
              }}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1.5 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <FaFilter size={12} /> Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stations Table - MAXIMIZED with White Theme */}
      <div className="flex-1 overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="overflow-x-auto h-full">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                <th className="py-4 px-6 text-left text-gray-600 font-semibold text-sm uppercase tracking-wider">Station ID</th>
                <th className="py-4 px-6 text-left text-gray-600 font-semibold text-sm uppercase tracking-wider">Name & Type</th>
                <th className="py-4 px-6 text-left text-gray-600 font-semibold text-sm uppercase tracking-wider">Location</th>
                <th className="py-4 px-6 text-left text-gray-600 font-semibold text-sm uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-left text-gray-600 font-semibold text-sm uppercase tracking-wider">Water Quality</th>
                <th className="py-4 px-6 text-left text-gray-600 font-semibold text-sm uppercase tracking-wider">Alerts</th>
                <th className="py-4 px-6 text-left text-gray-600 font-semibold text-sm uppercase tracking-wider">Last Updated</th>
                <th className="py-4 px-6 text-left text-gray-600 font-semibold text-sm uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStations.map((station) => (
                <tr
                  key={station.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-5 px-6">
                    <span className="font-mono text-blue-600 font-semibold text-sm">{station.id}</span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getTypeIcon(station.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{station.name}</p>
                        <p className="text-gray-500 text-xs">{station.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div>
                      <p className="text-gray-900 text-sm font-medium">{station.area}</p>
                      <p className="text-gray-500 text-xs">{station.region}</p>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusStyle(station.status)}`}>
                      {station.status}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold text-sm ${station.waterQuality > 70 ? 'text-green-600' : station.waterQuality > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {station.waterQuality}
                      </span>
                      <div className="w-32 bg-gray-200 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${station.waterQuality > 70 ? 'bg-green-500' : station.waterQuality > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(station.waterQuality, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${station.alerts > 0 ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-green-100 text-green-800 border border-green-200'}`}>
                      {station.alerts} alert{station.alerts !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-gray-500 text-sm">
                    {station.lastUpdated}
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onViewStation(station.id)}
                        className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200 border border-blue-100 hover:border-blue-200"
                        title="View Analytics"
                      >
                        <FaEye size={14} />
                      </button>
                      <button
                        onClick={() => setEditingStation(station)}
                        className="p-2.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-colors duration-200 border border-yellow-100 hover:border-yellow-200"
                        title="Edit Station"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(station.id)}
                        className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200 border border-red-100 hover:border-red-200"
                        title="Delete Station"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Empty State */}
          {filteredStations.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-16 px-4">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <FaSearch className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No stations found</h3>
              <p className="text-gray-500 text-center mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRegion("");
                  setSelectedStatus("");
                  setSelectedType("");
                }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors duration-200 shadow-sm"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingStation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Edit Station</h3>
              <button
                onClick={() => setEditingStation(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimesCircle size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Station ID</label>
                <input
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                  value={editingStation.id}
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Station Name</label>
                <input
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                  value={editingStation.name}
                  onChange={(e) =>
                    setEditingStation({ ...editingStation, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Region</label>
                  <input
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                    value={editingStation.region}
                    onChange={(e) =>
                      setEditingStation({ ...editingStation, region: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Area</label>
                  <input
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                    value={editingStation.area}
                    onChange={(e) =>
                      setEditingStation({ ...editingStation, area: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                <select
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                  value={editingStation.status}
                  onChange={(e) =>
                    setEditingStation({ ...editingStation, status: e.target.value })
                  }
                >
                  <option value="Safe">Safe</option>
                  <option value="Warning">Warning</option>
                  <option value="Contaminated">Contaminated</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Water Quality Index</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="flex-1"
                    value={editingStation.waterQuality}
                    onChange={(e) =>
                      setEditingStation({ ...editingStation, waterQuality: parseInt(e.target.value) })
                    }
                  />
                  <span className="text-lg font-bold text-gray-800 min-w-[50px]">{editingStation.waterQuality}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-8">
              <button
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors duration-200 text-sm border border-gray-300"
                onClick={() => setEditingStation(null)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg text-white font-medium transition-all duration-200 text-sm shadow-sm"
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Station Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Add New Station</h3>
              <button
                onClick={() => setIsAddingNew(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimesCircle size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Station ID *</label>
                <input
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                  placeholder="e.g., STN-009"
                  value={newStation.id}
                  onChange={(e) => setNewStation({...newStation, id: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Station Name *</label>
                <input
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                  placeholder="Enter station name"
                  value={newStation.name}
                  onChange={(e) => setNewStation({...newStation, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Region *</label>
                  <select
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                    value={newStation.region}
                    onChange={(e) => setNewStation({...newStation, region: e.target.value})}
                  >
                    <option value="">Select Region</option>
                    {regions.filter(r => r !== "All").map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Area *</label>
                  <input
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                    placeholder="City/District"
                    value={newStation.area}
                    onChange={(e) => setNewStation({...newStation, area: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <select
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                    value={newStation.status}
                    onChange={(e) => setNewStation({...newStation, status: e.target.value})}
                  >
                    <option value="Safe">Safe</option>
                    <option value="Warning">Warning</option>
                    <option value="Contaminated">Contaminated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
                  <select
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                    value={newStation.type}
                    onChange={(e) => setNewStation({...newStation, type: e.target.value})}
                  >
                    {types.filter(t => t !== "All").map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Initial Water Quality</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="flex-1"
                    value={newStation.waterQuality}
                    onChange={(e) => setNewStation({...newStation, waterQuality: parseInt(e.target.value)})}
                  />
                  <span className="text-lg font-bold text-gray-800 min-w-[50px]">{newStation.waterQuality}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-8">
              <button
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors duration-200 text-sm border border-gray-300"
                onClick={() => setIsAddingNew(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg text-white font-medium transition-all duration-200 text-sm shadow-sm"
                onClick={handleAddNew}
              >
                Add Station
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
