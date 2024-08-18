import { useState } from "react";
import { User } from "../../../../models/User";
import { usersService } from "../../../../services/UsersService";
import { store } from "../../../../redux/Store";
import { updateUser } from "../../../../redux/AuthSlice";
import { notify } from "../../../../utilities/Notify";
import CancelSvg from "../../../common/svgs/Cancel";
import ConfirmationPopup from "../../../common/ConfirmationPopup";

type RemoveFriendButtonProps = {
  senderUserId: string;
  receiverUserId: string;
  targetName: string;
  setUser: (user: User) => void;
};

export default function RemoveFriendButton({
  senderUserId,
  receiverUserId,
  targetName,
  setUser,
}: RemoveFriendButtonProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const removeFriend = async () => {
    try {
      const { senderUser, receiverUser } = await usersService.deleteFriendship(
        senderUserId,
        receiverUserId
      );
      store.dispatch(updateUser(senderUser));
      if (setUser) {
        setUser(receiverUser);
      }
    } catch (err: any) {
      notify.error(err);
    }
  };
  return (
    <>
      <button
        className=" rounded-lg relative w-48 h-10 cursor-pointer flex items-center border border-blue-500 bg-blue-500 group hover:bg-blue-500 active:bg-blue-500 active:border-blue-500"
        onClick={toggleModal}
      >
        <span className="text-gray-200 font-semibold ml-8  transform group-hover:translate-x-20 transition-all duration-300">
          Cancel Friendship
        </span>
        <span className="absolute right-0 h-full w-10 rounded-lg bg-blue-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
          <CancelSvg color="black" />
        </span>
      </button>
      {isOpen && (
        <ConfirmationPopup
          message={`Are you sure you want to unfriend ${targetName}? This action cannot be undone.`}
          onCancel={toggleModal}
          onConfirm={removeFriend}
        />
      )}
    </>
  );
}
