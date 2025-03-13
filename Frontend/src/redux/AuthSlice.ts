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
      return { ...state, ...action.payload };
    },
    updateUserRequests(state, action: PayloadAction<Partial<User>>) {
      const { friendRequests, sentRequests, friends } = action.payload;
      if (friends) {
        state.friends = action.payload.friends;
      }
      if (sentRequests) {
        state.sentRequests = action.payload.sentRequests;
      }
      if (friendRequests) {
        state.friendRequests = action.payload.friendRequests;
      }
    },

    logout(state) {
      return null;
    },
  },
});

export const { register, login, logout, updateUser, updateUserRequests } =
  authSlice.actions;
export const authReducers = authSlice.reducer;
