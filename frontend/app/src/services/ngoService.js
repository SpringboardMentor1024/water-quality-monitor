// frontend/app/src/services/ngoService.js
import api from './api';





const ngoService = {

  // ================= DASHBOARD =================
  getDashboardData: async () => {
    try {
      const response = await api.get('/ngo/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching NGO dashboard data:', error);
      throw error; // ❗ NO hardcoded fallback
    }
  },

  // ================= PROJECTS =================
  getProjects: async () => {
    try {
      const response = await api.get('/ngo/projects');
      return response.data;
    } catch (error) {
      console.error('Error fetching NGO projects:', error);
      throw error;
    }
  },


  createProject: async (projectData) => {
    const response = await api.post('/ngo/projects', projectData);
    return response.data;
  },

  updateProject: async (projectId, projectData) => {
    const response = await api.put(`/ngo/projects/${projectId}`, projectData);
    return response.data;
  },

  // ================= STATIONS =================
  getAssignedStations: async (projectId = null) => {
    try {
      const params = projectId ? { project_id: projectId } : {};
      const response = await api.get('/ngo/stations', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching NGO stations:', error);
      throw error;
    }
  },

  getStationDetails: async (stationId) => {
    try {
      const response = await api.get(`/ngo/stations/${stationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching station ${stationId} details:`, error);
      throw error;
    }
  },

  // ================= REPORTS =================
  getStationReports: async (stationId, status = null) => {
    try {
      const params = status ? { status } : {};
      const response = await api.get(`/ngo/stations/${stationId}/reports`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching reports for station ${stationId}:`, error);
      throw error;
    }
  },

  updateReportStatus: async (reportId, status) => {
    const response = await api.put(`/ngo/reports/${reportId}/status`, { status });
    return response.data;
  },

  // ================= PREDICTIVE =================
  getPredictiveData: async (stationId, parameter, days = 30) => {
    try {
      const response = await api.get(`/predictive/${stationId}`, {
        params: { parameter, days }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching predictive data:', error);
      throw error;
    }
  },

  getPredictiveAlerts: async () => {
    try {
      const response = await api.get('/predictive/alerts');
      return response.data;
    } catch (error) {
      console.error('Error fetching predictive alerts:', error);
      throw error;
    }
  },

  // ================= QUALITATIVE =================
  getQualitativeAssessment: async (stationId) => {
    try {
      const response = await api.get(`/qualitative-assessment/${stationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching qualitative assessment for station ${stationId}:`, error);
      throw error;
    }
  },

  submitAssessment: async (stationId, assessmentData) => {
    const response = await api.post(`/qualitative-assessment/${stationId}`, assessmentData);
    return response.data;
  },

  // ================= COLLABORATIONS =================
  getCollaborations: async () => {
    try {
      const response = await api.get('/ngo/collaborations');
      return response.data;
    } catch (error) {
      console.error('Error fetching NGO collaborations:', error);
      throw error;
    }
  },

  // ================= ANALYTICS =================
  getProjectPerformance: async (projectId) => {
    try {
      const response = await api.get(`/ngo/projects/${projectId}/performance`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching performance for project ${projectId}:`, error);
      throw error;
    }
  },

  getStationStatistics: async (stationId, period = 'month') => {
    try {
      const response = await api.get(`/ngo/stations/${stationId}/statistics`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching statistics for station ${stationId}:`, error);
      throw error;
    }
    
  },
  // ================= PROJECT DETAILS =================
getProjectDetails: async (projectId) => {
  try {
    const response = await api.get(`/ngo/projects/${projectId}/details`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project ${projectId} details:`, error);
    throw error;
  }
},

  

};

export default ngoService;
