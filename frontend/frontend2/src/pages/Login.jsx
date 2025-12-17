import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // TEMP LOGIN (backend later)
    if (email && password) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4FBFD]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow border border-[#C4E1E6]">

        <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">
          Water Quality Monitor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FC8D6]"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FC8D6]"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* FORGOT PASSWORD */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-[#4FA3B5] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full bg-[#4FA3B5] text-white py-2 rounded-lg hover:bg-[#3D91A3] transition"
          >
            Login
          </button>
        </form>

        {/* REGISTER LINK */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-[#4FA3B5] font-medium hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}
