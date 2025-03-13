import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../models/User";

const initialState: User | null = null;

const profileUserSlice = createSlice({
  name: "profileUser",
  initialState,
  reducers: {
    setProfileUser(_state, action: PayloadAction<User>) {
      return action.payload;
    },
    updateUser(state, action: PayloadAction<User>) {
      return { ...state, ...action.payload };
    },
    updateProfileUserRequests(state, action: PayloadAction<Partial<User>>) {
      if (state === null) return state;

      const { friendRequests, sentRequests, friends, isFriendRequestSent } =
        action.payload;
      if (friends) {
        state.friends = action.payload.friends;
      }
      if (sentRequests) {
        state.sentRequests = action.payload.sentRequests;
      }
      if (friendRequests) {
        state.friendRequests = action.payload.friendRequests;
      }
      if (isFriendRequestSent) {
        state.isFriendRequestSent = isFriendRequestSent;
      }
    },
  },
});

export const { setProfileUser, updateUser, updateProfileUserRequests } =
  profileUserSlice.actions;
export const profileUserReducer = profileUserSlice.reducer;
