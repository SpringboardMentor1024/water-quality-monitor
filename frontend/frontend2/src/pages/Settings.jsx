import { useState } from "react";

export default function Settings() {
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("");

  const handleEmailUpdate = (e) => {
    e.preventDefault();
    alert("Email updated (temporary frontend)");
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    alert("Password updated (temporary frontend)");
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {/* CHANGE EMAIL */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Change Email</h2>
        <form onSubmit={handleEmailUpdate} className="space-y-3">
          <input
            type="email"
            className="w-full p-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="bg-[#4FA3B5] text-white px-4 py-2 rounded-lg">
            Update Email
          </button>
        </form>
      </div>

      {/* CHANGE PASSWORD */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordUpdate} className="space-y-3">
          <input
            type="password"
            className="w-full p-2 border rounded-lg"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="bg-[#4FA3B5] text-white px-4 py-2 rounded-lg">
            Update Password
          </button>
        </form>
      </div>

      {/* LOGOUT */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Session</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
