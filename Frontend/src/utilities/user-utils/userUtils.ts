import { User } from "../../models/User";

export const isFriendWith = (
  currentUser: User | null,
  userProfileId: string
) => {
  return !!currentUser.friends?.find((friend) => friend._id === userProfileId);
};

export const isCurrentUser = (currentUserId: string, userProfileId: string) => {
  return currentUserId === userProfileId;
};

export const isUserSentFriendRequest = (
  sentRequests: Partial<User>[],
  currentUserId: string
): boolean => {
  return sentRequests?.some((request) => request._id === currentUserId);
};

export const extractMutualFriends = (
  currentUserFriends: Partial<User>[],
  userFriends: Partial<User>[]
) => {
  const mutuals = currentUserFriends?.filter((friend) =>
    userFriends?.some((userFriend) => userFriend._id === friend._id)
  );
  return mutuals;
};
