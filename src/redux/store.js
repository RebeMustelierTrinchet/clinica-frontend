import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import inventoryReducer from "./inventorySlice";
import clinicalReducer from "./clinicalSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    inventory: inventoryReducer,
    clinical: clinicalReducer,
  },
});
