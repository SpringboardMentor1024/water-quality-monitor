import React, { useState } from 'react';
import {
  HelpCircle, MessageSquare, Phone, Mail,
  FileText, Book, Video, Globe,
  Search, ExternalLink, ChevronRight,
  CheckCircle, AlertCircle, Clock, Users
} from 'lucide-react';

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState('help');
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: 'How do I report water quality issues?',
      answer: 'Navigate to the "New Report" page, select the station location, describe the issue, and submit with photos if available.'
    },
    {
      question: 'What do the station status colors mean?',
      answer: 'Green: Normal, Yellow: Warning, Red: Critical, Blue: Maintenance.'
    },
    {
      question: 'How often is water quality data updated?',
      answer: 'Real-time stations update every 15 minutes. Manual reports are processed within 24 hours.'
    },
    {
      question: 'Can I download historical data?',
      answer: 'Yes, visit the Analytics page and use the export feature for historical data in CSV format.'
    },
    {
      question: 'How do I add a new monitoring station?',
      answer: 'Contact your system administrator or use the station management page if you have admin privileges.'
    },
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone Support',
      description: '24/7 emergency hotline',
      details: '+1 (800) 555-0199',
      action: 'Call Now'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Response within 24 hours',
      details: 'support@waterquality.com',
      action: 'Send Email'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Available 9 AM - 5 PM EST',
      details: 'Start a conversation',
      action: 'Start Chat'
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Learn how to use the platform',
      details: 'Watch guides',
      action: 'View Tutorials'
    },
  ];

  const resources = [
    { title: 'User Manual', icon: Book, size: '2.4 MB', updated: 'Jan 2024' },
    { title: 'API Documentation', icon: FileText, size: '1.8 MB', updated: 'Dec 2023' },
    { title: 'Data Privacy Policy', icon: Globe, size: '0.8 MB', updated: 'Nov 2023' },
    { title: 'Quick Start Guide', icon: Book, size: '1.2 MB', updated: 'Jan 2024' },
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600 mt-2">Find answers, get help, and learn how to use Water Quality Monitor</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow p-4 mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, or documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          {searchQuery && (
            <div className="mt-2 text-sm text-gray-600">
              Found {filteredFaqs.length} results for "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {['help', 'contact', 'resources', 'status'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      {activeTab === 'help' && (
        <div className="space-y-8">
          {/* Quick Help */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="p-3 bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Book className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Documentation</h3>
              <p className="text-gray-600 mb-4">Complete guides and manuals for all features</p>
              <button className="text-teal-600 hover:text-teal-800 flex items-center">
                Browse Docs
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="p-3 bg-green-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Tutorials</h3>
              <p className="text-gray-600 mb-4">Step-by-step video guides for common tasks</p>
              <button className="text-teal-600 hover:text-teal-800 flex items-center">
                Watch Videos
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="p-3 bg-purple-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Forum</h3>
              <p className="text-gray-600 mb-4">Connect with other users and experts</p>
              <button className="text-teal-600 hover:text-teal-800 flex items-center">
                Join Discussion
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <HelpCircle className="w-6 h-6 mr-2 text-teal-600" />
              Frequently Asked Questions
            </h3>
            
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="font-medium text-gray-900 mb-2">{faq.question}</div>
                  <div className="text-gray-600">{faq.answer}</div>
                </div>
              ))}
              
              {filteredFaqs.length === 0 && searchQuery && (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No results found</h4>
                  <p className="text-gray-600">Try different keywords or browse the categories</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-xl shadow p-6">
                <div className="flex items-start mb-4">
                  <div className="p-3 bg-teal-100 rounded-lg mr-4">
                    <method.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{method.title}</h3>
                    <p className="text-gray-600">{method.description}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-900 font-medium mb-2">{method.details}</div>
                  <button className="w-full mt-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                    {method.action}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Send us a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Describe your issue or question..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white rounded-xl shadow p-6">
                <div className="p-3 bg-gray-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  <resource.icon className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <div className="text-sm text-gray-600 mb-4">
                  {resource.size} • Updated {resource.updated}
                </div>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Download
                </button>
              </div>
            ))}
          </div>

          {/* Additional Resources */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Training & Certification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Water Quality Analyst Certification</h4>
                <p className="text-gray-600 mb-3">Become a certified water quality analyst</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>40 hours • Self-paced</span>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Data Analysis Workshop</h4>
                <p className="text-gray-600 mb-3">Learn advanced data analysis techniques</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>16 hours • Live sessions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'status' && (
        <div className="space-y-8">
          {/* System Status */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">System Status</h3>
            
            <div className="space-y-4">
              {[
                { service: 'API Services', status: 'operational', icon: CheckCircle },
                { service: 'Database', status: 'operational', icon: CheckCircle },
                { service: 'File Storage', status: 'maintenance', icon: AlertCircle },
                { service: 'Email Notifications', status: 'operational', icon: CheckCircle },
                { service: 'Real-time Monitoring', status: 'degraded', icon: AlertCircle },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-4 ${
                      item.status === 'operational' ? 'bg-green-100' :
                      item.status === 'maintenance' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <item.icon className={`w-5 h-5 ${
                        item.status === 'operational' ? 'text-green-600' :
                        item.status === 'maintenance' ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{item.service}</div>
                      <div className="text-sm text-gray-600 capitalize">{item.status}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Last checked: Just now
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Schedule */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Scheduled Maintenance</h3>
            
            <div className="space-y-4">
              {[
                { date: 'Jan 28, 2024', time: '2:00 AM - 4:00 AM EST', description: 'Database optimization' },
                { date: 'Feb 4, 2024', time: '3:00 AM - 5:00 AM EST', description: 'System updates' },
                { date: 'Feb 11, 2024', time: '1:00 AM - 3:00 AM EST', description: 'Security patches' },
              ].map((schedule, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">{schedule.date}</div>
                      <div className="text-sm text-gray-600 mt-1">{schedule.time}</div>
                    </div>
                    <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      Scheduled
                    </div>
                  </div>
                  <div className="mt-3 text-gray-700">{schedule.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportPage;
