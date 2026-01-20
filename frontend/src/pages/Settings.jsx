import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";



export default function Settings() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const userId = localStorage.getItem("userId");

  const BACKEND_URL = "http://127.0.0.1:8000";

  // ---------------- STATES ----------------
  const [email, setEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [emailErr, setEmailErr] = useState("");

  const [password, setPassword] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [passErr, setPassErr] = useState("");

  const [notificationsEnabled, setNotificationsEnabled] = useState(localStorage.getItem("notifications") === "true");
  const [refreshInterval, setRefreshInterval] = useState(localStorage.getItem("refreshInterval") || "30");

  const applyTheme = (value) => {
    if (value === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  // ---------------- EMAIL UPDATE ----------------
  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setEmailMsg("");
    setEmailErr("");

    if (!email) return setEmailErr("Please enter a valid email");

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/update-email`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ new_email: email })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Email update failed");

      setEmailMsg("✅ Email updated successfully");
      setEmail("");
    } catch (err) {
      setEmailErr(err.message);
    }
  };

  // ---------------- PASSWORD UPDATE ----------------
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPassMsg("");
    setPassErr("");

    if (!password || password.length < 8) return setPassErr("Password must be at least 8 characters");

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/update-password`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ new_password: password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Password update failed");

      setPassMsg("✅ Password updated successfully");
      setPassword("");
    } catch (err) {
      setPassErr(err.message);
    }
  };

 
  // ---------------- NOTIFICATIONS ----------------
  const toggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem("notifications", newValue);
  };

  // ---------------- DATA REFRESH ----------------
  const handleRefreshChange = (value) => {
    setRefreshInterval(value);
    localStorage.setItem("refreshInterval", value);
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold mb-4">⚙️ Settings</h1>

      {/* CHANGE EMAIL */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">📧 Change Email</h2>
        {emailMsg && <p className="text-green-600 mb-2">{emailMsg}</p>}
        {emailErr && <p className="text-red-600 mb-2">{emailErr}</p>}
        <form onSubmit={handleEmailUpdate} className="space-y-3">
          <input type="email" placeholder="New email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded-lg" required />
          <button className="bg-[#4FA3B5] text-white px-4 py-2 rounded-lg">Update Email</button>
        </form>
      </div>

      {/* CHANGE PASSWORD */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">🔒 Change Password</h2>
        {passMsg && <p className="text-green-600 mb-2">{passMsg}</p>}
        {passErr && <p className="text-red-600 mb-2">{passErr}</p>}
        <form onSubmit={handlePasswordUpdate} className="space-y-3">
          <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded-lg" required />
          <button className="bg-[#4FA3B5] text-white px-4 py-2 rounded-lg">Update Password</button>
        </form>
      </div>


      {/* NOTIFICATIONS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">🔔 Notifications</h2>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={notificationsEnabled} onChange={toggleNotifications} className="w-5 h-5 accent-[#4FA3B5]" />
          Enable water quality alerts
        </label>
      </div>

      {/* DATA REFRESH */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">⏱ Data Refresh Interval</h2>
        <select value={refreshInterval} onChange={(e) => handleRefreshChange(e.target.value)} className="border rounded-lg p-2">
          <option value="15">Every 15 seconds</option>
          <option value="30">Every 30 seconds</option>
          <option value="60">Every 1 minute</option>
          <option value="300">Every 5 minutes</option>
        </select>
      </div>

      {/* LOGOUT */}
      <div className="bg-white p-6 rounded-xl shadow">
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg w-full">Logout</button>
      </div>
    </div>
  );
}
