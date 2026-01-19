// src/services/collaborationService.js
import axios from "axios";

const API_BASE = "http://localhost:8000";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

/* ===============================
   COLLABORATIONS
================================ */

// ▶ existing (KEEP)
export const getCollaborationsByNGO = (ngoId) => {
  return axios.get(
    `${API_BASE}/collaborations/ngo/${ngoId}`,
    getAuthHeaders()
  );
};

// ▶ alias used by UI (KEEP)
export const fetchCollaborations = (ngoId) => {
  return getCollaborationsByNGO(ngoId);
};

// ▶ create collaboration (KEEP)
export const createCollaboration = (payload) => {
  return axios.post(
    `${API_BASE}/collaborations/`,
    payload,
    getAuthHeaders()
  );
};

/* ===============================
   SHARED REPORTS
================================ */
export const fetchSharedReports = (ngoId) => {
  return axios.get(
    `${API_BASE}/collaborations/ngo/${ngoId}/reports`,
    getAuthHeaders()
  );
};

/* ===============================
   PARTNER ACTIVITY
================================ */
export const fetchPartnerActivity = (ngoId) => {
  return axios.get(
    `${API_BASE}/collaborations/ngo/${ngoId}/activity`,
    getAuthHeaders()
  );
};
