import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';

import PredictiveChart from '../components/PredictiveChart';
import CollaborationsPanel from '../components/Collaboration/CollaborationsPanel';
import SharedReports from '../components/Collaboration/SharedReports';
import ngoService from '../services/ngoService';

const NGODashboard = () => {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [newReport, setNewReport] = useState({
    stationId: '',
    reportType: '',
    status: 'Pending',
    pdf: null
  });

  const [filters, setFilters] = useState({
    stationId: '',
    status: ''
  });

  const [dashboardData, setDashboardData] = useState({
    stats: {},
    projects: [],
    stations: [],
    recentReports: []
  });
  const [projects, setProjects] = useState([]);


  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedProject, setSelectedProject] = useState('');
  const [showProjectModal, setShowProjectModal] = useState(false);

const [newProject, setNewProject] = useState({
  name: '',
  description: '',
  start_date: '',
  end_date: ''
});

  /* ================= FETCH DASHBOARD ================= */
  const fetchProjects = async () => {
  try {
    const response = await ngoService.getProjects();
    console.log('PROJECTS RESPONSE 👉', response); // 👈 ADD THIS
    setProjects(response);
  } catch (error) {
    console.error('Failed to fetch projects', error);
  }
};


  useEffect(() => {
    fetchNGODashboardData();
    fetchProjects();
  }, []);

  const fetchNGODashboardData = async () => {
    try {
      setLoading(true);
      const response = await ngoService.getDashboardData();

      setDashboardData({
        stats: response?.stats || {},
        projects: response?.projects || [],
        stations: response?.stations || [],
        recentReports: response?.recentReports || []
      });
    } catch (error) {
      console.error('NGO Dashboard fetch failed:', error);
      alert('Unable to load NGO Dashboard');
    } finally {
      setLoading(false);
    }
  };

  /* ================= REPORT ================= */
  const handleCreateReport = async () => {
    if (!newReport.stationId || !newReport.reportType) {
      alert('Please select station and report type');
      return;
    }

    try {
      await ngoService.createReport({
  station_id: Number(newReport.stationId),
  issue_type: newReport.reportType
});

    

      setShowReportModal(false);
      setNewReport({
        stationId: '',
        reportType: '',
        status: 'Pending',
        pdf: null
      });

      fetchNGODashboardData();
    } catch {
      alert('Failed to submit report');
    }
  };

  /* ================= FILTER ================= */
  const applyFilters = async () => {
    try {
      const res = await ngoService.getFilteredReports(filters);
      setDashboardData(prev => ({
        ...prev,
        recentReports: res
      }));
    } catch {
      alert('Failed to apply filters');
    }
  };

  const resetFilters = () => {
    setFilters({ stationId: '', status: '' });
    fetchNGODashboardData();
  };

  const filteredProjects = selectedProject
  ? projects.filter(p => p.id == selectedProject)
  : projects;


  /* ================= LOADING ================= */
  const handleProjectChange = (e) => {
  const { name, value } = e.target;
  setNewProject(prev => ({
    ...prev,
    [name]: value
  }));
};
const handleCreateProject = async () => {
  if (!newProject.name) {
    alert("Project name is required");
    return;
  }

  try {
    await ngoService.createProject(newProject);

    setShowProjectModal(false);
    setNewProject({
      name: '',
      description: '',
      start_date: '',
      end_date: ''
    });

    // refresh project list
    fetchProjects();

  } catch (err) {
    console.error(err);
    alert("Failed to create project");
  }
};

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-700">Loading NGO Dashboard...</p>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen text-gray-800">

      {/* ================= HEADER ================= */}
      <div className="rounded-xl p-6 mb-8 text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              NGO & Collaboration Dashboard
            </h1>
            <p className="text-white/90">
              Manage your projects, reports, and collaborations
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">

  <div className="bg-white rounded-xl shadow-sm border border-blue-100">
    <StatCard
      title="Active Projects"
      value={dashboardData.stats.activeProjects || 0}
      icon="📋"
    />
  </div>

  <div className="bg-white rounded-xl shadow-sm border border-green-100">
    <StatCard
      title="Assigned Stations"
      value={dashboardData.stats.assignedStations || 0}
      icon="📍"
    />
  </div>

  <div className="bg-white rounded-xl shadow-sm border border-yellow-100">
    <StatCard
      title="Pending Reports"
      value={dashboardData.stats.pendingReports || 0}
      icon="📄"
    />
  </div>

  <div className="bg-white rounded-xl shadow-sm border border-purple-100">
    <StatCard
      title="Active Collaborations"
      value={dashboardData.stats.activeCollaborations || 0}
      icon="🤝"
    />
  </div>

  <div className="bg-white rounded-xl shadow-sm border border-indigo-100">
    <StatCard
      title="Shared Reports"
      value={dashboardData.stats.sharedReports || 0}
      icon="📊"
    />
  </div>

