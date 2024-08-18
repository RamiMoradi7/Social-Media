import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../models/User";

const initialState: User | null = null;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    register(state, action: PayloadAction<User>) {
      return action.payload;
    },
    login(state, action: PayloadAction<User>) {
      return action.payload;
    },
    updateUser(state, action: PayloadAction<User>) {
      return action.payload;
    },
    logout(state) {
      return null;
    },
  },
});

export const { register, login, logout, updateUser } = authSlice.actions;
export const authReducers = authSlice.reducer;
