import { useState } from "react";
import { registerUser } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "citizen",
    location: "",
    password: "",
  });

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
        setMessage("Registration successful! Please login.");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setErr("Email already registered.");
      } else {
        setErr("Registration failed. Check your details.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-blue-100">
        <h2 className="text-3xl font-semibold text-blue-600 text-center mb-6">
          Water Quality Monitor
        </h2>
        <h3 className="text-xl font-medium text-gray-700 mb-6 text-center">
          Register
        </h3>

        {message && <p className="text-green-600 text-center">{message}</p>}
        {err && <p className="text-red-500 text-center">{err}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg focus:outline-blue-500"
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-blue-500"
            onChange={handleChange}
          />

          <input
            name="location"
            placeholder="Location"
            className="w-full p-3 border rounded-lg focus:outline-blue-500"
            onChange={handleChange}
          />

          <select
            name="role"
            className="w-full p-3 border rounded-lg focus:outline-blue-500"
            onChange={handleChange}
          >
            <option value="citizen">Citizen</option>
            <option value="ngo">NGO</option>
            <option value="authority">Authority</option>
            <option value="admin">Admin</option>
          </select>

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-blue-500"
            onChange={handleChange}
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg">
            Register
          </button>

          <p
            onClick={() => navigate("/login")}
            className="text-blue-600 text-center cursor-pointer hover:underline"
          >
            Already have an account? Login
          </p>
        </form>
      </div>
    </div>
  );
}