</div>


      {/* ================= TABS ================= */}
      <div className="mb-6">
        <div className="inline-flex rounded-lg border bg-white shadow-sm">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-2 rounded-md font-medium ${
              activeTab === 'projects'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Your Projects
          </button>
          <button
            onClick={() => setActiveTab('collaborations')}
            className={`px-6 py-2 rounded-md font-medium ${
              activeTab === 'collaborations'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Collaborations
          </button>
        </div>
      </div>

      {/* ================= PROJECTS TAB ================= */}
      {activeTab === 'projects' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            {/* PROJECTS */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">

  {/* ===== PROJECT HEADER (IMAGE 2) ===== */}
  <div className="flex items-center justify-between mb-4">
    

    <h2 className="text-xl font-bold text-gray-800">
      Your Projects
    </h2>

    <div className="flex gap-3 items-center">
        <hr className="border-gray-200 mb-4" />
      {/* Project Filter */}
      <select
        className="border px-3 py-2 rounded text-sm text-gray-700 bg-white"
        value={selectedProject}
        onChange={e => setSelectedProject(e.target.value)}
      >
        <option value="">All Projects</option>
        {projects.map(p => (
  <option key={p.id} value={p.id}>
    {p.name}
  </option>
))}


      </select>

      {/* New Project */}
      <button
        onClick={() => setShowProjectModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 flex items-center gap-1"
      >
        + New Project
      </button>

    </div>
  </div>

  {/* ===== PROJECT LIST ===== */}
  {filteredProjects.length === 0 && (
    <p className="text-gray-500">No projects found.</p>
  )}

  {filteredProjects.map(project => (
    <div
      key={project.id}
      className="border rounded-lg p-4 mb-4 hover:bg-gray-50"
    >
      <h3 className="font-semibold text-gray-800">
        {project.name}
      </h3>
      <p className="text-sm text-gray-600">
        {project.description}
      </p>
      <Link
        to={`/ngo/project/${project.id}`}
        className="text-blue-600 text-sm mt-2 inline-block"
      >
        View Details →
      </Link>
    </div>
  ))}
</div>


           {/* QUICK ACTIONS */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

  <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
  <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
  Quick Actions
</h2>

  {/* Submit Report */}
  <button
    onClick={() => setShowReportModal(true)}
    className="w-full flex items-start gap-4 p-4 border border-gray-200 rounded-lg mb-4
           hover:bg-gray-50 hover:shadow-sm transition text-left"

  >
    <div className="w-11 h-11 flex items-center justify-center rounded-xl
                bg-blue-100 text-blue-600 shadow-sm">

      ✓
    </div>
    <div>
      <p className="font-medium text-gray-800">
        Submit Water Quality Report
      </p>
      <p className="text-sm text-gray-600">
        Add new water quality data from stations
      </p>
    </div>
  </button>

  {/* Project Summary */}
  <button
    className="w-full flex items-start gap-4 p-4 border border-gray-200 rounded-lg mb-4 hover:bg-gray-50 hover:shadow-sm transition text-left"
  >
    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-100 text-green-600">
      📊
    </div>
    <div>
      <p className="font-medium text-gray-800">
        Create Project Summary
      </p>
      <p className="text-sm text-gray-600">
        Generate comprehensive project reports
      </p>
    </div>
  </button>

  {/* Alert Settings */}
  <button
    className="w-full flex items-start gap-4 p-4 border border-gray-200 rounded-lg mb-4
           hover:bg-gray-50 hover:shadow-sm transition text-left"

  >
    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
      ⚠️
    </div>
    <div>
      <p className="font-medium text-gray-800">
        Configure Alert Settings
      </p>
      <p className="text-sm text-gray-600">
        Set up notifications for critical parameters
      </p>
    </div>
  </button>

  {/* Analytics Dashboard */}
  <button
    onClick={() => navigate('/ngo/analytics')}
    className="w-full flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 text-left"
  >
    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600">
      📈
    </div>
    <div>
      <p className="font-medium text-gray-800">
        View Analytics Dashboard
      </p>
      <p className="text-sm text-gray-600">
        Interactive charts and data insights
      </p>
    </div>
  </button>
</div>
          </div>
          
          

          {/* PREDICTIVE */}
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Predictive Analytics</h2>
            {dashboardData.stations[0]?.id && (
              <PredictiveChart stationId={dashboardData.stations[0].id} parameter="pH" />
            )}
          </div>

          
        </>
      )}

      {/* ================= COLLABORATIONS ================= */}
      {activeTab === 'collaborations' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <CollaborationsPanel />
            <SharedReports />
          </div>
          
        </>
      )}

      {/* ================= DEBUG ================= */}
<div className="mt-10 p-4 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">

  <p className="font-semibold mb-1">Debug Info</p>
  <p>Projects: {projects.length}</p>
  <p>Stations: {dashboardData.stations.length}</p>
  <p>Active Tab: {activeTab}</p>

  <button
    onClick={fetchNGODashboardData}
    className="mt-2 bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
  >
    Refresh Data
  </button>
</div>


      {/* ================= REPORT MODAL ================= */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md text-gray-800">
            <h3 className="text-lg font-bold mb-4">New Water Quality Report</h3>

            <select
              className="w-full border p-2 rounded mb-3"
              onChange={e => setNewReport({ ...newReport, stationId: e.target.value })}
            >
              <option value="">Select Station</option>
              {dashboardData.stations.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <select
              className="w-full border p-2 rounded mb-3"
              onChange={e => setNewReport({ ...newReport, reportType: e.target.value })}
            >
              <option value="">Report Type</option>
              <option>pH Issue</option>
              <option>TDS Issue</option>
              <option>Turbidity Issue</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateReport}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ================= NEW PROJECT MODAL ================= */}
{showProjectModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md text-gray-800">
      <h3 className="text-lg font-bold mb-4">New Project</h3>

      <input
        type="text"
        name="name"
        placeholder="Project Name"
        value={newProject.name}
        onChange={handleProjectChange}
        className="w-full border p-2 rounded mb-3"
      />

      <textarea
        name="description"
        placeholder="Project Description"
        value={newProject.description}
        onChange={handleProjectChange}
        className="w-full border p-2 rounded mb-3"
      />

      <input
        type="date"
        name="start_date"
        value={newProject.start_date}
        onChange={handleProjectChange}
        className="w-full border p-2 rounded mb-3"
      />

      <input
        type="date"
        name="end_date"
        value={newProject.end_date}
        onChange={handleProjectChange}
        className="w-full border p-2 rounded mb-4"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowProjectModal(false)}
          className="border px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateProject}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Project
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default NGODashboard;
