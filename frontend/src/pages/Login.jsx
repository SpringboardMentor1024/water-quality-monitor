import { useState } from "react";
import { loginUser } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Using the mock login from our updated api.js
      const res = await loginUser(formData.email, formData.password);
      localStorage.setItem("authToken", res.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
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
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-xl shadow-lg transition-all mt-4">
            Sign In to Monitor
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-blue-50 space-y-3">
          <p onClick={() => navigate("/register")} className="text-blue-600 text-center cursor-pointer hover:underline text-sm font-medium">
            New user? Create an account
          </p>
          {/* Back Navigation to Profile */}
          <button onClick={() => navigate("/monitor-profile")} className="w-full text-gray-400 hover:text-blue-600 text-xs font-bold uppercase tracking-widest transition-colors">
            ← Back to Mission Details
          </button>
        </div>
      </div>
    </div>
  );
}