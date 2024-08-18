import { NavLink } from "react-router-dom";
import { User } from "../../../../models/User";
import { extractMutualFriends } from "../../../../utilities/user-utils/userUtils";

type ProfileInfoProps = {
  currentUser: User;
  profileUser: User;
  isCurrentUser: boolean;
};

export default function ProfileInfo({
  currentUser,
  profileUser,
  isCurrentUser,
}: ProfileInfoProps): JSX.Element {
  const mutualFriends = extractMutualFriends(
    currentUser?.friends,
    profileUser?.friends
  );

  return (
    <>
      <h1 className="text-black dark:text-dark-txt  font-thin mt-2 lg:text-4xl md:text-3xl sm:text-3xl mr-12">
        {profileUser?.firstName} {profileUser?.lastName}
      </h1>
      <div className="flex items-center mt-4">
        {!isCurrentUser && mutualFriends?.length && (
          <>
            <p className="text-black dark:text-dark-txt font-medium">Mutuals: </p>
            {mutualFriends?.length > 0 &&
              mutualFriends.map((friend) => (
                <NavLink key={friend._id} to={`/user-profile/${friend._id}`}>
                  <img
                    key={friend._id}
                    className="w-10 h-10 object-cover border-2 ml-2 border-white rounded-full shadow-md cursor-pointer"
                    src={friend?.photos?.profilePhoto}
                    alt="Mutual Friend"
                  />
                </NavLink>
              ))}
          </>
        )}
      </div>
    </>
  );
}
