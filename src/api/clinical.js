import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const clinicalApi = {
  // Obtener todo el historial clínico
  getAll: async () => axios.get(`${API_URL}/clinical`),

  // Crear un nuevo registro
  create: async (recordData) => axios.post(`${API_URL}/clinical`, recordData),

  // (Opcional) Obtener historial de un paciente específico
  getByPatient: async (patientName) => axios.get(`${API_URL}/clinical/patient/${patientName}`),

  // (Opcional) Obtener historial de un trabajador específico
  getByWorker: async (workerId) => axios.get(`${API_URL}/clinical/worker/${workerId}`),
};
