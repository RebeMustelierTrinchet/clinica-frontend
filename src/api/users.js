import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const usersApi = {
  getUsersRequest: async () => axios.get(`${API_URL}/users`),
  getUserRequest: async (id) => axios.get(`${API_URL}/users/${id}`),
  createUserRequest: async (userData) => axios.post(`${API_URL}/users`, userData),
  updateUserRequest: async (id, userData) => axios.put(`${API_URL}/users/${id}`, userData),
  deleteUserRequest: async (id) => axios.delete(`${API_URL}/users/${id}`),
};
