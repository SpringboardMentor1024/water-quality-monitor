// src/pages/MonitorProfile.js
import React from 'react';
import { FiDroplet, FiCheckCircle, FiAlertTriangle, FiArrowRight, FiMapPin, FiLogIn } from 'react-icons/fi';

const MonitorProfile = ({ onSwitchToLogin, onSwitchToRegister }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-4 text-slate-100">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-8 w-full max-w-lg shadow-2xl">
                
                {/* --- Project Logo and Title --- */}
                <header className="flex flex-col items-center mb-8">
                        {/* Placeholder for the Water Droplet Logo */}
                    <FiDroplet className="w-16 h-16 text-cyan-400 mb-3" />
                    <h1 className="text-4xl font-extrabold text-slate-50">
                        Water Quality Monitor
                    </h1>
                    <p className="text-md text-slate-400 mt-1 text-center">
                        Real-time intelligence for safer water management.
                    </p>
                </header>

                {/* --- Project Information --- */}
                <section className="space-y-4 mb-8">
                    <h3 className="text-xl font-semibold border-b border-slate-700 pb-2">Our Mission</h3>
                    <p className="text-slate-300 text-sm">
                        This system provides continuous monitoring of critical water parameters across multiple locations. We aim to deliver instant insights and proactive alerts to ensure water safety and optimize resource management.
                    </p>
                    
                    {/* Key Features List */}
                    <ul className="space-y-2 pt-2">
                        <li className="flex items-start gap-2">
                            <FiCheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Real-time pH, Turbidity, and Temperature tracking.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <FiAlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Automated alerts for critical threshold breaches.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <FiMapPin className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Geospatial visualization of sensor locations.</span>
                        </li>
                    </ul>
                </section>

                {/* --- Navigation Buttons (Action Area) --- */}
                <div className="flex flex-col space-y-3">
                    <button 
                        onClick={onSwitchToLogin} 
                        className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold rounded-md transition duration-150 flex items-center justify-center gap-2"
                    >
                        <FiLogIn /> Monitor Login
                    </button>
                    <button 
                        onClick={onSwitchToRegister} 
                        className="w-full py-3 px-4 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-50 font-semibold rounded-md transition duration-150 flex items-center justify-center gap-2"
                    >
                        <FiArrowRight /> New User Registration
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MonitorProfile;