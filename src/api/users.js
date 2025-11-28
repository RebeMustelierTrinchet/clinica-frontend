import axios from "axios";

const API_URL = "http://localhost:5000";

export const usersApi = {
  getUsersRequest: async () => axios.get(`${API_URL}/users`),
  getUserRequest: async (id) => axios.get(`${API_URL}/users/${id}`),
  createUserRequest: async (userData) => axios.post(`${API_URL}/users`, userData),
  updateUserRequest: async (id, userData) => axios.put(`${API_URL}/users/${id}`, userData),
  deleteUserRequest: async (id) => axios.delete(`${API_URL}/users/${id}`),
};
