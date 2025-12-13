import BaseMap from "../map/BaseMap";
import StatCard from "../components/StatCard";
import { AlertCircle, FileText, Droplet, Activity } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex-1 overflow-hidden">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">
        Dashboard Overview
      </h1>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Map Section */}
        <div className="lg:col-span-2 bg-[#0f172a] rounded-lg overflow-hidden h-[300px] lg:h-[420px]">
          <BaseMap />
        </div>

        {/* Stats Section */}
        <div className="flex flex-col gap-4">
          <StatCard
            title="Active Alerts"
            value="5"
            subtitle="Currently monitored across stations"
            icon={<AlertCircle />}
          />

          <StatCard
            title="Recent Reports"
            value="12"
            subtitle="Submitted in the last 24 hours"
            icon={<FileText />}
          />

          <StatCard
            title="Stations Online"
            value="87"
            subtitle="Actively transmitting data"
            icon={<Droplet />}
          />

          <StatCard
            title="Water Quality Index"
            value="Good (7.8)"
            subtitle="Average across all active stations"
            icon={<Activity />}
          />

          <button className="mt-2 bg-yellow-300 hover:bg-yellow-400 text-black font-medium py-3 rounded-lg transition">
            + Submit Quick Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
