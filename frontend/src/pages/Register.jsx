import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { motion } from "framer-motion";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      return alert("Please fill in all fields");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return alert("Please enter a valid email");

    if (password !== confirmPassword) return alert("Passwords do not match");

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate backend call
    alert("Your account has been successfully created!");
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4 sm:px-6 md:px-8">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xs sm:max-w-md md:max-w-lg bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl hover:shadow-3xl transition-shadow"
      >
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 mx-auto mb-3 sm:mb-4 rounded-xl bg-blue-500 flex items-center justify-center text-2xl">
            💧
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Water Quality Monitor
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-1">
            Create your account to access real-time water quality data
          </p>
        </div>

        <form onSubmit={handleRegister}>
          <Input
            label="Full Name"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPasswordToggle={true}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            showPasswordToggle={true}
          />

          <Button text={loading ? "Registering..." : "Register"} type="submit" />
        </form>

        <p className="text-center text-xs sm:text-sm text-slate-400 mt-6">
          Already have an account?{" "}
          <span
            className="text-cyan-400 cursor-pointer hover:text-cyan-200 transition"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
