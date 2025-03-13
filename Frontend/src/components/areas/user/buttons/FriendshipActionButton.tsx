import toast from "react-hot-toast";
import { socketService } from "../../../../services/SocketService";

type FriendshipActionButton = {
    senderUserId: string;
    receiverUserId: string;
};

type ActionTypes = "accept" | "ignore";

export default function FriendshipActionButton({
    senderUserId,
    receiverUserId,
}: FriendshipActionButton): JSX.Element {
    const handleToggleFriendRequest = async (action: ActionTypes) => {
        try {
            switch (action) {
                case "accept":
                    socketService.sendFriendAction("acceptRequest", senderUserId, receiverUserId);
                    break;
                case "ignore":
                    socketService.sendFriendAction("ignoreRequest", senderUserId, receiverUserId)
                    break;

            }
        } catch (err: any) {
            toast.error(err);
        }
    };

    return (
        <div className="flex gap-2">
            <button
                className="w-20 h-8 flex items-center justify-center rounded-lg cursor-pointer bg-green-500 text-white border-green-500 border group hover:bg-opacity-75 active:bg-opacity-75 transition-all duration-300 focus:outline-none"
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
