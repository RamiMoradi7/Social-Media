import { useSelector } from "react-redux";
import { AppState } from "../../redux/AppState";
import { useState } from "react";
import { FilterType } from "../../components/areas/home/Notifications/NotificationList";
import { notificationsService } from "../../services/NotificationsService";
import { notify } from "../../utilities/Notify";
import { useCurrentUser } from "../../context/UserContext";

export const useNotifications = () => {
  const { user } = useCurrentUser();
  const { notifications, unreadCount } = useSelector(
    (appState: AppState) => appState.notificationsState
  );
  const [filter, setFilter] = useState<FilterType>("all");

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  const markNotificationsAsRead = async () => {
    const notificationIds = notifications
      .filter((notification) => !notification.isRead)
      .map((n) => n._id);
    try {
      await notificationsService.markNotificationsAsRead(notificationIds);
    } catch (err: any) {
      notify.error(err);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await notificationsService.deleteAllNotifications(user._id);
    } catch (err: any) {
      notify.error(err);
    }
  };

  const filteredNotifications =
    filter === "all" ? notifications : notifications.filter((n) => !n.isRead);

  return {
    filter,
    handleFilterChange,
    markNotificationsAsRead,
    deleteAllNotifications,
    filteredNotifications,
    unreadCount,
  };
};
