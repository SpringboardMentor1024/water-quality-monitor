import { useState } from "react";

export default function Register({ onSwitch }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Register submitted (demo)");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-sky-200 to-sky-400 px-4">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-xl p-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-sky-100 flex items-center justify-center mb-3">
            <span className="text-4xl text-sky-600">💧</span>
          </div>
          <h1 className="text-3xl font-bold text-sky-700">AquaSense</h1>
          <p className="mt-2 text-sm md:text-base text-gray-500 text-center">
            Monitor &amp; Manage real-time water quality
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-sky-900 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full px-3 py-2 rounded-xl border border-sky-200 bg-sky-50 focus:ring-2 
                         focus:ring-sky-400 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-sky-900 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="john.doe@example.com"
              className="w-full px-3 py-2 rounded-xl border border-sky-200 bg-sky-50 focus:ring-2 
                         focus:ring-sky-400 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-sky-900 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
              className="w-full px-3 py-2 rounded-xl border border-sky-200 bg-sky-50 focus:ring-2 
                         focus:ring-sky-400 outline-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-sky-900 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="City, Country"
              className="w-full px-3 py-2 rounded-xl border border-sky-200 bg-sky-50 focus:ring-2 
                         focus:ring-sky-400 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-sky-700 text-white font-semibold hover:bg-sky-800 transition"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs md:text-sm text-gray-500">
          Already have an account?{" "}
          <button onClick={onSwitch} className="text-sky-600 font-semibold">Log In</button>
        </p>

      </div>
    </div>
  );
}
