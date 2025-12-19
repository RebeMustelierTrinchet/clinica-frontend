// src/redux/reportsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { hoursApi } from "../api/hours";

// --- Thunks ---
export const fetchUserWeeklyReport = createAsyncThunk(
  "reports/fetchUserWeeklyReport",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await hoursApi.getUserWeeklyReport(userId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);

// --- Slice ---
const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    weeklyData: [],
    dailyRecords: [],
    totals: { hours: 0, payment: 0, commission: 0 },
    loading: false,
    error: null,
  },
  reducers: {
    calculateTotals: (state) => {
      let totalHours = 0;
      let totalPayment = 0;
      let totalCommission = 0;

      state.dailyRecords.forEach((r) => {
        totalHours += r.hours || 0;
        totalPayment += r.dailyPay || 0;
        totalCommission += r.commission || 0;
      });

      state.totals = {
        hours: totalHours,
        payment: totalPayment,
        commission: totalCommission,
        totalWeeks: state.weeklyData.length,
      };
    },
    clearReport: (state) => {
      state.weeklyData = [];
      state.dailyRecords = [];
      state.totals = { hours: 0, payment: 0, commission: 0 };
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserWeeklyReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserWeeklyReport.fulfilled, (state, action) => {
        state.loading = false;

        // Combina datos
        const { weeklySummary = [], dailyRecords = [] } = action.payload;
        state.weeklyData = weeklySummary;
        state.dailyRecords = dailyRecords;
      })
      .addCase(fetchUserWeeklyReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Error cargando reporte";
      });
  },
});

export const { calculateTotals, clearReport } = reportsSlice.actions;
export default reportsSlice.reducer;
