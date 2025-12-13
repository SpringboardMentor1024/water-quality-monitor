import React, { useState } from 'react';
import Navigation from '../components/layout/Navigation';

const NewReportPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    severity: 'low',
    reportType: 'water_quality',
    contactInfo: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Report submitted successfully! Thank you for helping monitor water quality.');
    // Here you would typically send the data to your backend
    console.log('Report submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Submit New Report</h1>
          <p className="text-gray-600">Report water quality issues or observations</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Brief description of the issue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Specific location (e.g., Central Park Lake, Hudson River)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                name="reportType"
                value={formData.reportType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="water_quality">Water Quality Issue</option>
                <option value="contamination">Contamination</option>
                <option value="fish_kill">Fish Kill</option>
                <option value="unusual_odor">Unusual Odor/Color</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity Level
              </label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="low">Low - Minor concern</option>
                <option value="medium">Medium - Needs attention</option>
                <option value="high">High - Urgent issue</option>
                <option value="critical">Critical - Emergency</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Provide detailed information about what you observed..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Information (Optional)
              </label>
              <input
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Email or phone number for follow-up"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 font-medium"
              >
                Submit Report
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewReportPage;