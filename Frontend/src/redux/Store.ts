import { configureStore } from "@reduxjs/toolkit";
import { AppState } from "./AppState";
import { authReducers } from "./AuthSlice";
import { chatReducers } from "./ChatsSlice";
import { notificationsReducer } from "./NotificationsSlice";
import { postsReducers } from "./PostsSlice";

export const store = configureStore<AppState>({
  reducer: {
    user: authReducers,
    postsState: postsReducers,
    chatState: chatReducers,
    notificationsState: notificationsReducer,
  },
});
