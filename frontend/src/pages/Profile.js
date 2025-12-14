import React, { useState } from 'react';
import { 
    FiUser, FiMail, FiMapPin, FiPhone, FiCalendar, FiActivity, 
    FiEdit2, FiSave, FiX, FiCheckCircle
} from 'react-icons/fi';
// Assuming you created this utility file for Axios
import api from "../utils/api"; 

// --- MOCK DATA ---
// NOTE: In a real app, this data would come from the authentication context 
// or an API call when the component loads.
const initialUserProfile = {
    name: "Sanskriti Wargantiwar",
    email: "sanskriti.w@example.com",
    phone: "+91 98765 43210",
    location: "Pune, Maharashtra",
    joinDate: "January 2025",
    role: "Monitor Admin",
    sensorsManaged: 5,
    lastActivity: "Dashboard viewed 5 minutes ago",
};

const Profile = () => {
    // 1. State for managing the profile data (initialize with mock data)
    const [profileData, setProfileData] = useState(initialUserProfile);
    
    // 2. State for controlling the UI mode and feedback
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    
    // Handler for changes in the form fields (only active when isEditing is true)
    const handleChange = (e) => {
        const { id, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // Handler to save changes (implements API call)
    const handleSave = async (e) => {
        e.preventDefault();
        setSaveError(null);
        setSaveSuccess(false);
        setIsSaving(true);
        
        try {
            // ⚠️ TODO: Update API endpoint and payload if necessary
            // In a real application, you might only send changed fields.
            const response = await api.put('/users/profile', profileData); 
            
            // Handle successful update response
            const updatedUser = response.data.user || profileData;
            
            // Update local storage and status
            localStorage.setItem('user', JSON.stringify(updatedUser)); 
            setProfileData(updatedUser); // Update local state with fresh data
            
            setSaveSuccess(true);
            setIsEditing(false); // Exit edit mode
            
        } catch (err) {
            console.error("Profile Update Error:", err.response ? err.response.data : err.message);
            
            const errorMessage = err.response && err.response.data && err.response.data.message
                ? err.response.data.message
                : 'Failed to update profile. Please try again.';
                
            setSaveError(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    // Handler to cancel editing
    const handleCancel = () => {
        setProfileData(initialUserProfile); // Revert unsaved changes to original mock data
        setIsEditing(false);
        setSaveError(null);
        setSaveSuccess(false);
    };
    
    // Handler for resetting password (triggers a mock alert)
    const handleResetPassword = () => {
        alert("Password Reset initiated. A link would typically be sent to your email.");
        console.log("Reset Password triggered.");
    };


    // --- Helper Component to Render an Input Field or Static Text ---
    const FieldDisplay = ({ id, label, icon: Icon, value, type = "text" }) => (
        <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <div className='flex-1'>
                <p className="text-sm text-slate-400 mb-1">{label}</p>
                {isEditing ? (
                    <input
                        id={id}
                        type={type}
                        value={value}
                        onChange={handleChange}
                        className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded-md text-slate-50 focus:ring-cyan-600 focus:border-cyan-600"
                        disabled={isSaving || id === 'email'} // Disable email edit
                    />
                ) : (
                    <span className="text-base font-medium">{value}</span>
                )}
            </div>
        </div>
    );
    // -----------------------------------------------------------------

    return (
        <div className="space-y-6 text-slate-100">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <FiUser className="text-cyan-400" /> User Profile & Account
            </h2>

            {/* Display Success/Error Messages */}
            {saveSuccess && (
                <div className="p-3 bg-emerald-700/50 text-emerald-100 rounded-lg border border-emerald-600 flex items-center gap-2">
                    <FiCheckCircle className="w-5 h-5 flex-shrink-0" /> 
                    Profile updated successfully!
                </div>
            )}
            {saveError && (
                <div className="mb-4 p-3 text-sm font-medium bg-red-900/50 border border-red-700 text-red-200 rounded-md">
                    {saveError}
                </div>
            )}

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Basic User Info Card (Always shows current saved state) */}
                <div className="md:col-span-1 bg-slate-800/80 p-6 rounded-xl border border-slate-700 shadow-lg">
                    <div className="flex flex-col items-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-3xl font-semibold text-slate-900 mb-4">
                            {profileData.name.charAt(0)}
                        </div>
                        <h3 className="text-2xl font-bold">
                           {profileData.name}
                        </h3>
                        <p className="text-sm text-slate-400">{profileData.role}</p>
                    </div>

                    <div className="mt-6 space-y-4">
                        {/* Fields use FieldDisplay helper component */}
                        <FieldDisplay id="email" label="Email" icon={FiMail} value={profileData.email} type="email" />
                        <FieldDisplay id="phone" label="Phone Number" icon={FiPhone} value={profileData.phone} type="tel" />
                        <FieldDisplay id="location" label="Location" icon={FiMapPin} value={profileData.location} type="text" />
                    </div>
                </div>

                {/* 2. Account Activity / Metrics & Actions */}
                <div className="md:col-span-2 bg-slate-800/80 p-6 rounded-xl border border-slate-700 shadow-lg space-y-4">
                    <h3 className="text-lg font-semibold border-b border-slate-700 pb-2">Account Metrics</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-700/50 rounded-lg">
                            <p className="text-sm text-slate-400 flex items-center gap-2"><FiCalendar /> Member Since</p>
                            <p className="text-xl font-bold mt-1">{profileData.joinDate}</p>
                        </div>
                        <div className="p-4 bg-slate-700/50 rounded-lg">
                            <p className="text-sm text-slate-400 flex items-center gap-2"><FiActivity /> Sensors Managed</p>
                            <p className="text-xl font-bold mt-1 text-emerald-400">{profileData.sensorsManaged}</p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-400 pt-2">
                        Last Active: <span className="font-medium text-slate-200">{profileData.lastActivity}</span>
                    </p>

                    {/* --- DYNAMIC ACTION BUTTONS --- */}
                    <div className="pt-3 flex space-x-3">
                        {!isEditing ? (
                            <>
                                {/* Edit Button (toggles isEditing state) */}
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditing(true)} 
                                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold rounded-md transition duration-150 flex items-center gap-2"
                                >
                                    <FiEdit2 /> Edit Profile Details
                                </button>
                                {/* Reset Password Button (triggers mock action) */}
                                <button 
                                    type="button" 
                                    onClick={handleResetPassword} 
                                    className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-bold rounded-md transition duration-150"
                                >
                                    Reset Password
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Save Button (submits the form and calls handleSave) */}
                                <button 
                                    type="submit" 
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-bold rounded-md transition duration-150 disabled:opacity-50 flex items-center gap-2"
                                >
                                    <FiSave /> {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                                {/* Cancel Button (reverts changes and calls handleCancel) */}
                                <button 
                                    type="button" 
                                    onClick={handleCancel} 
                                    disabled={isSaving}
                                    className="px-4 py-2 border border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-50 font-bold rounded-md transition duration-150 disabled:opacity-50 flex items-center gap-2"
                                >
                                    <FiX /> Cancel
                                </button>
                            </>
                        )}
                    </div>
                    {/* --- END DYNAMIC ACTION BUTTONS --- */}
                </div>
            </form>
        </div>
    );
};

export default Profile;