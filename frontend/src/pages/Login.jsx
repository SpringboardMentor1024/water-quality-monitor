import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.access_token) {
        setError(data.message || "Invalid credentials");
        return;
      }

      // ✅ STORE TOKEN CONSISTENTLY
      localStorage.setItem("access", data.access_token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Server error, please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4FBFD]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow border border-[#C4E1E6]">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">
          Water Quality Monitor
        </h2>

        {error && (
          <div className="text-red-600 text-sm mb-3 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-[#4FA3B5] text-white py-2 rounded-lg"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#4FA3B5] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
