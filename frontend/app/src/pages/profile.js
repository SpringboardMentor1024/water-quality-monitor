import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "profile";

  const token = localStorage.getItem("token");

  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Avatar ONLY from localStorage
  const [avatar, setAvatar] = useState(
    localStorage.getItem("user_avatar") || null
  );

  // =========================
  // Auth Guard
  // =========================
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // =========================
  // Fetch Profile (NO AVATAR HERE)
  // =========================
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsername(res.data.username);
        setRole(res.data.role);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load profile");
        setLoading(false);
      });
  }, [token]);

  // =========================
  // Update Profile
  // =========================
  const updateProfile = async () => {
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    try {
      const res = await axios.put(
        "http://127.0.0.1:8000/user/profile",
        { name: username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem("user_name", username);
      toast.success(res.data.message || "Profile updated successfully");
    } catch {
      toast.error("Profile update failed");
    }
  };

  // =========================
  // Change Password
  // =========================
  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Fill all fields");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.put(
        "http://127.0.0.1:8000/user/change-password",
        { old_password: oldPassword, new_password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Password update failed");
    }
  };

  // =========================
  // Avatar Upload (LOCAL STORAGE ONLY)
  // =========================
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem("user_avatar", reader.result);
      setAvatar(reader.result);
      toast.success("Profile picture updated");
    };
    reader.readAsDataURL(file);
  };

  const logout = () => {
    localStorage.removeItem("token"); // keep avatar if needed
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-10">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-yellow-400 text-black px-4 py-2 rounded font-bold"
        >
          Back to Dashboard
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-400"></div>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-8">
          {/* LEFT PANEL */}
          <div className="col-span-12 md:col-span-4 bg-gray-800 rounded-xl p-6 flex flex-col items-center gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-yellow-400 flex items-center justify-center text-3xl font-bold">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                username.charAt(0)
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            <p className="text-lg font-semibold">{username}</p>
            <p className="text-gray-400 capitalize">{role}</p>

            <div className="mt-4 flex flex-col gap-2 w-full">
              <button
                className={`py-2 rounded ${
                  tab === "profile"
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-700"
                }`}
                onClick={() => navigate("/profile?tab=profile")}
              >
                Profile Info
              </button>
              <button
                className={`py-2 rounded ${
                  tab === "password"
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-700"
                }`}
                onClick={() => navigate("/profile?tab=password")}
              >
                Change Password
              </button>
              <button className="bg-red-500 py-2 rounded" onClick={logout}>
                Logout
              </button>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="col-span-12 md:col-span-8 bg-gray-800 rounded-xl p-8">
            {tab === "profile" && (
              <>
                <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                <div className="max-w-md space-y-4">
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-700 px-4 py-3 rounded"
                  />
                  <button
                    onClick={updateProfile}
                    className="bg-yellow-400 text-black px-6 py-3 rounded font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </>
            )}

            {tab === "password" && (
              <>
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <div className="max-w-md space-y-4">
                  {[
                    {
                      value: oldPassword,
                      setter: setOldPassword,
                      show: showOldPassword,
                      setShow: setShowOldPassword,
                      placeholder: "Old Password",
                    },
                    {
                      value: newPassword,
                      setter: setNewPassword,
                      show: showNewPassword,
                      setShow: setShowNewPassword,
                      placeholder: "New Password",
                    },
                    {
                      value: confirmPassword,
                      setter: setConfirmPassword,
                      show: showConfirmPassword,
                      setShow: setShowConfirmPassword,
                      placeholder: "Confirm Password",
                    },
                  ].map((f, i) => (
                    <div key={i} className="relative">
                      <input
                        type={f.show ? "text" : "password"}
                        placeholder={f.placeholder}
                        value={f.value}
                        onChange={(e) => f.setter(e.target.value)}
                        className="w-full bg-gray-700 px-4 py-3 rounded"
                      />
                      <span
                        className="absolute right-3 top-3 cursor-pointer"
                        onClick={() => f.setShow(!f.show)}
                      >
                        {f.show ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={handlePasswordChange}
                    className="bg-yellow-400 text-black px-6 py-3 rounded font-bold"
                  >
                    Update Password
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
