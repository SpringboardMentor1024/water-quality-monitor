import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Registration successful!");
        // Redirect to login page after registration
        navigate("/login", { replace: true });
      } else {
        setError(data.detail || data.message || "Registration failed!");
      }
    } catch (err) {
      console.error(err);
      setError("Server error, please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4FBFD]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow border border-[#C4E1E6]">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">
          Create Your Account
        </h2>

        {error && (
          <div className="text-red-600 text-sm mb-3 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded-lg"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded-lg"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full p-2 border rounded-lg"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select Role</option>
            <option value="ngo">NGO</option>
            <option value="user">User</option>
          </select>
          <button className="w-full bg-[#4FA3B5] text-white py-2 rounded-lg">
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#4FA3B5] font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
