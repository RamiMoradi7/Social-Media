import axios from "axios";
import { Notification } from "../models/Notification";
import {
  deleteAllNotifications,
  deleteNotification,
  initNotifications,
  markAllAsRead,
  markNotificationAsRead,
} from "../redux/NotificationsSlice";
import { store } from "../redux/Store";
import { appConfig } from "../utilities/AppConfig";

class NotificationsService {
  public async getUserNotifications(userId: string): Promise<Notification[]> {
    let notifications = store.getState().notificationsState.notifications;
    if (notifications.length > 0) return notifications;
    const response = await axios.get<Notification[]>(
      appConfig.notificationsUrl + userId
    );
    notifications = response.data;
    store.dispatch(initNotifications(notifications));
    return notifications;
  }

  public async markNotificationAsRead(notificationId: string): Promise<void> {
    await axios.put<Notification>(appConfig.notificationsUrl + notificationId);
    store.dispatch(markNotificationAsRead(notificationId));
  }

  public async markNotificationsAsRead(
    notificationIds: string[]
  ): Promise<void> {
    await axios.put<Notification>(appConfig.notificationsUrl, notificationIds);
    store.dispatch(markAllAsRead());
  }
  public async deleteNotification(notificationId: string): Promise<void> {
    const response = await axios.delete<Notification>(
      appConfig.notificationsUrl + notificationId
    );

    if (response.status === 204) {
      store.dispatch(deleteNotification(notificationId));
    }
  }
  public async deleteAllNotifications(userId: string): Promise<void> {
    const response = await axios.delete<Notification[]>(
      appConfig.notificationsUrl + `user/${userId}`
    );
    if (response.status === 204) {
      store.dispatch(deleteAllNotifications());
    }
  }
}

export const notificationsService = new NotificationsService();
