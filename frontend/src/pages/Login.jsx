import { useState } from "react";
import waterIcon from "../assets/water.png";
import chromeIcon from "../assets/chrome.png";
import facebookIcon from "../assets/facebook.svg";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-gray-500 to-gray-500 p-4">

      <div className="backdrop-blur-xl bg-white/20 border border-white/30
       shadow-2xl p-6 md:p-10 rounded-3xl w-full max-w-sm md:max-w-md">

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br
           from-gray-300 to-green-100  flex items-center justify-center">
            <img src={waterIcon} alt="logo" className="w-12 h-12" />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-center text-black mb-1">
          WaterWatch
        </h1>

        <p className="text-center text-black-300 text-sm md:text-base mb-6">
          Access real-time water quality data
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl bg-white/30 
            placeholder-gray-100 text-black text-sm md:text-base
            focus:outline-none focus:ring-2 focus:ring-black-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-white/30 
            placeholder-gray-100 text-black text-sm md:text-base
            focus:outline-none focus:ring-2 focus:ring-black-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-br from-blue-400 to-blue-500 
            text-black font-semibold py-3 rounded-xl shadow-lg
            text-sm md:text-base hover:opacity-60 transition cursor-pointer"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-black-100 text-sm md:text-base my-4">
          OR CONTINUE WITH
        </p>

        <div className="flex justify-center space-x-4 mb-4">
          <img
            src={chromeIcon}
            alt="chrome"
            className="w-10 h-10 p-2 bg-white/30 rounded-xl cursor-pointer"
          />
          <img
            src={facebookIcon}
            alt="facebook"
            className="w-10 h-10 p-2 bg-white/30 rounded-xl cursor-pointer"
          />
        </div>

        <p className="text-center text-black-100 text-sm md:text-base mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="font-semibold text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
