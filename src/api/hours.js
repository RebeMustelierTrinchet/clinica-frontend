import axios from "axios";

const API_URL = "http://localhost:5000";

export const hoursApi = {
  // Ver estado de hoy
  getTodayStatus: (userId) =>
    axios.get(`${API_URL}/hours/status/${userId}`),

  // Clock In
  clockIn: (userId) =>
    axios.post(`${API_URL}/hours/clock-in`, {
      userId,
      date: new Date().toISOString().split("T")[0],
      clockIn: new Date().toLocaleTimeString(),
    }),

  // Clock Out
  clockOut: (userId) =>
    axios.post(`${API_URL}/hours/clock-out`, {
      userId,
      date: new Date().toISOString().split("T")[0],
      clockOut: new Date().toLocaleTimeString(),
    }),

    getMyHistory: (userId) =>
  axios.get(`${API_URL}/hours/user/${userId}`),

  // 🔥 ESTA ES LA FUNCIÓN QUE TE FALTABA
  mark: async (userId) => {
    const status = await axios.get(`${API_URL}/hours/status/${userId}`);

    if (!status.data.clockIn) {
      return hoursApi.clockIn(userId);
    } else {
      return hoursApi.clockOut(userId);
    }
  },
};
