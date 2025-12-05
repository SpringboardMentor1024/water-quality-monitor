import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
const navigate = useNavigate();
const [formData, setFormData] = useState({
name: "",
email: "",
password: "",
role: "citizen",
location: "",
});

const handleRegister = async (e) => {
e.preventDefault();


if (!formData.name || !formData.email || !formData.password) {
  alert("Please fill all required fields");
  return;
}

try {
  const response = await fetch("http://127.0.0.1:8000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (response.ok) {
    alert("Account created successfully!");
    navigate("/");
  } else {
    alert(data.message || "Registration failed");
  }
} catch (err) {
  console.error(err);
  alert("Server error. Try again later.");
}


};

return ( <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 font-sans"> <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md text-white text-center"> <div className="text-5xl mb-4">💧</div> <h1 className="text-2xl font-bold mb-6">Create Account</h1> <form onSubmit={handleRegister} className="space-y-4">
<input
type="text"
placeholder="Full Name"
value={formData.name}
onChange={(e) => setFormData({ ...formData, name: e.target.value })}
className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
required
/>
<input
type="email"
placeholder="Email"
value={formData.email}
onChange={(e) => setFormData({ ...formData, email: e.target.value })}
className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
required
/>
<input
type="password"
placeholder="Password"
value={formData.password}
onChange={(e) => setFormData({ ...formData, password: e.target.value })}
className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
required
/>
<select
value={formData.role}
onChange={(e) => setFormData({ ...formData, role: e.target.value })}
className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
> <option value="citizen">Citizen</option> <option value="ngo">NGO</option> <option value="authority">Authority</option> <option value="admin">Admin</option> </select>
<input
type="text"
placeholder="Location"
value={formData.location}
onChange={(e) => setFormData({ ...formData, location: e.target.value })}
className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
/> <button
         type="submit"
         className="w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-500 transition"
       >
Create Account </button> </form> <p className="text-gray-300 mt-4 text-sm">
Already have an account?{" "} <Link to="/" className="text-yellow-400 font-bold hover:underline">
Log in </Link> </p> </div> </div>
);
}

export default Register;
