import React, { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your registered email address.");
      return;
    }

    // Simulate backend email verification / reset link
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4FBFD]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow border border-[#C4E1E6]">
        <h2 className="text-2xl font-bold text-center text-[#4FA3B5] mb-4">
          Forgot Password
        </h2>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Registered Email
              </label>
              <input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FC8D6]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#4FA3B5] text-white py-2 rounded-lg hover:bg-[#3D91A3] transition"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center text-gray-700">
            <p className="text-lg font-semibold mb-2">
              ✅ Reset Link Sent Successfully!
            </p>
            <p className="text-sm text-gray-500">
              Please check your email inbox for a password reset link.
            </p>
          </div>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          <a
            href="/login"
            className="text-[#4FA3B5] font-medium hover:underline"
          >
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}
