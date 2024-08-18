import { SetStateAction } from "react";
import { User } from "../../../../models/User";
import {
  isFriendWith,
  isUserSentFriendRequest,
} from "../../../../utilities/user-utils/userUtils";
import EditProfileButton from "../buttons/EditProfileButton";
import AddFriendButton from "../buttons/AddFriendButton";
import RemoveFriendButton from "../buttons/RemoveFriendButton";
import FriendshipActionButton from "../buttons/FriendshipActionButton";
import SendMessageButton from "../buttons/SendMessageButton";

type ProfileButtonsProps = {
  currentUser: User;
  profileUser: User;
  isCurrentUser: boolean;
  setUser?: (value: SetStateAction<User>) => void;
};

export default function ProfileButtons({
  currentUser,
  profileUser,
  setUser,
}: ProfileButtonsProps): JSX.Element {
  const currentUserId = currentUser?._id;
  const profileUserId = profileUser?._id;

  const isFriend = isFriendWith(currentUser, profileUserId);
  const isCurrentUser = currentUserId === profileUserId;
  const isProfileUserSentRequest = isUserSentFriendRequest(
    profileUser?.sentRequests,
    currentUserId
  );

  return (
    <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-4">
      {isCurrentUser ? (
        <EditProfileButton />
      ) : (
        !isFriend &&
        !isProfileUserSentRequest && (
          <AddFriendButton
            currentUserId={currentUserId}
            userId={profileUserId}
            isFriendRequestSent={profileUser?.isFriendRequestSent}
            setUser={setUser}
          />
        )
      )}
      {isFriend && (
        <>
          <RemoveFriendButton
            senderUserId={currentUserId}
            receiverUserId={profileUserId}
            targetName={profileUser?.firstName}
            setUser={setUser}
          />
          <SendMessageButton profileUser={profileUser} />
        </>
      )}
      {isProfileUserSentRequest && (
        <FriendshipActionButton
          receiverUserId={currentUserId}
          senderUserId={profileUserId}
          setUser={setUser}
        />
      )}
    </div>
  );
}
