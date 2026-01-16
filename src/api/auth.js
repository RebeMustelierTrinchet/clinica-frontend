import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// LOGIN
export const loginRequest = async (username, password) => {
   return axios.post(`${API_URL}/auth/login`, { username, password });
};

// LOGOUT
export const logoutRequest = async () => {
  return axios.post(`${API_URL}/auth/logout`);
};
