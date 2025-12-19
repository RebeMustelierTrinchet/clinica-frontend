import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { usersApi } from "../api/users";

// --- Thunks ---
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await usersApi.getUsersRequest();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addUser = createAsyncThunk(
  "user/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await usersApi.createUserRequest(userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const res = await usersApi.updateUserRequest(id, userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeUser = createAsyncThunk(
  "user/removeUser",
  async (id, { rejectWithValue }) => {
    try {
      await usersApi.deleteUserRequest(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// --- Slice ---
const initialState = {
  users: [],
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Added missing setUsers action
    setUsers: (state, action) => {
      state.users = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al cargar usuarios";
      })
      // ADD
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      // UPDATE
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.users[index] = action.payload;
      })
      // REMOVE
      .addCase(removeUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});

// Export actions
export const { setUsers } = userSlice.actions;

// Export the reducer as default
export default userSlice.reducer;