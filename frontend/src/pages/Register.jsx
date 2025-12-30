import { useState } from "react";
import { registerUser } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", role: "citizen", location: "", password: "" });
  const [message, setMessage] = useState("");
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(formData);
      if (res) {
        setMessage("Registration successful! Redirecting...");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      setErr("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-4 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-blue-100">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-2">WaterWatch</h2>
        <h3 className="text-lg text-gray-500 mb-8 text-center font-medium">Create Account</h3>

        {message && <p className="text-green-600 text-sm mb-4 text-center bg-green-50 p-2 rounded">{message}</p>}
        {err && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded">{err}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Full Name" className="w-full p-3 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email Address" className="w-full p-3 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500" onChange={handleChange} required />
          <input name="location" placeholder="Assigned Region/Location" className="w-full p-3 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500" onChange={handleChange} required />
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">User Role</label>
            <select name="role" className="w-full p-3 border border-blue-100 rounded-xl bg-white focus:ring-2 focus:ring-blue-500" onChange={handleChange}>
              <option value="citizen">Citizen</option>
              <option value="ngo">NGO Member</option>
              <option value="authority">Government Authority</option>
              <option value="admin">System Admin</option>
            </select>
          </div>

          <input name="password" type="password" placeholder="Password" className="w-full p-3 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500" onChange={handleChange} required />

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-xl shadow-lg mt-4 transition-all">
            Register Account
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-blue-50 space-y-3 text-center">
          <p onClick={() => navigate("/login")} className="text-blue-600 cursor-pointer hover:underline text-sm font-medium">
            Already registered? Login here
          </p>
          <button onClick={() => navigate("/monitor-profile")} className="text-gray-400 hover:text-blue-600 text-xs font-bold uppercase tracking-widest">
            ← Back to Mission Details
          </button>
        </div>
      </div>
    </div>
  );
}
