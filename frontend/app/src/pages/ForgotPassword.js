import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendResetLink = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    // Email format validation
    const validEmail = /\S+@\S+\.\S+/.test(email);
    if (!validEmail) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Reset link sent! Check your email.");
        setEmail("");
      } else {
        toast.error(data.message || "Failed to send reset link");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <ToastContainer position="top-right" autoClose={3000} />
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
          disabled={loading}
          className="w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded hover:bg-yellow-500 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="text-gray-300 mt-4 text-sm text-center">
          Remembered your password?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-yellow-400 font-bold hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
