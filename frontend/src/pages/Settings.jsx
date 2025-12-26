import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // EMAIL STATE
  const [email, setEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [emailErr, setEmailErr] = useState("");

  // PASSWORD STATE
  const [password, setPassword] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [passErr, setPassErr] = useState("");

  /* ------------------------
     UPDATE EMAIL
  ------------------------ */
  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setEmailMsg("");
    setEmailErr("");

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/auth/update-email",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: Number(userId),
            new_email: email,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Email update failed");

      setEmailMsg("Email updated successfully");
      setEmail("");
    } catch (err) {
      setEmailErr(err.message);
    }
  };

  /* ------------------------
     UPDATE PASSWORD
  ------------------------ */
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPassMsg("");
    setPassErr("");

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/auth/update-password",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: Number(userId),
            new_password: password,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Password update failed");

      setPassMsg("Password updated successfully");
      setPassword("");
    } catch (err) {
      setPassErr(err.message);
    }
  };

  /* ------------------------
     LOGOUT
  ------------------------ */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {/* CHANGE EMAIL */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Change Email</h2>

        {emailMsg && <p className="text-green-600 mb-2">{emailMsg}</p>}
        {emailErr && <p className="text-red-600 mb-2">{emailErr}</p>}

        <form onSubmit={handleEmailUpdate} className="space-y-3">
          <input
            type="email"
            className="w-full p-2 border rounded-lg"
            placeholder="New email"
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

        {passMsg && <p className="text-green-600 mb-2">{passMsg}</p>}
        {passErr && <p className="text-red-600 mb-2">{passErr}</p>}

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
