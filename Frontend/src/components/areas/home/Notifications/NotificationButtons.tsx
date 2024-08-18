import { Button } from "@headlessui/react";
import { FilterType } from "./NotificationList";

type NotificationButtonsProps = {
  filter: FilterType;
  onChangeFilter: (filter: FilterType) => void;
  onDeleteAll: () => void;
  onMarkAllAsRead: () => void;
  unreadCount: number;
};

export default function NotificationButtons({
  filter,
  onChangeFilter,
  onDeleteAll,
  onMarkAllAsRead,
  unreadCount,
}: NotificationButtonsProps): JSX.Element {
  return (
    <>
      <div className="flex space-x-2">
        <Button
          onClick={() => onChangeFilter("all")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
            filter === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          } hover:bg-blue-600`}
        >
          All
        </Button>
        <Button
          onClick={() => onChangeFilter("unRead")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
            filter === "unRead"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          } hover:bg-blue-600`}
        >
          Unread
        </Button>

        <Button
          onClick={onDeleteAll}
          className="px-4 py-2 rounded-lg font-semibold transition-colors duration-300 bg-red-400 text-white"
        >
          Delete All
        </Button>
      </div>
      {unreadCount !== 0 && (
        <Button
          onClick={onMarkAllAsRead}
          className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold transition-colors duration-300 hover:bg-green-600"
        >
          Mark All as Read
        </Button>
      )}
    </>
  );
}
