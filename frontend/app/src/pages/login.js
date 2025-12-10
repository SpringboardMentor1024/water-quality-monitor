import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
const navigate = useNavigate();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleLogin = async (e) => {
e.preventDefault();


if (!email || !password) {
  alert("Please enter valid credentials");
  return;
}

try {
  const response = await fetch("http://127.0.0.1:8000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    // Quick fix: store a placeholder token
    localStorage.setItem("token", "loggedin");  
    navigate("/dashboard");
}
 else {
    alert(data.message || "Login failed");
  }
} catch (err) {
  console.error(err);
  alert("Server error. Try again later.");
}


};

return ( <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 font-sans"> <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md text-white text-center"> <div className="text-5xl mb-4">💧</div> <h1 className="text-2xl font-bold mb-6">Sign In</h1> <form onSubmit={handleLogin} className="space-y-4">
<input
type="email"
placeholder="Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
required
/>
<input
type="password"
placeholder="Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
required
/> <Link
  to="/forgot-password"
  className="block text-right text-yellow-400 hover:underline"
>
  Forgot password?
</Link>
 <button
         type="submit"
         className="w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-500 transition"
       >
Login </button> </form> <p className="text-gray-300 mt-4 text-sm">
Don’t have an account?{" "} <Link to="/register" className="text-yellow-400 font-bold hover:underline">
Sign up </Link> </p> </div> </div>
);
}

export default Login;
