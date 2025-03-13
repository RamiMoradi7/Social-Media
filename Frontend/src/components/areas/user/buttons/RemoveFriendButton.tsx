import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { socketService } from "../../../../services/SocketService";
import CancelSvg from "../../../common/svgs/Cancel";

type RemoveFriendButtonProps = {
    senderUserId: string;
    receiverUserId: string;
    targetName: string;
};

export default function RemoveFriendButton({
    senderUserId,
    receiverUserId,
    targetName,
}: RemoveFriendButtonProps): JSX.Element {
    const removeFriend = async () => {
        try {
            const result = await Swal.fire({
                title: ` Are you sure you want to unfriend ${targetName} ?`,
                text: `This action is permanent and cannot be undone. Please confirm if you'd like to proceed.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, unfriend.",
            });
            if (result.isConfirmed) {
                socketService.sendFriendAction("deleteFriendship", senderUserId, receiverUserId)
                Swal.fire("Unfriended!", `${targetName} has been removed from your friends list.`, "success");
            }
        } catch (err: any) {
            toast.error(err);
        }
    }
    return (
        <button
            className=" rounded-lg relative w-48 h-10 cursor-pointer flex items-center border border-blue-500 bg-blue-500 group hover:bg-blue-500 active:bg-blue-500 active:border-blue-500"
            onClick={removeFriend}
        >
            <span className="text-gray-200 font-semibold ml-8  transform group-hover:translate-x-20 transition-all duration-300">
                Cancel Friendship
            </span>
            <span className="absolute right-0 h-full w-10 rounded-lg bg-blue-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
                <CancelSvg color="black" />
            </span>
        </button>
    );
}
