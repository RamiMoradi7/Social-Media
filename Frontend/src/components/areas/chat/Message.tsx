import { NavLink } from "react-router-dom";
import { Message as MessageModel } from "../../../models/Message";

type MessageProps = {
  message: MessageModel;
  isCurrentUser: boolean;
};

export default function Message({
  message,
  isCurrentUser,
}: MessageProps): JSX.Element {
  return (
    <div
      key={message?._id}
      className={`flex items-start mb-4 ${
        isCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex items-center ${
          isCurrentUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <NavLink to={`/user-profile/${message.senderId}`}>
          <img
            className="rounded-full object-cover w-8 h-8 bg-gray-200 border border-gray-300 ml-2"
            src={message.sender?.photos.profilePhoto}
            alt="Profile"
          />
        </NavLink>
        <div
          className={`ml-2 p-2 rounded-lg ${
            isCurrentUser
              ? "bg-blue-200 text-blue-800"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {message.content}
          {message?.imageUrl && (
            <div className="mt-2">
              <a
                href={message.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={message?.imageUrl}
                  className="w-[100px] rounded-lg"
                  alt="Message Image"
                />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
