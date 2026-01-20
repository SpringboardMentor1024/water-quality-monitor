import { useEffect, useState } from "react";

export default function UserProfile() {
  const BACKEND_URL = "http://127.0.0.1:8000";
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [tempUser, setTempUser] = useState({});
  const [preview, setPreview] = useState(null);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const token = localStorage.getItem("access_token");

  // ---------------- FETCH PROFILE ----------------
  const fetchProfile = async () => {
    if (!token) return alert("You are not logged in!");
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) throw new Error("Unauthorized. Please login again.");
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setUser(data);
      setTempUser(data);
      setPreview(data.profile_pic || null);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ---------------- HANDLE INPUTS ----------------
  const handleChange = (e) => setTempUser({ ...tempUser, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  // ---------------- PROFILE PICTURE UPLOAD ----------------
  const handleProfilePic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/upload-pic`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUser({ ...user, profile_pic: data.url });
        localStorage.setItem("user", JSON.stringify({ ...user, profile_pic: data.url }));
        alert("✅ Profile picture updated!");
      } else alert("Upload failed!");
    } catch (err) {
      console.error(err);
      alert("Backend error during upload.");
    }
  };

  // ---------------- SAVE PROFILE ----------------
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", tempUser.name);
      formData.append("email", tempUser.email);
      formData.append("phone", tempUser.phone || "");

      const res = await fetch(`${BACKEND_URL}/api/auth/update`, {
        method: "PUT",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setEditing(false);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("✅ Profile updated successfully!");
      } else alert(data.message || "Update failed");
    } catch (err) {
      console.error(err);
      alert("Backend error during update.");
    }
  };

  // ---------------- CHANGE PASSWORD ----------------
  const handlePasswordSave = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm)
      return alert("All fields are required");
    if (passwords.new !== passwords.confirm) return alert("Passwords do not match");
    if (passwords.new.length < 8) return alert("Password must be at least 8 characters");

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/change-password`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Password changed successfully!");
        setPasswords({ current: "", new: "", confirm: "" });
        setShowPasswordModal(false);
      } else alert(data.message || "Password change failed!");
    } catch (err) {
      console.error(err);
      alert("Backend error during password change");
    }
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-1">User Profile</h1>
        <p className="text-gray-500 mb-6">Manage your account information and security</p>

        {/* Profile Picture */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {user.profile_pic ? (
              <img src={user.profile_pic} alt="Profile" className="w-full h-full object-cover" />
            ) : preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl text-gray-500">{user.name ? user.name[0].toUpperCase() : "U"}</span>
            )}
          </div>
          {editing && <input type="file" accept="image/*" onChange={handleProfilePic} />}
        </div>

        {/* Profile Info */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Profile Information</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Full Name: </span>
              {editing ? (
                <input type="text" name="name" value={tempUser.name} onChange={handleChange} className="border rounded px-2 py-1" />
              ) : user.name}
            </p>
            <p>
              <span className="font-medium">Email: </span>
              {editing ? (
                <input type="email" name="email" value={tempUser.email} onChange={handleChange} className="border rounded px-2 py-1" />
              ) : user.email}
            </p>
            <p>
              <span className="font-medium">Phone: </span>
              {editing ? (
                <input type="text" name="phone" value={tempUser.phone} onChange={handleChange} className="border rounded px-2 py-1" />
              ) : user.phone}
            </p>
            <p>
              <span className="font-medium">Role: </span> {user.role}
            </p>
          </div>

          {/* Edit Buttons */}
          <div className="mt-4 flex gap-2">
            {editing ? (
              <>
                <button onClick={handleSave} className="bg-[#4FA3B5] text-white px-4 py-2 rounded-lg">Save</button>
                <button onClick={() => setEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded-lg">Cancel</button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="bg-[#4FA3B5] text-white px-4 py-2 rounded-lg">Edit Profile</button>
            )}
          </div>
        </div>

        {/* Security */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Security</h2>
          <p className="text-sm text-gray-600 mb-3">Change your password:</p>
          <button onClick={() => setShowPasswordModal(true)} className="bg-[#4FA3B5] text-white px-4 py-2 rounded-lg">Change Password</button>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4">Logout</button>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Current Password</label>
                <input type="password" name="current" value={passwords.current} onChange={handlePasswordChange} className="border rounded w-full px-2 py-1 mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">New Password</label>
                <input type="password" name="new" value={passwords.new} onChange={handlePasswordChange} className="border rounded w-full px-2 py-1 mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Confirm New Password</label>
                <input type="password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} className="border rounded w-full px-2 py-1 mt-1" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShowPasswordModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded-lg">Cancel</button>
              <button onClick={handlePasswordSave} className="bg-[#4FA3B5] text-white px-4 py-2 rounded-lg">Save Password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
