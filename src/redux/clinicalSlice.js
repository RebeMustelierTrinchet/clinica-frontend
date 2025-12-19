// src/redux/clinicalSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { clinicalApi } from "../api/clinical";

// --- Thunks ---
export const fetchClinicalHistory = createAsyncThunk(
  "clinical/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await clinicalApi.getAll();
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);

// En tu clinicalSlice.js, en el createClinicalRecord thunk:
export const createClinicalRecord = createAsyncThunk(
  "clinical/createRecord",
  async (record, { rejectWithValue }) => {
    try {
      console.log("Enviando registro al backend:", record);
      const res = await clinicalApi.create(record);
      console.log("Respuesta del backend:", res.data);
      return res.data.record; // Asegúrate que esto devuelve el registro completo
    } catch (err) {
      console.error("Error en createClinicalRecord:", err.response?.data);
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);
// --- Slice ---
const clinicalSlice = createSlice({
  name: "clinical",
  initialState: {
    history: [],
    totals: { hours: 0, payment: 0, commission: 0 },
    loading: false,
    error: null,
  },
   reducers: {
    calculateTotals: (state) => {
      let totalHours = 0;
      let totalPayment = 0;
      let totalCommission = 0;

      state.history.forEach(record => {
        // Suma horas
        const hours = record.itemsUsed?.reduce((sum, item) => sum + (item.qty || 0), 0) || 0;
        totalHours += record.hours || 0; // si el registro tiene horas propias
        totalPayment += record.totalCharged || 0;

        // Ejemplo de comisión: 10% del totalCharged
        totalCommission += (record.totalCharged || 0) * 0.1;
      });

      state.totals = {
        hours: totalHours,
        payment: totalPayment,
        commission: totalCommission,
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClinicalHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClinicalHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchClinicalHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Error al cargar historial";
      })

      .addCase(createClinicalRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClinicalRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.history.push(action.payload); // Mantiene todas las semanas
      })
      .addCase(createClinicalRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Error al crear registro";
      });
  },
});

export default clinicalSlice.reducer;
