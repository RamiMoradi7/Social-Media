import { useMenuContext } from "../../../../context/MenuContext";
import { useNavigation } from "../../../../hooks/notification-hooks/useNavigation";
import { Notification } from "../../../../models/Notification";
import { notificationsService } from "../../../../services/NotificationsService";
import { dateFormat } from "../../../../utilities/DateFormat";
import { notify } from "../../../../utilities/Notify";
import CancelSvg from "../../../common/svgs/Cancel";
import NotificationIcon from "./NotificationIcon";

type NotificationCardProps = {
  notification: Notification;
};

export default function NotificationCard({
  notification,
}: NotificationCardProps): JSX.Element {
  const { handleNavigation } = useNavigation();
  const { toggleOpen } = useMenuContext();

  const { senderId, message, type, timestamp, referenceId, isRead } =
    notification;

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await notificationsService.deleteNotification(notificationId);
    } catch (err: any) {
      notify.error(err);
    }
  };

  const handleClickNotification = async () => {
    try {
      if (!isRead) {
        await notificationsService.markNotificationAsRead(notification?._id);
      }
      handleNavigation(type, referenceId);
      toggleOpen(null);
    } catch (err: any) {
      notify.error(err);
    }
  };

  return (
    <>
      <div
        className={`w-full bg-white dark:bg-dark-second max-w-md p-4 mb-4 rounded-lg shadow-md transition-transform transform hover:scale-105 ease-in-out ${
          isRead ? "opacity-50" : ""
        }`}
        role="alert"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="relative inline-block">
              <img
                className="w-12 h-12 rounded-full"
                src={senderId?.photos?.profilePhoto}
                alt="user-profile"
              />
              <span className="absolute bottom-0 right-0 inline-flex items-center justify-center w-5 h-5 bg-black rounded-full">
                {<NotificationIcon type={type} />}
              </span>
            </div>
            <div>
              <div
                onClick={handleClickNotification}
                style={{ cursor: "pointer" }}
              >
                <div className="text-sm font-semibold  dark:text-dark-txt">
                  {senderId?.firstName} {senderId?.lastName}
                </div>
                <div className="text-sm  dark:text-dark-txt cursor-pointer">
                  {message}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleDeleteNotification(notification?._id)}
            type="button"
            className="flex-shrink-0 w-6 h-6  dark:text-dark-txt hover:text-gray-600 focus:outline-none"
            aria-label="Close"
          >
            <CancelSvg color="dark:text-dark-txt" />
          </button>
        </div>
        <div className="text-xs  dark:text-dark-txt">
          {dateFormat(timestamp)}
        </div>
      </div>
    </>
  );
}
