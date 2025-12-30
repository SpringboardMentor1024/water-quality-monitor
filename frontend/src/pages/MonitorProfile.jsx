import React from "react";
import { useNavigate } from "react-router-dom";

const MonitorProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-xl border border-blue-100 flex flex-col items-center">
        
        {/* 1. Header Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-blue-400 flex items-center justify-center bg-blue-50">
             <span className="text-4xl text-blue-600">💧</span>
          </div>
        </div>

        {/* 2. Brand Title */}
        <h1 className="text-4xl font-black text-blue-900 mb-2 text-center">
          Water Quality Monitor
        </h1>
        <p className="text-blue-600 font-semibold mb-10 text-center tracking-wide uppercase text-sm">
          Real-time intelligence for safer water management
        </p>

        {/* 3. Mission Section */}
        <div className="w-full text-left space-y-6">
          <div className="border-b border-blue-100 pb-2">
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tighter">Our Mission</h2>
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed italic">
            This system provides continuous monitoring of critical water parameters across multiple locations. 
            We aim to deliver instant insights and proactive alerts to ensure water safety and optimize resource management.
          </p>

          {/* 4. Features List */}
          <ul className="space-y-4">
            <li className="flex items-center gap-4 text-sm font-medium text-gray-700 bg-blue-50/50 p-2 rounded-lg">
              <span className="text-green-600 text-lg">✅</span>
              Real-time pH, Turbidity, and Temperature tracking.
            </li>
            <li className="flex items-center gap-4 text-sm font-medium text-gray-700 bg-blue-50/50 p-2 rounded-lg">
              <span className="text-yellow-600 text-lg">⚠️</span>
              Automated alerts for critical threshold breaches.
            </li>
            <li className="flex items-center gap-4 text-sm font-medium text-gray-700 bg-blue-50/50 p-2 rounded-lg">
              <span className="text-blue-600 text-lg">📍</span>
              Geospatial visualization of sensor locations.
            </li>
          </ul>
        </div>

        {/* 5. Navigation Buttons */}
        <div className="w-full mt-12 space-y-4">
          <button 
            onClick={() => navigate("/login")}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            → Monitor Login
          </button>
          
          <button 
            onClick={() => navigate("/register")}
            className="w-full bg-white border-2 border-blue-100 hover:border-blue-300 text-blue-800 font-bold py-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            → New User Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonitorProfile;