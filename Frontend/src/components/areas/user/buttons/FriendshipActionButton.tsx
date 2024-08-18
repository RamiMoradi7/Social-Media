import React from "react";
import { User } from "../../../../models/User";
import { notify } from "../../../../utilities/Notify";
import {
    acceptFriendRequest,
    ignoreFriendRequest
} from "../../../../utilities/user-utils/FriendRequestsUtils";

type FriendshipActionButton = {
  senderUserId: string;
  receiverUserId: string;
  setUser?: (value: React.SetStateAction<User>) => void;
};

type ActionTypes = "accept" | "ignore";

export default function FriendshipActionButton({
  senderUserId,
  receiverUserId,
  setUser,
}: FriendshipActionButton): JSX.Element {
  const handleToggleFriendRequest = async (action: ActionTypes) => {
    try {
      if (action === "accept") {
        await acceptFriendRequest({ senderUserId, receiverUserId, setUser });
      } else if (action === "ignore") {
        await ignoreFriendRequest({ senderUserId, receiverUserId, setUser });
      }
    } catch (err: any) {
      notify.error(err);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        className="w-20 h-8 flex items-center justify-center rounded-lg cursor-pointer bg-green-500 text-white border-green-500
         border group hover:bg-opacity-75 active:bg-opacity-75 transition-all duration-300 focus:outline-none"
        onClick={() => handleToggleFriendRequest("accept")}
      >
        Accept
      </button>
      <button
        className="w-20 h-8 flex items-center justify-center rounded-lg cursor-pointer bg-red-500 text-white border-red-500 border group hover:bg-opacity-75 active:bg-opacity-75 transition-all duration-300 focus:outline-none"
        onClick={() => handleToggleFriendRequest("ignore")}
      >
        Ignore
      </button>
    </div>
  );
}
