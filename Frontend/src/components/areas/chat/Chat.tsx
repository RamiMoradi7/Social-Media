import { useEffect, useRef, useState } from "react";
import { useChatToggle } from "../../../hooks/useChatToggle";
import { Chat as ChatModel } from "../../../models/Chat";
import { User } from "../../../models/User";
import CancelSvg from "../../common/svgs/Cancel";
import Message from "./Message";
import SendMessage from "./SendMessage";

type ChatProps = {
    chat: ChatModel;
    user: User;
};

export default function UserChat({ chat, user }: ChatProps): JSX.Element {
    const { isOpen, toggleChat } = useChatToggle(chat?._id);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const messageContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isOpen && messageContainerRef.current) {
            messageContainerRef.current.scrollTop =
                messageContainerRef.current.scrollHeight;
        }
    }, [isOpen, chat.messages]);

    const otherParticipant = chat?.participants.find((p) => p?._id !== user?._id);

    const handleHeaderClick = () => {
        setIsCollapsed((prev) => !prev);
    };

    return (
        <>
            <div
                className={`z-40 fixed bottom-4 right-4 bg-white dark:bg-dark-second  p-4 rounded-lg border border-gray-300 w-[360px] ${isOpen ? (isCollapsed ? "h-[50px] w-[280px]" : "h-[475px]") : "hidden"
                    } transition-all duration-500 ease-in-out`}
            >
                <div
                    className="flex justify-between items-center mb-3 cursor-pointer"
                    onClick={handleHeaderClick}
                >
                    <div className="flex items-center">
                        <h5 className="font-semibold text-lg tracking-tight dark:text-dark-txt">
                            {otherParticipant?.firstName} {otherParticipant?.lastName}
                        </h5>
                        {otherParticipant?.isActive && (
                            <span className="ml-2 bg-green-500 w-3 h-3 rounded-full border-white border-2"></span>
                        )}
                    </div>
                    <button
                        onClick={() => toggleChat()}
                        className="text-gray-500 focus:outline-none ml-2"
                    >
                        <CancelSvg color="dark:text-dark-txt" />
                    </button>
                </div>
                {!isCollapsed && (
                    <div
                        className="pr-4 p-2 overflow-y-auto"
                        style={{ maxHeight: "355px" }}
                        ref={messageContainerRef}
                    >
                        {chat?.messages?.map((message) => (
                            <Message
                                message={message}
                                isCurrentUser={user?._id === message.senderId}
                                key={message._id}
                            />
                        ))}
                    </div>
                )}
                {!isCollapsed && (
                    <div className="absolute bottom-0 left-0 right-0  flex items-center p-2 bg-white dark:bg-dark-second border-t border-gray-200">
                        <SendMessage
                            chatId={chat?._id}
                            receiverUserId={otherParticipant?._id}
                            senderUserId={user?._id}
                        />
                    </div>
                )}
            </div>
        </>
    );
}
