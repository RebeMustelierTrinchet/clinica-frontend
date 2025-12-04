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

export const createClinicalRecord = createAsyncThunk(
  "clinical/createRecord",
  async (record, { rejectWithValue }) => {
    try {
      const res = await clinicalApi.create(record);
      return res.data.record;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);

// --- Slice ---
const clinicalSlice = createSlice({
  name: "clinical",
  initialState: {
    history: [],
    loading: false,
    error: null,
  },
  reducers: {},
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
