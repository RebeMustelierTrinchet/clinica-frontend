// src/api/inventory.js
import axios from "axios";

const API_URL = "http://localhost:5000/inventory"; // ruta del backend

const inventoryApi = {
  // GET todos los items
  getAll: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al obtener inventario:", error);
      throw error.response?.data || { error: "Error de red" };
    }
  },

  // GET un item por ID
  getOne: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener item ${id}:`, error);
      throw error.response?.data || { error: "Error de red" };
    }
  },

  // POST crear nuevo item
  create: async (item) => {
    try {
      const response = await axios.post(API_URL, item);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || { error: error.message };
      console.error("Error al crear item:", errorData);
      throw new Error(errorData.error || "Error desconocido");
    }
  },

  // PUT actualizar item
  update: async (id, item) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, item);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar item ${id}:`, error);
      throw error.response?.data || { error: "Error de red" };
    }
  },

  // DELETE eliminar item
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar item ${id}:`, error);
      throw error.response?.data || { error: "Error de red" };
    }
  },
};

export default inventoryApi;
