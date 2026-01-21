import { Zap, AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function PredictiveAlertsMock({ stationId }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ MOCK DATA - No API calls, no 404s
  const MOCK_ALERTS = [
    {
      status: "pH Stability",
      parameter: "pH Level",
      risk_level: "low",
      horizon: "Next 24h",
      message: "pH levels maintaining optimal range (6.8-8.2)"
    },
    {
      status: "Turbidity Warning", 
      parameter: "Turbidity",
      risk_level: "medium",
      horizon: "Next 48h",
      message: "Slight turbidity increase detected. Monitor closely."
    }
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setAlerts(MOCK_ALERTS);
      setLoading(false);
    }, 800);
  }, [stationId]);

  return (
    <div className="space-y-6 mt-10">
      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4">
        Predictive Alerts (AI Generated)
      </h3>

      {loading && (
        <div className="flex items-center gap-2 text-slate-400 px-4">
          <Loader2 className="animate-spin w-4 h-4" />
          Analyzing patterns...
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
  const isHigh = alert?.risk_level === "high" || alert?.risk_level === "medium";

  return (
    <div
      className={`bg-white p-10 rounded-[50px] shadow-sm border-t-8 h-64 flex flex-col justify-between hover:shadow-xl transition-all ${
        isHigh ? "border-orange-500" : "border-emerald-500"
      }`}
    >
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-black text-slate-900 uppercase">
          {alert?.status || "Risk Analysis"}
        </h4>
        {isHigh ? (
          <AlertTriangle className="text-orange-500 w-8 h-8" />
        ) : (
          <Zap className="text-emerald-500 w-8 h-8" />
        )}
      </div>

      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
          Parameter
        </p>
        <p className="text-sm font-bold text-slate-900">
          {alert?.parameter || "Overall Health"}
        </p>
      </div>

      <p className="text-[9px] font-black text-slate-300 uppercase">
        {alert?.horizon || "Next few days"}
      </p>

      <p className="text-xs text-slate-600 leading-relaxed flex-1">
        {alert?.message || "No abnormal patterns detected."}
      </p>
    </div>
  );
}
