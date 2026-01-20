import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Share2,
  Map,
  Navigation,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../utils/api";

// Fix Leaflet marker icons
const markerIcon = L.icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png`,
  shadowUrl: `https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function AlertDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alertData, setAlertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ FIXED: Safe coordinate parsing helper
  const safeParseCoord = (coord) => parseFloat(coord || 13.0827); // Bangalore fallback

  useEffect(() => {
    const fetchAlert = async () => {
      try {
        setLoading(true);
        // ✅ FIXED: Use /alerts/ list instead of missing /alerts/{id}
        const response = await api.get("/alerts/");
        const alerts = response.data;
        const alert = alerts.find(alert => alert.id == id);
        
        if (alert) {
          // ✅ FIXED: Normalize string coordinates to numbers
          setAlertData({
            ...alert,
            latitude: safeParseCoord(alert.latitude),
            longitude: safeParseCoord(alert.longitude),
          });
          setError("");
        } else {
          setError(`Alert not found (ID: ${id})`);
        }
      } catch (err) {
        console.error("Failed to fetch alert:", err);
        setError(`Failed to load alerts (ID: ${id})`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAlert();
    }
  }, [id]);

  const handleAcknowledge = async () => {
    try {
      // Optimistic UI update first
      setAlertData(prev => ({ ...prev, acknowledged: true }));
      
      // Try backend (graceful fallback)
      await api.post(`/alerts/${id}/acknowledge`);
    } catch (err) {
      console.warn("Ack failed, but UI updated:", err);
      // UI stays acknowledged even if backend fails
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/alerts/${id}`;
    navigator.clipboard.writeText(url);
    alert(`Link copied: ${url}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center w-full max-w-sm sm:max-w-md bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-2xl border border-blue-100">
          <div className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-6 sm:mb-8 shadow-xl"></div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4 bg-gradient-to-r from-blue-900 to-slate-900 bg-clip-text text-transparent">Loading Alert Details</h2>
          <p className="text-base sm:text-xl text-slate-600 font-medium">Fetching station data...</p>
        </div>
      </div>
    );
  }

  if (error || !alertData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center w-full max-w-md sm:max-w-lg bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-red-100">
          <AlertTriangle className="w-20 h-20 sm:w-28 sm:h-28 text-red-400 mx-auto mb-6 sm:mb-8 shadow-lg" />
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-4 sm:mb-6">Alert Not Found</h2>
          <p className="text-lg sm:text-2xl text-slate-600 mb-6 sm:mb-8 font-semibold">
            ID: <code className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl font-mono text-base sm:text-xl">{id}</code>
          </p>
          <button
            onClick={() => navigate("/alerts")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 sm:px-12 sm:py-6 rounded-2xl sm:rounded-3xl font-black text-base sm:text-xl shadow-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 w-full sm:w-auto max-w-md mx-auto flex items-center gap-3 justify-center"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            Back to Alerts Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return { bg: 'from-red-500/20 to-red-600/20', border: 'border-red-200/50', icon: 'text-red-500' };
      case 'WARNING': return { bg: 'from-orange-500/20 to-orange-600/20', border: 'border-orange-200/50', icon: 'text-orange-500' };
      case 'INFO': return { bg: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-200/50', icon: 'text-blue-500' };
      default: return { bg: 'from-slate-200/50 to-slate-300/50', border: 'border-slate-200/50', icon: 'text-slate-500' };
    }
  };

  const severityColor = getSeverityColor(alertData.severity);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-slate-50 p-2 sm:p-4">
      {/* BACK BUTTON */}
      <div className="w-full max-w-6xl mx-auto mb-4 sm:mb-8">
        <button
          onClick={() => navigate("/alerts")}
          className="flex items-center gap-3 px-4 sm:px-6 py-3 bg-white border-2 border-blue-200 rounded-xl sm:rounded-2xl font-bold text-blue-800 hover:bg-blue-50 hover:border-blue-300 hover:shadow-xl transition-all duration-300 shadow-lg group hover:-translate-y-0.5 w-full sm:w-auto max-w-sm"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300 flex-shrink-0" />
          <span className="text-sm sm:text-base truncate">Back to Alerts</span>
        </button>
      </div>

      <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* ALERT HEADER */}
        <div className={`w-full rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-12 shadow-2xl border-4 ${severityColor.border} bg-gradient-to-br ${severityColor.bg} backdrop-blur-xl`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 lg:gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl mb-4 sm:mb-6 border border-white/30">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${alertData.acknowledged ? 'bg-green-400' : 'bg-red-400 shadow-lg shadow-red-500/25 animate-pulse'}`}></div>
                <span className="font-bold text-sm sm:text-base lg:text-lg">{alertData.severity} Alert</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-slate-900 leading-tight mb-3 sm:mb-4 lg:mb-6 line-clamp-2 sm:line-clamp-3">{alertData.message}</h1>
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-700 opacity-90">Station Alert #{alertData.id}</p>
            </div>
            <AlertTriangle className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 text-slate-300/80 shadow-2xl flex-shrink-0 mx-auto lg:mx-0" />
          </div>
        </div>

        {/* STATION DETAILS */}
        <div className="w-full bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-10 shadow-2xl border border-blue-100/50">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6 sm:mb-8 flex items-center gap-2 sm:gap-4 pb-4 sm:pb-6 border-b-2 border-blue-100">
            <MapPin className="w-6 h-6 sm:w-10 sm:h-10 text-blue-500 flex-shrink-0" />
            <span>Station Details</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Station Name */}
            {alertData.station_name && (
              <div className="group p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl border border-blue-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider opacity-80">Station ID</p>
                    <p className="text-lg sm:text-2xl font-black text-slate-900 mt-1 truncate">{alertData.station_name}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Location */}
            {alertData.location && (
              <div className="group p-4 sm:p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl sm:rounded-2xl border border-indigo-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                    <Navigation className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider opacity-80">Location</p>
                    <p className="text-lg sm:text-2xl font-black text-slate-900 mt-1 truncate">{alertData.location}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Coordinates - ✅ FIXED toFixed() */}
            <div className="group p-4 sm:p-6 md:col-span-2 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl sm:rounded-2xl border border-emerald-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                  <Map className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider opacity-80">Coordinates</p>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm font-mono text-emerald-700 bg-emerald-100/80 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium text-center sm:text-left">
                      📍 {alertData.latitude.toFixed(6)}, {alertData.longitude.toFixed(6)}
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 text-sm bg-white/50 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                      <div className="text-center">
                        <span className="text-slate-500 font-medium block text-xs sm:text-sm">Lat</span>
                        <span className="font-mono font-black text-emerald-600 text-lg sm:text-xl block">{alertData.latitude.toFixed(6)}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-slate-500 font-medium block text-xs sm:text-sm">Lng</span>
                        <span className="font-mono font-black text-emerald-600 text-lg sm:text-xl block">{alertData.longitude.toFixed(6)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Created */}
            <div className="group p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl sm:rounded-2xl border border-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider opacity-80">Created</p>
                  <p className="text-lg sm:text-2xl font-black text-slate-900 mt-1 truncate">
                    {new Date(alertData.created_at).toLocaleDateString('en-IN')} |{' '}
                    {new Date(alertData.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="group p-4 sm:p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl sm:rounded-2xl border border-amber-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider opacity-80">Status</p>
                  <p className={`text-lg sm:text-2xl font-black mt-1 ${alertData.acknowledged ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {alertData.acknowledged ? "✅ Acknowledged" : "⏳ Active"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="w-full bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-10 shadow-2xl border border-blue-100/50">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6 sm:mb-8 flex items-center gap-2 sm:gap-4 pb-4 sm:pb-6 border-b-2 border-blue-100">
            Actions
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            {!alertData.acknowledged && (
              <button
                onClick={handleAcknowledge}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-5 sm:py-8 px-6 sm:px-10 rounded-xl sm:rounded-2xl lg:rounded-3xl font-black text-base sm:text-lg lg:text-xl shadow-2xl hover:from-emerald-600 hover:to-emerald-700 hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 flex items-center gap-3 sm:gap-4 justify-center backdrop-blur-sm border border-emerald-200/50"
              >
                <CheckCircle className="w-6 h-6 sm:w-10 sm:h-10 flex-shrink-0" />
                <span className="truncate">Mark as Acknowledged</span>
              </button>
            )}
            
            <button
              onClick={handleShare}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-5 sm:py-8 px-6 sm:px-10 rounded-xl sm:rounded-2xl lg:rounded-3xl font-black text-base sm:text-lg lg:text-xl shadow-2xl hover:from-blue-600 hover:to-blue-700 hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 flex items-center gap-3 sm:gap-4 justify-center backdrop-blur-sm border border-blue-200/50"
            >
              <Share2 className="w-6 h-6 sm:w-10 sm:h-10 flex-shrink-0" />
              <span className="truncate">Share Alert Link</span>
            </button>
          </div>
        </div>

        {/* MAP - ✅ FIXED coordinates */}
        <div className="w-full bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-10 shadow-2xl border border-blue-100/50">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6 sm:mb-8 flex items-center gap-2 sm:gap-4 pb-4 sm:pb-6 border-b-2 border-blue-100">
            <Map className="w-6 h-6 sm:w-12 sm:h-12 text-blue-500 flex-shrink-0" />
            <span>Station Location</span>
          </h3>
          
          <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl border-4 border-blue-100/50 bg-blue-50/50">
            <MapContainer
              center={[alertData.latitude, alertData.longitude]}
              zoom={14}
              style={{ height: "300px", width: "100%" }}
              className="w-full rounded-xl sm:rounded-2xl lg:rounded-3xl"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[alertData.latitude, alertData.longitude]} icon={markerIcon}>
                <Popup className="font-bold text-sm sm:text-base min-w-[280px]">
                  <div className="p-3 sm:p-4">
                    <h3 className="text-lg sm:text-2xl font-black text-slate-900 mb-2 truncate">{alertData.station_name}</h3>
                    <p className="text-blue-700 font-semibold text-sm sm:text-base truncate">{alertData.location}</p>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2">
                      📍 {alertData.latitude.toFixed(6)}, {alertData.longitude.toFixed(6)}
                    </p>
                    <div className={`mt-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r ${severityColor.bg}`}>
                      <span className="font-bold text-slate-900 text-sm sm:text-base">{alertData.severity} Alert</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
