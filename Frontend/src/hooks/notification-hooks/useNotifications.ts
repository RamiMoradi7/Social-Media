import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { FilterType } from "../../components/areas/home/Notifications/NotificationList";
import { AppState } from "../../redux/AppState";
import { notificationsService } from "../../services/NotificationsService";
import { useCurrentUser } from "../../redux/Selectors";

export const useNotifications = () => {
  const user = useCurrentUser();
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
      toast.error(err);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await notificationsService.deleteAllNotifications(user._id);
    } catch (err: any) {
      toast.error(err);
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
