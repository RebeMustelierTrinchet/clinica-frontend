import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import inventoryApi from "../api/inventory";

// --- Thunks ---
export const fetchInventory = createAsyncThunk(
  "inventory/fetchInventory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await inventoryApi.getAll();
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);

export const createInventoryItem = createAsyncThunk(
  "inventory/createItem",
  async (item, { rejectWithValue }) => {
    try {
      const res = await inventoryApi.create(item);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);

export const updateInventoryItem = createAsyncThunk(
  "inventory/updateItem",
  async ({ id, item }, { rejectWithValue }) => {
    try {
      const res = await inventoryApi.update(id, item);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);

export const deleteInventoryItem = createAsyncThunk(
  "inventory/deleteItem",
  async (id, { rejectWithValue }) => {
    try {
      await inventoryApi.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);

// --- Slice ---
const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Error al cargar inventario";
      })

      // CREATE
      .addCase(createInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInventoryItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Error al crear item";
      })

      // UPDATE
      .addCase(updateInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((i) =>
          i.id === action.payload.id ? action.payload : i
        );
      })
      .addCase(updateInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Error al actualizar item";
      })

      // DELETE
      .addCase(deleteInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInventoryItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((i) => i.id !== action.payload);
      })
      .addCase(deleteInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Error al eliminar item";
      });
  },
});

export default inventorySlice.reducer;
