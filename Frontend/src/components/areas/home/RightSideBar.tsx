import { useSelector } from "react-redux";
import { useCurrentUser } from "../../../context/UserContext";
import { lastLoginFormat } from "../../../utilities/DateFormat";
import FriendshipActionButton from "../user/buttons/FriendshipActionButton";
import { AppState } from "../../../redux/AppState";
import { store } from "../../../redux/Store";
import { isChatOpen } from "../../../redux/ChatsSlice";
import { chatsService } from "../../../services/ChatsService";
import { notify } from "../../../utilities/Notify";


type RightSideBarProps = {
    toggleOpen?: (section: string) => void
}

export default function RightSideBar({ toggleOpen }: RightSideBarProps): JSX.Element {
    const { user } = useCurrentUser();
    const { chats } = useSelector(
        (appState: AppState) => appState.chatState
    );

    const handleContactClick = async (contactId: string) => {
        try {
            const contactChat = chats.find((chat) =>
                chat.participants.find((participant) => participant._id === contactId)
            );
            if (contactChat) {
                store.dispatch(isChatOpen({ chatId: contactChat?._id }));
            } else {
                await chatsService.startChat([contactId, user?._id]);
            }

            if (toggleOpen) {
                toggleOpen("menu")
            }
        } catch (error) {
            notify.error("An error accrued while starting new chat..");
        }
    };

    return (
        <div>
            <div className="h-full w-full justify-center">
                <div className="flex justify-between items-center px-4 pt-4">
                    <span className="font-semibold text-gray-500 text-lg dark:text-dark-txt">
                        Friend requests ({user?.friendRequests?.length})
                    </span>
                </div>
                {user?.friendRequests?.map((friendRequest) => (
                    <div key={friendRequest._id} className="p-2">
                        <div className="flex items-center space-x-4 p-2 hover:bg-gray-200 dark:hover:bg-dark-third rounded-lg transition-all">
                            <img
                                src={friendRequest?.photos.profilePhoto}
                                alt={user._id}
                                className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1 h-full">
                                <div className="dark:text-dark-txt">
                                    <span className="font-semibold">
                                        {friendRequest.firstName}
                                    </span>
                                    <span className="float-right">6d</span>
                                </div>
                                <div className="flex space-x-2 mt-2">
                                    <FriendshipActionButton
                                        receiverUserId={user?._id}
                                        senderUserId={friendRequest._id}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="border-b border-gray-200 dark:border-dark-third mt-6"></div>
                <div className="flex justify-between items-center w-full p-4 pt-4 text-gray-500 dark:text-dark-txt">
                    <span className="font-semibold text-lg">Contacts</span>
                    <div className="flex space-x-1">
                        <div className="w-8 h-8 grid place-items-center text-xl hover:bg-gray-200 dark:hover:bg-dark-third rounded-full cursor-pointer">
                            <i className="bx bx-search-alt-2"></i>
                        </div>
                        <div className="w-8 h-8 grid place-items-center text-xl hover:bg-gray-200 dark:hover:bg-dark-third rounded-full cursor-pointer">
                            <i className="bx bx-dots-horizontal-rounded"></i>
                        </div>
                    </div>
                </div>
                <ul className="p-2">
                    {user?.friends?.map((friend) => (
                        <li key={friend?._id}>
                            <div
                                onClick={() => handleContactClick(friend?._id)}
                                className="flex items-center space-x-4 p-2 hover:bg-gray-200 dark:hover:bg-dark-third dark:text-dark-txt rounded-lg cursor-pointer"
                            >
                                <div className="relative">
                                    <img
                                        src={friend?.photos?.profilePhoto}
                                        alt="Friends profile picture"
                                        className="rounded-full w-12 h-12"
                                    />
                                    {friend?.isActive && (
                                        <>
                                            <span className="bg-green-500 w-3 h-3 rounded-full absolute right-0 top-3/4 border-white border-2"></span>
                                        </>
                                    )}
                                </div>
                                <div>
                                    <span className="font-semibold">{friend?.firstName}</span>
                                    {!friend.isActive ? (
                                        <span className="block font-bold text-xs text-gray-500 uppercase tracking-wide mt-1">
                                            Last seen
                                            <p className="text-xs">
                                                {lastLoginFormat(friend?.lastLogin)}
                                            </p>
                                        </span>
                                    ) : (
                                        <span className="block font-bold text-xs text-gray-500 uppercase tracking-wide mt-1">
                                            Active Now
                                        </span>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
