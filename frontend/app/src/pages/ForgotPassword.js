import React, { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSendResetLink = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Reset link sent! Check your email.");
      } else {
        alert(data.message || "Failed to send reset link");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded bg-gray-700 text-white"
        />
        <button
          onClick={handleSendResetLink}
          className="w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded hover:bg-yellow-500"
        >
          Send Reset Link
        </button>

        {/* Add the "Remembered your password? Sign in" link here */}
        <p className="text-gray-300 mt-4 text-sm text-center">
          Remembered your password?{" "}
          <a href="/login" className="text-yellow-400 font-bold hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
