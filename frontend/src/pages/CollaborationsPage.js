import React, { useState } from 'react';
import {
  Users, MessageSquare, Share2, Upload,
  Download, Calendar, FileText, CheckCircle,
  AlertCircle, UserPlus, Settings, Bell,
  Video, Phone, Mail, Globe
} from 'lucide-react';

const CollaborationsPage = () => {
  const [activeTab, setActiveTab] = useState('team');

  const teamMembers = [
    { id: 1, name: 'Alex Johnson', role: 'Lead Analyst', email: 'alex@waterquality.com', status: 'online', avatar: 'AJ' },
    { id: 2, name: 'Maria Garcia', role: 'Field Researcher', email: 'maria@waterquality.com', status: 'online', avatar: 'MG' },
    { id: 3, name: 'David Chen', role: 'Data Scientist', email: 'david@waterquality.com', status: 'away', avatar: 'DC' },
    { id: 4, name: 'Sarah Williams', role: 'Environmental Engineer', email: 'sarah@waterquality.com', status: 'offline', avatar: 'SW' },
    { id: 5, name: 'James Wilson', role: 'Quality Assurance', email: 'james@waterquality.com', status: 'online', avatar: 'JW' },
  ];

  const projects = [
    { id: 1, name: 'Ganges River Study', progress: 75, members: 4, deadline: '2024-02-15' },
    { id: 2, name: 'Coastal Water Monitoring', progress: 45, members: 3, deadline: '2024-03-01' },
    { id: 3, name: 'Urban Water Quality', progress: 90, members: 5, deadline: '2024-01-30' },
    { id: 4, name: 'Industrial Impact Analysis', progress: 30, members: 2, deadline: '2024-03-15' },
  ];

  const recentActivities = [
    { id: 1, user: 'Alex Johnson', action: 'uploaded new data', target: 'Ganges River Study', time: '10 min ago' },
    { id: 2, user: 'Maria Garcia', action: 'commented on', target: 'Station STN-003 report', time: '1 hour ago' },
    { id: 3, user: 'David Chen', action: 'shared analysis', target: 'Coastal Water Monitoring', time: '2 hours ago' },
    { id: 4, user: 'System', action: 'generated monthly', target: 'Water Quality Report', time: '1 day ago' },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Collaborations</h1>
            <p className="text-gray-600 mt-2">Work together on water quality monitoring projects</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Team
            </button>
            <button className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
              <Share2 className="w-4 h-4 mr-2" />
              New Project
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {['team', 'projects', 'documents', 'communications'].map((tab) => (
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
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Team & Projects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Team Members */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-teal-600" />
                Team Members ({teamMembers.length})
              </h3>
              <input
                type="text"
                placeholder="Search team members..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-teal-600">{member.avatar}</span>
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        member.status === 'online' ? 'bg-green-500' :
                        member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-600">{member.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <a href={`mailto:${member.email}`} className="p-2 text-gray-400 hover:text-teal-600">
                      <Mail className="w-4 h-4" />
                    </a>
                    <button className="p-2 text-gray-400 hover:text-blue-600">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Projects */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-teal-600" />
              Active Projects
            </h3>

            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <div className="text-sm text-gray-600 mt-1">
                        {project.members} members • Due {project.deadline}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-teal-600">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Activity & Tools */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-teal-600" />
              Recent Activity
            </h3>

            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="border-l-4 border-teal-500 pl-4 py-2">
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">{activity.user}</span>
                    <span className="text-gray-600"> {activity.action} </span>
                    <span className="font-medium text-gray-900">{activity.target}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Collaboration Tools */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Tools</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Video className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium">Video Call</span>
              </button>
              
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <FileText className="w-8 h-8 text-green-600 mb-2" />
                <span className="text-sm font-medium">Shared Docs</span>
              </button>
              
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Upload className="w-8 h-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium">File Share</span>
              </button>
              
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Globe className="w-8 h-8 text-orange-600 mb-2" />
                <span className="text-sm font-medium">Public Portal</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Team Stats</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Members</span>
                <span className="font-medium">{teamMembers.filter(m => m.status === 'online').length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Projects</span>
                <span className="font-medium">{projects.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Files Shared</span>
                <span className="font-medium">247</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Meetings This Week</span>
                <span className="font-medium">8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationsPage;

