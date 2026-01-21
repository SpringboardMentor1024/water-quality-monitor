import React, { useState } from "react";

const Profile = () => {
  const initialData = {
    email: "monitor@waterwatch.gov",
    region: "North Basin",
    status: "ACTIVE",
    memberSince: "January 2025"
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Updated profile:", formData);
    // TODO: API call (PATCH /users/profile)
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Change password:", passwordData);
    // TODO: API call (POST /auth/change-password)
    setShowPasswordModal(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in p-6">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-blue-50">

        {/* Header */}
        <div className="bg-blue-600 p-12 flex flex-col items-center text-white">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-black mb-6 border-4 border-white/30">
            UP
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">User Profile</h1>
          <p className="text-xs font-black uppercase tracking-[0.3em] opacity-80 mt-2">
            Authority
          </p>
        </div>

        {/* Details */}
        <div className="p-12 grid grid-cols-2 gap-y-10 gap-x-8">

          {/* Email */}
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Email Address
            </p>
            {isEditing ? (
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            ) : (
              <p className="text-sm font-bold text-blue-900">{formData.email}</p>
            )}
          </div>

          {/* Region */}
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Assigned Region
            </p>
            {isEditing ? (
              <input
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            ) : (
              <p className="text-sm font-bold text-blue-900">{formData.region}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Account Status
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-sm font-black text-green-600 uppercase">
                {formData.status}
              </p>
            </div>
          </div>

          {/* Member Since */}
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Member Since
            </p>
            <p className="text-sm font-bold text-blue-900">
              {formData.memberSince}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-12 pt-0 flex gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setFormData(initialData);
                  setIsEditing(false);
                }}
                className="flex-1 border-2 border-gray-200 py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700"
              >
                Edit Account
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex-1 border-2 border-blue-50 text-blue-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50"
              >
                Change Password
              </button>
            </>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md">
            <h2 className="font-black mb-6">Change Password</h2>

            {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
              <input
                key={field}
                type="password"
                placeholder={field.replace(/([A-Z])/g, " $1")}
                className="w-full border rounded-lg px-3 py-2 mb-4"
                onChange={(e) =>
                  setPasswordData({ ...passwordData, [field]: e.target.value })
                }
              />
            ))}

            <div className="flex gap-4">
              <button
                onClick={handlePasswordChange}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
              >
                Update
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 border py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
