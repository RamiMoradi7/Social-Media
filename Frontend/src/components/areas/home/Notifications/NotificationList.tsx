import { useNotifications } from "../../../../hooks/notification-hooks/useNotifications";
import NotificationCard from "./Notification";
import NotificationButtons from "./NotificationButtons";

export type FilterType = "all" | "unRead";

export default function NotificationList(): JSX.Element {
  const {
    filter,
    handleFilterChange,
    markNotificationsAsRead,
    deleteAllNotifications,
    filteredNotifications,
    unreadCount,
  } = useNotifications();
  
  return (
    <div className="fixed left-0 top-40 lg:top-14 bg-white dark:bg-dark-second z-50 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl max-h-screen overflow-hidden shadow-lg rounded-lg transition-transform transform duration-300 ease-in-out">
      <div className="p-4 flex flex-col items-start space-y-2">
        <NotificationButtons
          filter={filter}
          onChangeFilter={handleFilterChange}
          unreadCount={unreadCount}
          onDeleteAll={deleteAllNotifications}
          onMarkAllAsRead={markNotificationsAsRead}
        />
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
        {!filteredNotifications.length ? (
          <div className="p-4 text-center dark:text-dark-txt">
            No new notifications.
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
            />
          ))
        )}
      </div>
    </div>
  );
}
