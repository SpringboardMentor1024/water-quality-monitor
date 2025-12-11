import { useState } from "react";
import waterIcon from "../assets/water.png";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    location: "",
  });

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    setServerError("");
  };

  const simpleValidate = () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword || !form.role || !form.location)
      return "All fields are required.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword)
      return "Passwords do not match.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = simpleValidate();
    if (err) return setServerError(err);

    setLoading(true);
    setTimeout(() => {
      navigate("/login");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-gray-500 to-gray-500 p-4">

      <div className="backdrop-blur-xl bg-white/20 border border-white/30
       shadow-2xl p-6 md:p-10 rounded-3xl w-full max-w-sm md:max-w-md">

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br
           from-gray-300 to-green-100 flex items-center justify-center">
            <img src={waterIcon} alt="logo" className="w-12 h-12" />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-center text-black mb-1">
          WaterWatch
        </h1>

        <p className="text-center text-black-200 text-sm md:text-base mb-6">
          Access real-time water quality data
        </p>

        {serverError && (
          <div className="bg-red-200/40 text-red-900 px-4 py-3 rounded mb-4 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/30 
            placeholder-gray-100 text-black text-sm md:text-base
            focus:outline-none focus:ring-2 focus:ring-black-300"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/30 
            placeholder-gray-100 text-black text-sm md:text-base
            focus:outline-none focus:ring-2 focus:ring-black-300"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/30 
            placeholder-gray-100 text-black text-sm md:text-base
            focus:outline-none focus:ring-2 focus:ring-black-300"
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/30 
            placeholder-gray-100 text-black text-sm md:text-base
            focus:outline-none focus:ring-2 focus:ring-black-300"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/30 
            text-white text-sm md:text-base focus:outline-none 
            focus:ring-2 focus:ring-black-300"
          >
            <option className="text-black">Select your role</option>
            <option className="text-black">Student</option>
            <option className="text-black">Researcher</option>
            <option className="text-black">Admin</option>
          </select>

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/30 
            placeholder-gray-100 text-black text-sm md:text-base
            focus:outline-none focus:ring-2 focus:ring-black-300"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-blue-400 to-blue-500
            text-black font-semibold py-3 rounded-xl shadow-lg text-sm md:text-base 
            hover:opacity-60 transition disabled:bg-gray-400 cursor-pointer"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="text-center text-black-100 text-sm md:text-base mt-4">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
