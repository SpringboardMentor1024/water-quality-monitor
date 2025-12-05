import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // ✅ use inside the component

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Password reset successfully!");
      } else {
        alert(data.message || "Reset failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleReset} className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded bg-gray-700 text-white"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded bg-gray-700 text-white"
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded hover:bg-yellow-500"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
