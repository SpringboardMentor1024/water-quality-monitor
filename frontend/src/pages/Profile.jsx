import React from "react";

const Profile = () => {
  const userData = {
    email: "monitor@waterwatch.gov",
    region: "North Basin",
    status: "ACTIVE",
    memberSince: "January 2025"
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in p-6">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-blue-50">
        
        {/* Profile Header */}
        <div className="bg-blue-600 p-12 flex flex-col items-center text-white">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl font-black mb-6 border-4 border-white/30">
            UP
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter italic">User Profile</h1>
          <p className="text-xs font-black uppercase tracking-[0.3em] opacity-80 mt-2">Authority</p>
        </div>

        {/* Profile Details */}
        <div className="p-12 grid grid-cols-2 gap-y-10 gap-x-8">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
            <p className="text-sm font-bold text-blue-900">{userData.email}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Assigned Region</p>
            <p className="text-sm font-bold text-blue-900">{userData.region}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Status</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-sm font-black text-green-600 italic uppercase">{userData.status}</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Member Since</p>
            <p className="text-sm font-bold text-blue-900">{userData.memberSince}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-12 pt-0 flex gap-4">
          <button className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all active:scale-95">
            Edit Account
          </button>
          <button className="flex-1 border-2 border-blue-50 text-blue-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;