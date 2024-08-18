import { NavLink } from "react-router-dom";
import { User } from "../../../models/User";
import FriendshipActionButton from "./buttons/FriendshipActionButton";

type FriendRequestsProps = {
  friendRequests: User[];
  receiverUserId: string;
  setUser?: (value: React.SetStateAction<User>) => void;
};

export default function FriendRequests({
  friendRequests,
  receiverUserId,
  setUser,
}: FriendRequestsProps): JSX.Element {
  return (
    <div className="flex items-center justify-center dark:bg-dark-third mt-3">
      <div className="bg-white dark:bg-dark-third rounded-lg shadow-xl border p-8 w-full">
        <div className="mb-4">
          <h1 className="font-semibold dark:text-dark-txt">
            Friend Requests ({friendRequests?.length})
          </h1>
        </div>
        {friendRequests?.map((friendRequest) => (
          <div
            key={friendRequest._id}
            className="flex justify-center items-center mb-8"
          >
            <div className="w-2/5">
              <NavLink to={`/user-profile/${friendRequest?._id}`}>
                <img
                  className="w-12 h-12  rounded-full border dark:bg-dark-second shadow-sm"
                  src={friendRequest?.photos?.profilePhoto}
                  alt="user image"
                />
              </NavLink>
            </div>
            <div className="w-3/5">
              <div>
                <span className="font-semibold dark:text-dark-txt">
                  {friendRequest.firstName}&nbsp;
                </span>
                <span className="dark:text-dark-txt">
                  wants to be your friend
                </span>
              </div>
              <FriendshipActionButton
                receiverUserId={receiverUserId}
                senderUserId={friendRequest._id}
                setUser={setUser}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
