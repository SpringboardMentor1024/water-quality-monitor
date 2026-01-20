import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editPasswordMode, setEditPasswordMode] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', email: '', current_password: '', new_password: '', confirm_password: '' });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => { fetchUserData(); }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = await authAPI.getCurrentUser();
      if (userData) { 
        setUser(userData); 
        setFormData({ ...formData, full_name: userData.full_name || '', email: userData.email || '' }); 
      } else { 
        navigate('/login'); 
      }
    } catch (err) { 
      setError('Failed to load profile data'); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleInputChange = (e) => { 
    const { name, value } = e.target; 
    setFormData({ ...formData, [name]: value }); 
    setError(''); 
    setSuccessMessage(''); 
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault(); 
    setError(''); 
    setSuccessMessage('');
    if (!formData.full_name.trim()) { 
      setError('Full name is required'); 
      return; 
    }
    if (!formData.email.trim()) { 
      setError('Email is required'); 
      return; 
    }
    try {
      const updateData = {};
      if (formData.full_name !== user.full_name) updateData.full_name = formData.full_name;
      if (formData.email !== user.email) updateData.email = formData.email;
      if (Object.keys(updateData).length > 0) {
        const updatedUser = await authAPI.updateProfile(updateData);
        setUser(updatedUser); 
        setSuccessMessage('Profile updated successfully!'); 
        setEditMode(false);
      } else { 
        setSuccessMessage('No changes made'); 
      }
    } catch (err) { 
      setError(err.message || 'Failed to update profile'); 
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault(); 
    setError(''); 
    setSuccessMessage('');
    if (!formData.current_password) { 
      setError('Current password is required'); 
      return; 
    }
    if (!formData.new_password) { 
      setError('New password is required'); 
      return; 
    }
    if (formData.new_password.length < 8) { 
      setError('New password must be at least 8 characters'); 
      return; 
    }
    if (formData.new_password !== formData.confirm_password) { 
      setError('New passwords do not match'); 
      return; 
    }
    try {
      const updatedUser = await authAPI.updatePassword(formData.current_password, formData.new_password);
      setUser(updatedUser); 
      setFormData({ ...formData, current_password: '', new_password: '', confirm_password: '' });
      setSuccessMessage('Password updated successfully!'); 
      setEditPasswordMode(false);
    } catch (err) { 
      setError(err.message || 'Failed to update password'); 
    }
  };

  const handleLogout = () => { 
    authAPI.logout(); 
    navigate('/login'); 
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Loading profile...</div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-red-500">Failed to load profile</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
          <p className="text-gray-600">Manage your account information and security</p>
        </div>
        
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Profile Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                {!editMode && (
                  <button 
                    onClick={() => setEditMode(true)} 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              
              {editMode ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      name="full_name" 
                      value={formData.full_name} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                      required 
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { 
                        setEditMode(false); 
                        setFormData({ ...formData, full_name: user.full_name, email: user.email }); 
                        setError(''); 
                      }} 
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-lg text-gray-800">{user.full_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email Address</label>
                    <p className="text-lg text-gray-800">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Account Role</label>
                    <p className="text-lg text-gray-800 capitalize">{user.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Member Since</label>
                    <p className="text-lg text-gray-800">
                      {new Date(user.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Security Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Security</h2>
                {!editPasswordMode && (
                  <button 
                    onClick={() => setEditPasswordMode(true)} 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Change Password
                  </button>
                )}
              </div>
              
              {editPasswordMode ? (
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input 
                      type="password" 
                      name="current_password" 
                      value={formData.current_password} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input 
                      type="password" 
                      name="new_password" 
                      value={formData.new_password} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                      required 
                      minLength="8" 
                    />
                    <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      name="confirm_password" 
                      value={formData.confirm_password} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                      required 
                      minLength="8" 
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Update Password
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { 
                        setEditPasswordMode(false); 
                        setFormData({ ...formData, current_password: '', new_password: '', confirm_password: '' }); 
                        setError(''); 
                      }} 
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-600">You can change your password here for security reasons.</p>
                  {/* FIXED: Replaced corrupted bullet characters with asterisks */}
                  <p className="text-sm text-gray-500">Last changed: ********</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">User ID</span>
                  <span className="font-mono text-sm">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions - FIXED: Replaced all corrupted characters */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-left"
                >
                  ← Back to Dashboard
                </button>
                <button 
                  onClick={() => navigate('/password-recovery')} 
                  className="w-full px-4 py-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-left"
                >
                  Forgot Password?
                </button>
                <button 
                  onClick={handleLogout} 
                  className="w-full px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-left"
                >
                  Logout
                </button>
              </div>
            </div>
            
            {/* Help Section */}
            <div className="bg-blue-50 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Need Help?</h3>
              <p className="text-blue-700 text-sm mb-4">
                If you're having trouble with your account, contact support.
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
