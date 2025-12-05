import React from "react";
import { Link } from "react-router-dom";

function Home() {
return ( <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-100 to-blue-100 text-center p-4"> <div className="bg-white p-10 md:p-16 rounded-2xl shadow-2xl max-w-lg w-full"> <h1 className="text-5xl font-extrabold mb-6 text-teal-700">💧 Water Quality Monitor</h1> <p className="text-lg md:text-xl mb-8 text-gray-700">
Monitor and analyze the quality of water in real-time. Stay informed, take action, and ensure clean water for your community. </p>


    <ul className="text-left mb-8 space-y-2 text-gray-600">
      <li>✅ Real-time water quality tracking</li>
      <li>✅ Alerts for contamination or anomalies</li>
      <li>✅ Detailed analytics and reports</li>
      <li>✅ Map view of local water stations</li>
    </ul>

    <div className="flex justify-center gap-4 flex-wrap">
      <Link
        to="/login"
        className="px-8 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="px-8 py-3 bg-teal-100 text-teal-700 rounded-xl font-semibold hover:bg-teal-200 transition"
      >
        Sign Up
      </Link>
    </div>
  </div>
</div>


);
}

export default Home;
