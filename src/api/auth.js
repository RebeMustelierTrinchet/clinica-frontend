import axios from "axios";

const API_URL = "http://localhost:5000";

// LOGIN
export const loginRequest = async (email, password) => {
  return axios.post(`${API_URL}/auth/login`, { email, password });
};

// LOGOUT
export const logoutRequest = async () => {
  return axios.post(`${API_URL}/auth/logout`);
};
