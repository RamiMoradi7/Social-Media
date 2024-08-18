import { User } from "../../models/User";
import { updateUser } from "../../redux/AuthSlice";
import { store } from "../../redux/Store";
import { usersService } from "../../services/UsersService";
import { notify } from "../Notify";

type FriendRequestProps = {
  senderUserId: string;
  receiverUserId: string;
  setUser?: (value: React.SetStateAction<User>) => void;
};

export const acceptFriendRequest = async ({
  receiverUserId,
  senderUserId,
  setUser,
}: FriendRequestProps) => {
  try {
    const { receiverUser, senderUser } = await usersService.acceptFriendRequest(
      senderUserId,
      receiverUserId
    );
    if (setUser) {
      setUser(senderUser);
    }
    store.dispatch(updateUser(receiverUser));
  } catch (err: any) {
    notify.error(err);
  }
};

export const ignoreFriendRequest = async ({
  receiverUserId,
  senderUserId,
  setUser,
}: FriendRequestProps) => {
  try {
    const { receiverUser, senderUser } = await usersService.deleteFriendRequest(
      senderUserId,
      receiverUserId
    );
    if (setUser) {
      setUser(senderUser);
    }
    store.dispatch(updateUser(receiverUser));
  } catch (err: any) {
    notify.error(err);
  }
};
