import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification } from "../models/Notification";

export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    initNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(
        (notification) => !notification.isRead
      ).length;
    },
    sendNotification(state, action: PayloadAction<Notification>) {
      state.notifications.push(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount++;
      }
    },
    markNotificationAsRead(state, action: PayloadAction<string>) {
      const notificationId = action.payload;
      const notificationIndex = state.notifications.findIndex(
        (notification) => notification._id === notificationId
      );

      if (
        notificationIndex !== -1 &&
        !state.notifications[notificationIndex].isRead
      ) {
        state.notifications[notificationIndex].isRead = true;
        state.unreadCount--;
      }
    },

    markAllAsRead(state) {
      const unReadNotifications = state.notifications.filter(
        (notification) => !notification.isRead
      );

      unReadNotifications.forEach(
        (notification) => (notification.isRead = true)
      );
      state.unreadCount = 0;
    },

    deleteNotification(state, action: PayloadAction<string>) {
      const notificationIndex = state.notifications.findIndex(
        (notification) => notification._id === action.payload
      );

      if (notificationIndex !== -1) {
        if (!state.notifications[notificationIndex].isRead) {
          state.unreadCount--;
        }
        state.notifications.splice(notificationIndex, 1);
      }
    },
    deleteAllNotifications(state) {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  initNotifications,
  sendNotification,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications
} = notificationsSlice.actions;

export const notificationsReducer = notificationsSlice.reducer;
