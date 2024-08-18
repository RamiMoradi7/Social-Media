import { useCurrentUser } from "../../../context/UserContext";
import { isChatOpen } from "../../../redux/ChatsSlice";
import { store } from "../../../redux/Store";
import { chatsService } from "../../../services/ChatsService";
import { notify } from "../../../utilities/Notify";

type NewChatProps = {
    handleBackToChatList: () => void;
};

export default function NewChat({
    handleBackToChatList,
}: NewChatProps): JSX.Element {
    const { user } = useCurrentUser();
    const { friends, _id: currentUserId } = user;
    const handleNewChat = async (participantId: string) => {
        try {
            const existingChat = store.getState().chatState.chats.find((chat) => chat.participants.find((p) => p._id === participantId))
            if (existingChat) {
                store.dispatch(isChatOpen({ chatId: existingChat._id, isOpen: true }))
            } else {
                await chatsService.startChat([participantId, currentUserId]);
            }
            handleBackToChatList();
        } catch (err: any) {
            notify.error(err);
        }
    };

    return (
        <>
            {friends?.map((friend) => (
                <button
                    key={friend._id}
                    onClick={() => handleNewChat(friend._id)}
                    className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50"
                >
                    <div className="flex items-center">
                        <img
                            className="rounded-full items-start flex-shrink-0 mr-3"
                            src={friend.photos.profilePhoto}
                            width="32"
                            height="32"
                            alt="User Profile"
                        />
                        <div>
                            <h4 className="text-sm font-semibold dark:text-dark-txt">
                                {friend.firstName}
                            </h4>
                        </div>
                    </div>
                </button>
            ))}
        </>
    );
}
