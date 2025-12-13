import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Please fill in all fields");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return alert("Please enter a valid email");

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate backend call
    alert("Login request submitted successfully (frontend only)");
    setEmail("");
    setPassword("");
    setLoading(false);
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return alert("Please enter your email");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) return alert("Please enter a valid email");

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate backend call
    alert("Password reset link sent! (frontend only)");
    setShowForgot(false);
    setForgotEmail("");
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
            Access real-time water quality data
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!showForgot ? (
            <motion.form
              key="login"
              onSubmit={handleLogin}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
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

              <div className="text-right mb-4">
                <button
                  type="button"
                  className="text-sm sm:text-base text-cyan-400 hover:text-cyan-200 transition cursor-pointer"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot password?
                </button>
              </div>

              <Button text={loading ? "Logging in..." : "Login"} type="submit" />
            </motion.form>
          ) : (
            <motion.form
              key="forgot"
              onSubmit={handleForgot}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-slate-300 mb-4">
                Enter your email to reset your password
              </p>
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
              <Button text={loading ? "Sending..." : "Send Reset Link"} type="submit" />
              <button
                type="button"
                className="mt-3 text-sm text-cyan-400 hover:text-cyan-200 transition cursor-pointer"
                onClick={() => setShowForgot(false)}
              >
                Back to Login
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-center text-xs sm:text-sm text-slate-400 mt-6">
          Don’t have an account?{" "}
          <span
            className="text-cyan-400 cursor-pointer hover:text-cyan-200 transition"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
