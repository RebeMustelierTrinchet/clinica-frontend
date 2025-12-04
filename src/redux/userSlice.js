import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [], // <- aquí se guarda la lista de usuarios
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    removeUser: (state, action) => {
      state.users = state.users.filter(u => u.id !== action.payload);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) state.users[index] = action.payload;
    },
  },
});

export const { setUsers, addUser, removeUser, updateUser } = userSlice.actions;

export default userSlice.reducer;
