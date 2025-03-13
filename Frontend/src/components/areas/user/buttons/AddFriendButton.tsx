import toast from "react-hot-toast";
import { socketService } from "../../../../services/SocketService";
import AddSvg from "../../../common/svgs/Add";
import CancelSvg from "../../../common/svgs/Cancel";

type AddFriendButton = {
    isFriendRequestSent: boolean;
    currentUserId: string;
    userId: string;
};

export default function AddFriendButton({
    isFriendRequestSent,
    currentUserId,
    userId,
}: AddFriendButton): JSX.Element {
    const handleToggleFriendRequest = async () => {
        try {
            socketService.sendFriendAction("friendRequest", currentUserId, userId)
        } catch (err: any) {
            toast.error(err);
        }
    };
    return (
        <button
            className=" rounded-lg relative w-48 h-10 cursor-pointer flex items-center border border-blue-500 bg-blue-500 group hover:bg-blue-500 active:bg-blue-500 active:border-blue-500"
            onClick={handleToggleFriendRequest}
        >
            <span className="text-gray-200 font-semibold ml-8  transform group-hover:translate-x-20 transition-all duration-300">
                {isFriendRequestSent ? "Cancel" : "Add Friend"}
            </span>
            <span className="absolute right-0 h-full w-10 rounded-lg bg-blue-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
                {isFriendRequestSent ? <CancelSvg color="white" /> : <AddSvg />}
            </span>
        </button>
    );
}
