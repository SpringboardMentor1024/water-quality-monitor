import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // OAuth2 requires FORM DATA
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();

      // ✅ STORE CORRECTLY
      localStorage.setItem("access", data.access_token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("isLoggedIn", "true");
      console.log("LOGIN RESPONSE:", data);

      localStorage.setItem("access", data.access_token);
      localStorage.setItem("role", data.role);

      console.log("AFTER SAVE access:", localStorage.getItem("access"));

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4FBFD]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow border border-[#C4E1E6]">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">
          Water Quality Monitor
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-2 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-2 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4FA3B5] text-white py-2 rounded-lg hover:bg-[#3D91A3] disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
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
