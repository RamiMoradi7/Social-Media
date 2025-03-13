import { User } from "../../../../models/User";
import {
    isFriendWith,
    isUserSentFriendRequest,
} from "../../../../utilities/user-utils/userUtils";
import AddFriendButton from "../buttons/AddFriendButton";
import EditProfileButton from "../buttons/EditProfileButton";
import FriendshipActionButton from "../buttons/FriendshipActionButton";
import RemoveFriendButton from "../buttons/RemoveFriendButton";
import SendMessageButton from "../buttons/SendMessageButton";

type ProfileButtonsProps = {
    currentUser: User;
    profileUser: User;
    isCurrentUser: boolean;
};


export default function ProfileButtons({
    currentUser,
    profileUser,
}: ProfileButtonsProps): JSX.Element {
    const currentUserId = currentUser?._id;
    const profileUserId = profileUser?._id;

    const isFriend = isFriendWith(profileUser, currentUserId);
    const isCurrentUser = currentUserId === profileUserId;
    const isProfileUserSentRequest = isUserSentFriendRequest(profileUser?.sentRequests, currentUserId)

    return (
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mr-6 mt-4">
            {isCurrentUser ? (
                <EditProfileButton />
            ) : (
                !isFriend &&
                !isProfileUserSentRequest && (
                    <AddFriendButton
                        currentUserId={currentUserId}
                        userId={profileUserId}
                        isFriendRequestSent={profileUser?.isFriendRequestSent}
                    />
                )
            )}
            {isFriend && (
                <>
                    <RemoveFriendButton
                        senderUserId={currentUserId}
                        receiverUserId={profileUserId}
                        targetName={profileUser?.firstName}
                    />
                    <SendMessageButton profileUser={profileUser} />
                </>
            )}
            {isProfileUserSentRequest && (
                <FriendshipActionButton
                    receiverUserId={currentUserId}
                    senderUserId={profileUserId}
                />
            )}
        </div>
    );
}
