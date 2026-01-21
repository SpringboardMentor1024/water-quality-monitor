import { useState } from "react";
import { loginUser } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      console.log("🔄 LOGGING IN:", formData); // DEBUG
      const res = await loginUser(formData.email, formData.password);
      console.log("✅ LOGIN SUCCESS:", res); // DEBUG
      
      // Store token properly
      localStorage.setItem("authToken", res.access_token || res.token);
      localStorage.setItem("userRole", res.role || "citizen");
      
      // Redirect based on role
      setTimeout(() => {
        const role = res.role || "citizen";
        if (role === "ngo") navigate("/ngo");
        else if (role === "admin") navigate("/admin");
        else navigate("/dashboard");
      }, 1000);
      
    } catch (err) {
      console.error("❌ LOGIN ERROR:", err.response?.data || err.message); // DEBUG
      setError(err.response?.data?.detail || err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-blue-100">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-2">WaterWatch</h2>
        <h3 className="text-lg text-gray-500 mb-8 text-center font-medium">Monitor Login</h3>

        {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@agency.gov"
              className="w-full p-3 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50/30"
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full p-3 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50/30"
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full font-bold p-3 rounded-xl shadow-lg transition-all mt-4 ${
              loading 
                ? 'bg-blue-400 cursor-not-allowed text-white/70' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? "Signing In..." : "Sign In to Monitor"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-blue-50 space-y-3">
          <p onClick={() => navigate("/register")} className="text-blue-600 text-center cursor-pointer hover:underline text-sm font-medium">
            New user? Create an account
          </p>
          <button onClick={() => navigate("/monitor-profile")} className="w-full text-gray-400 hover:text-blue-600 text-xs font-bold uppercase tracking-widest transition-colors">
            ← Back to Mission Details
          </button>
        </div>
      </div>
    </div>
  );
}
