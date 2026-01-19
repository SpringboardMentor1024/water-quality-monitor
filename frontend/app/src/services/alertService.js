// src/services/alertService.js
import api from "./api";

export const getAlertTrends = async () => {
  const res = await api.get("/alerts/trends");
  return res.data;
};
