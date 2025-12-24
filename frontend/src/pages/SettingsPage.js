import React, { useState } from 'react';
import {
  Settings as SettingsIcon, Bell, Lock, User, Moon,
  Globe, Database, Shield, Save, RefreshCw,
  CheckCircle, AlertCircle
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      language: 'en',
      timezone: 'UTC+05:30',
      dateFormat: 'DD/MM/YYYY',
      theme: 'light',
    },
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      reportUpdates: true,
      systemMaintenance: false,
      weeklyDigest: true,
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      publicProfile: false,
      autoLogout: 30,
    },
    account: {
      twoFactorAuth: false,
      sessionLimit: 1,
      passwordChangeRequired: false,
    }
  });

  const [saveStatus, setSaveStatus] = useState('');

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    setSaveStatus('saving');
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Lock },
    { id: 'account', name: 'Account', icon: User },
    { id: 'appearance', name: 'Appearance', icon: Moon },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your application preferences and account settings</p>
      </div>

      {/* Settings Container */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="lg:w-64 border-r border-gray-200">
            <nav className="p-4 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm rounded-lg ${
                    activeTab === tab.id
                      ? 'bg-teal-50 text-teal-700 border border-teal-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-3" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Save Status */}
            {saveStatus && (
              <div className={`mb-6 p-4 rounded-lg ${
                saveStatus === 'saving' ? 'bg-blue-50 border border-blue-200' :
                saveStatus === 'saved' ? 'bg-green-50 border border-green-200' : ''
              }`}>
                <div className="flex items-center">
                  {saveStatus === 'saving' ? (
                    <>
                      <RefreshCw className="w-5 h-5 text-blue-600 mr-3 animate-spin" />
                      <span className="text-blue-700">Saving changes...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-green-700">Settings saved successfully!</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">General Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.general.language}
                      onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Zone
                    </label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="UTC+05:30">(UTC+05:30) India Standard Time</option>
                      <option value="UTC+00:00">(UTC+00:00) Coordinated Universal Time</option>
                      <option value="UTC-05:00">(UTC-05:00) Eastern Time</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Format
                    </label>
                    <select
                      value={settings.general.dateFormat}
                      onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <div className="flex space-x-4">
                      {['light', 'dark', 'auto'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => handleSettingChange('general', 'theme', theme)}
                          className={`px-4 py-2 border rounded-lg capitalize ${
                            settings.general.theme === theme
                              ? 'border-teal-500 bg-teal-50 text-teal-700'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Settings</h2>
                
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          {key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase())}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Receive notifications for {key.toLowerCase().replace(/([A-Z])/g, ' $1')}
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy Settings</h2>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-gray-900">Data Sharing</div>
                        <div className="text-sm text-gray-600">Allow anonymous data sharing for research</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.privacy.dataSharing}
                          onChange={(e) => handleSettingChange('privacy', 'dataSharing', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-gray-900">Analytics</div>
                        <div className="text-sm text-gray-600">Help improve the app by sharing usage analytics</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.privacy.analytics}
                          onChange={(e) => handleSettingChange('privacy', 'analytics', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auto Logout (minutes)
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="120"
                      step="5"
                      value={settings.privacy.autoLogout}
                      onChange={(e) => handleSettingChange('privacy', 'autoLogout', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>5 min</span>
                      <span className="font-medium">{settings.privacy.autoLogout} min</span>
                      <span>120 min</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Security</h2>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                        <div className="text-sm text-gray-600">Add an extra layer of security to your account</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.account.twoFactorAuth}
                          onChange={(e) => handleSettingChange('account', 'twoFactorAuth', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                    {settings.account.twoFactorAuth && (
                      <div className="mt-3 p-3 bg-teal-50 rounded-lg">
                        <div className="text-sm text-teal-700">
                          Two-factor authentication is enabled. You'll need to verify your identity when signing in from new devices.
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Simultaneous Sessions
                    </label>
                    <select
                      value={settings.account.sessionLimit}
                      onChange={(e) => handleSettingChange('account', 'sessionLimit', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="1">1 device at a time</option>
                      <option value="2">2 devices at a time</option>
                      <option value="3">3 devices at a time</option>
                      <option value="0">Unlimited devices</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Appearance</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme Preview
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: 'light', name: 'Light', bg: 'bg-white', text: 'text-gray-900' },
                        { id: 'dark', name: 'Dark', bg: 'bg-gray-900', text: 'text-white' },
                        { id: 'auto', name: 'Auto', bg: 'bg-gradient-to-r from-white to-gray-900', text: 'text-gray-900' },
                      ].map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => handleSettingChange('general', 'theme', theme.id)}
                          className={`p-4 border-2 rounded-lg ${
                            settings.general.theme === theme.id
                              ? 'border-teal-500 ring-2 ring-teal-200'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className={`${theme.bg} ${theme.text} p-3 rounded text-center mb-2`}>
                            Aa
                          </div>
                          <div className="font-medium">{theme.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Density
                    </label>
                    <div className="flex space-x-4">
                      {['comfortable', 'compact', 'spacious'].map((density) => (
                        <button
                          key={density}
                          className={`px-4 py-2 border rounded-lg capitalize ${
                            settings.general.density === density
                              ? 'border-teal-500 bg-teal-50 text-teal-700'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {density}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className="flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

