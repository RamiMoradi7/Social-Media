import { User } from "../../../../models/User";
import { isChatOpen } from "../../../../redux/ChatsSlice";
import { store } from "../../../../redux/Store";
import MessageSvg from "../../../common/svgs/MessageSvg";

type SendMessageBtnProps = {
  profileUser: User;
};

export default function SendMessageButton({
  profileUser,
}: SendMessageBtnProps): JSX.Element {
  const handleSendMessage = () => {
    const chats = store.getState().chatState.chats;
    const chat = chats?.find((chat) =>
      chat.participants.some((p) => p._id === profileUser?._id)
    );

    store.dispatch(isChatOpen({ chatId: chat?._id, isOpen: true }));
  };
  return (
    <button
      className=" rounded-lg relative w-48 h-10 cursor-pointer flex items-center border border-blue-500 bg-blue-500 group hover:bg-blue-500 active:bg-blue-500 active:border-blue-500"
      onClick={handleSendMessage}
    >
      <span className="text-gray-200 font-semibold ml-8  transform group-hover:translate-x-20 transition-all duration-300">
        Send Message
      </span>
      <span className="absolute right-0 h-full w-10 rounded-lg bg-blue-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
        <MessageSvg />
      </span>
    </button>
  );
}
