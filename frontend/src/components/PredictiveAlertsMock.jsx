import { Zap, AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { analyzeStationAlerts } from "../utils/api";

export default function PredictiveAlertsMock({ stationId }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAlerts = async () => {
    if (!stationId) return;

    try {
      setLoading(true);
      setError(null);

      const data = await analyzeStationAlerts(stationId);

      let normalized = [];

      if (Array.isArray(data?.alerts)) {
        normalized = data.alerts;
      } else if (Array.isArray(data)) {
        normalized = data;
      } else if (data && typeof data === "object") {
        normalized = [data];
      }

      setAlerts(normalized);
    } catch (err) {
      console.error("Predictive alert fetch failed:", err);
      setError("Unable to load predictive alerts");
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationId]);

  return (
    <div className="space-y-6 mt-10">
      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4">
        Predictive Alerts (AI Generated)
      </h3>

      {loading && (
        <div className="flex items-center gap-2 text-slate-400 px-4">
          <Loader2 className="animate-spin w-4 h-4" />
          Fetching predictive alerts...
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm px-4">
          {error}
        </div>
      )}

      {!loading && !error && alerts.length === 0 && (
        <div className="text-slate-400 text-sm px-4">
          No predictive risks detected for this station.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {alerts.map((alert, index) => (
          <AlertCard key={index} alert={alert} />
        ))}
      </div>
    </div>
  );
}

const AlertCard = ({ alert }) => {
  const isHigh = alert?.risk_level === "high";

  return (
    <div
      className={`bg-white p-10 rounded-[50px] shadow-sm border-t-8 h-64 flex flex-col justify-between ${
        isHigh ? "border-orange-500" : "border-yellow-400"
      }`}
    >
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-black text-slate-900 uppercase">
          {alert?.status || "Risk Analysis"}
        </h4>
        {isHigh ? (
          <AlertTriangle className="text-orange-500" />
        ) : (
          <Zap className="text-yellow-500" />
        )}
      </div>

      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase">
          Parameter
        </p>
        <p className="text-sm font-bold">
          {alert?.parameter || "Overall Health"}
        </p>
      </div>

      <p className="text-[9px] font-black text-slate-300 uppercase">
        {alert?.horizon || "Next few days"}
      </p>

      <p className="text-xs text-slate-500 leading-relaxed">
        {alert?.message || "No abnormal patterns detected."}
      </p>
    </div>
  );
};
