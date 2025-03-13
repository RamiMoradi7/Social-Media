import { configureStore } from "@reduxjs/toolkit";
import { AppState } from "./AppState";
import { authReducers } from "./AuthSlice";
import { chatReducers } from "./ChatsSlice";
import { notificationsReducer } from "./NotificationsSlice";
import { postsReducers } from "./PostsSlice";
import { profileUserReducer } from "./ProfileUserSlice";

export const store = configureStore<AppState>({
  reducer: {
    user: authReducers,
    profileUser:profileUserReducer,
    postsState: postsReducers,
    chatState: chatReducers,
    notificationsState: notificationsReducer,
  },
});
