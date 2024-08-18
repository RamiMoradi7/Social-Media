import { useState } from "react";
import { useSelector } from "react-redux";
import { useCurrentUser } from "../../../context/UserContext";
import { AppState } from "../../../redux/AppState";
import ChatListItem from "./ChatListItem";
import NewChat from "./NewChat";

export default function ChatList(): JSX.Element {
    const { user } = useCurrentUser();
    const { chats } = useSelector((appState: AppState) => appState?.chatState);
    const { firstName, lastName, photos, email, address } = user;
    const [view, setView] = useState("chatList");

    const handleStartNewChat = () => {
        setView("newChat");
    };

    const handleBackToChatList = () => {
        setView("chatList");
    };

    const filteredChats = chats
        ?.filter((chat) => !chat.deletedBy.some((c) => c.userId === user?._id))
        .sort(
            (a, b) =>
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

    return (
        <div className="fixed dark:bg-dark-second top-40 lg:top-14 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg shadow-xl z-50 overflow-hidden transition-all duration-300 ease-in-out">
            <section className="flex justify-center antialiased bg-transparent text-gray-600 p-4">
                <div className="max-w-[340px] dark:bg-dark-second mx-auto bg-white shadow-lg rounded-lg overflow-y-auto max-h-[500px]">
                    <header className="pt-6 pb-4 px-5 border-b border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center">
                                <div className="inline-flex items-start mr-3">
                                    <img
                                        className="rounded-full"
                                        src={photos?.profilePhoto}
                                        width="48"
                                        height="48"
                                        alt="user-profile"
                                    />
                                </div>
                                <div className="pr-1">
                                    <div className="inline-flex text-gray-800 hover:text-gray-900">
                                        <h2 className="text-xl font-bold dark:text-dark-txt">
                                            {firstName} {lastName}
                                        </h2>
                                    </div>
                                    <div className="block text-sm font-medium text-gray-500 hover:text-indigo-500 dark:text-dark-txt">
                                        {email}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center sm:justify-start space-x-4">
                            <div className="flex items-center">
                                <svg
                                    className="w-4 h-4 fill-current flex-shrink-0 text-gray-400 dark:text-dark-txt"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 8.992a2 2 0 1 1-.002-3.998A2 2 0 0 1 8 8.992Zm-.7 6.694c-.1-.1-4.2-3.696-4.2-3.796C1.7 10.69 1 8.892 1 6.994 1 3.097 4.1 0 8 0s7 3.097 7 6.994c0 1.898-.7 3.697-2.1 4.996-.1.1-4.1 3.696-4.2 3.796-.4.3-1 .3-1.4-.1Zm-2.7-4.995L8 13.688l3.4-2.997c1-1 1.6-2.198 1.6-3.597 0-2.798-2.2-4.996-5-4.996S3 4.196 3 6.994c0 1.399.6 2.698 1.6 3.697 0-.1 0-.1 0 0Z" />
                                </svg>
                                <span className="text-sm ml-2 whitespace-nowrap text-gray-500 dark:text-dark-txt">
                                    {address?.country} {address?.state},{address?.city}
                                </span>
                            </div>
                        </div>
                    </header>
                    <div className="py-3 px-5">
                        {view === "chatList" && (
                            <>
                                <h3 className="text-xs font-semibold uppercase text-gray-400 mb-1">
                                    Chats
                                </h3>
                                <div className="divide-y divide-gray-200">
                                    {filteredChats?.map((chat) => (
                                        <ChatListItem
                                            chat={chat}
                                            userId={user?._id}
                                            key={chat?._id}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={handleStartNewChat}
                                    className="mt-4 flex items-center justify-center text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 rounded-full py-2 px-4 shadow-lg focus:outline-none focus-visible:ring-2"
                                >
                                    Start new chat
                                </button>
                            </>
                        )}
                        {view === "newChat" && (
                            <>
                                <NewChat handleBackToChatList={handleBackToChatList} />
                                <button
                                    onClick={handleBackToChatList}
                                    className="mt-4 flex items-center justify-center text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 rounded-full py-2 px-4 shadow-lg focus:outline-none focus-visible:ring-2"
                                >
                                    Back to Chat List
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
