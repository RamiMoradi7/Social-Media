import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useChatToggle } from "../../../hooks/useChatToggle";
import { Chat } from "../../../models/Chat";
import { AppState } from "../../../redux/AppState";
import { chatsService } from "../../../services/ChatsService";
import { notificationsService } from "../../../services/NotificationsService";
import CancelSvg from "../../common/svgs/Cancel";
import toast from "react-hot-toast";

type ChatListItemProps = {
    userId: string;
    chat: Chat;
};

export default function ChatListItem({
    userId,
    chat,
}: ChatListItemProps): JSX.Element {
    const { toggleChat } = useChatToggle(chat?._id);
    const lastMessage = chat?.messages[chat.messages.length - 1];
    const otherParticipant = chat?.participants.find((p) => p._id !== userId);
    const notifications = useSelector(
        (appState: AppState) => appState.notificationsState.notifications
    );

    const unreadMessages = notifications?.filter(
        (notification) =>
            notification.type === "message" &&
            !notification.isRead &&
            notification.referenceId === chat._id
    );

    const handleMarkAsRead = async () => {
        const unreadNotificationsIds = unreadMessages.map(
            (notification) => notification._id
        );
        try {
            await Promise.all(
                unreadNotificationsIds.map((notificationId) =>
                    notificationsService.markNotificationAsRead(notificationId)
                )
            );
        } catch (err: any) {
            toast.error(err);
        }
    };

    const handleDeleteChat = async (chatId: string) => {
        try {
            try {
                const result = await Swal.fire({
                    title: `Are you sure you want to delete your chat with ${otherParticipant?.firstName}?`,
                    text: `This action cannot be undone. Please confirm that you'd like to proceed.`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!",
                });
                if (result.isConfirmed) {
                    await chatsService.deleteChat(chatId, userId);
                    Swal.fire("Deleted!", "Your file has been deleted.", "success");
                }
            } catch (err: any) {
                toast.error(err);
            }
        } catch (err: any) {
            toast.error(err);
        }
    };

    return (
        <>
            <div className="relative flex items-center justify-between border-b border-gray-200 dark:border-dark-third py-3 px-4 hover:bg-gray-100 dark:hover:bg-dark-third">
                <button
                    className="flex items-center space-x-3 w-full text-left focus:outline-none focus-visible:bg-indigo-50"
                    onClick={() => {
                        toggleChat();
                        handleMarkAsRead();
                    }}
                >
                    <img
                        className="rounded-full"
                        src={otherParticipant?.photos?.profilePhoto}
                        width="48"
                        height="48"
                        alt="User Profile"
                    />
                    <div className="flex flex-col flex-1 ml-3">
                        <h4 className="text-sm font-semibold dark:text-dark-txt">
                            {otherParticipant?.firstName} {otherParticipant?.lastName}
                        </h4>

                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {lastMessage && (
                                <div>
                                    {`${lastMessage.sender.firstName}: ${lastMessage.content}`}
                                </div>
                            )}
                        </div>
                    </div>
                </button>
                {unreadMessages.length > 0 && (
                    <div className="flex items-center justify-center absolute top-0 right-0 mt-2 mr-4 w-6 h-6 bg-red-600 text-white text-xs font-semibold rounded-full border-2 border-white">
                        {unreadMessages.length}
                    </div>
                )}
                <button
                    onClick={() => handleDeleteChat(chat?._id)}
                    type="button"
                    className="flex-shrink-0 ml-3 w-8 h-8 dark:text-dark-txt hover:text-gray-600 focus:outline-none"
                    aria-label="Close"
                >
                    <CancelSvg color="dark:text-dark-txt" />
                </button>
            </div>
        </>
    );
}
