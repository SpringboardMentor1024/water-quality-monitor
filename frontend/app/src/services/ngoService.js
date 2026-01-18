// src/services/ngoService.js
import api from "./api";

const ngoService = {

  /* ================= DASHBOARD ================= */
  getDashboardData: async () => {
    const response = await api.get("/ngo/dashboard");
    return response.data;
  },

  /* ================= PROJECTS ================= */
  getProjects: async () => {
    const response = await api.get("/ngo/projects");
    return response.data;
  },

  getProjectDetails: async (projectId) => {
    const response = await api.get(`/ngo/projects/${projectId}/details`);
    return response.data;
  },

  /* ================= STATIONS ================= */
  getAssignedStations: async (projectId = null) => {
    const params = projectId ? { project_id: projectId } : {};
    const response = await api.get("/ngo/stations", { params });
    return response.data;
  },

  getWaterStationDetails: async (stationId) => {
    const response = await api.get(`/ngo/stations/${stationId}`);
    return response.data;
  },

  /* ================= STATION PARAMETERS ================= */
  getStationParameters: async (stationId) => {
    const response = await api.get(`/ngo/stations/${stationId}/parameters`);
    return response.data;
  },

  getStationReadings: async (stationId) => {
    const response = await api.get(`/ngo/stations/${stationId}/readings`);
    return response.data;
  },

  /* ================= REPORTS ================= */
  getWaterStationReports: async (stationId) => {
    const response = await api.get(
      `/ngo/stations/${stationId}/reports`
    );
    return response.data;
  },

  submitWaterStationReport: async (payload) => {
    /**
     * payload = {
     *   stationId,
     *   description,
     *   water_source
     * }
     */
    const response = await api.post("/ngo/reports", payload);
    return response.data;
  },

  updateReportStatus: async (reportId, status) => {
    const response = await api.put(
      `/ngo/reports/${reportId}/status`,
      { status }
    );
    return response.data;
  },
  // ================= SUBMIT REPORT =================
submitWaterReport: async (payload) => {
  try {
    const response = await api.post("/ngo/reports", payload);
    return response.data;
  } catch (error) {
    console.error("Report submission failed:", error);
    throw error;
  }
},


};

export default ngoService;
