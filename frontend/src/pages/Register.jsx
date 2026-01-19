import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/auth/register",
        {
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }
      );

      if (res.status === 200) {
        alert("Registration successful!");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      alert("Registration failed. Try again!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4FBFD]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow border border-[#C4E1E6]">

        <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
              required
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
              required
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Register as
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
              required
            >
              <option value="">Select role</option>
              <option value="ngo">NGO</option>
              <option value="user">User</option>
            </select>
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="w-full bg-[#4FA3B5] text-white py-2 rounded-lg hover:bg-[#3D91A3]"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#4FA3B5] font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
