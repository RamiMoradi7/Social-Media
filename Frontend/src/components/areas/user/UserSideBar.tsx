import { NavLink } from "react-router-dom";
import { User } from "../../../models/User";
import FriendRequests from "./FriendRequests";
import UserInfo from "./UserInfo";

type UserSideBarProps = {
  user: User;
  isOwnProfile: boolean;
};

export const UserSideBar = ({ user, isOwnProfile }: UserSideBarProps) => {
  return (
    <div>
      <div className="h-full w-full bg-white dark:bg-dark-third ">
        <UserInfo user={user} />
        <div className="border-b border-gray-200 dark:border-dark-third mt-3"></div>
        <div className="bg-white dark:bg-dark-third  shadow rounded-lg p-4">
          <div className="flex justify-between items-center px-4 pt-4 text-gray-500 dark:text-dark-txt">
            <span className="font-semibold text-lg">Friends</span>
            <span className="font-semibold text-lg">See all</span>
          </div>
          <div className="flex flex-wrap justify-start items-center p-2">
            {user?.friends?.map((friend) => (
              <NavLink key={friend._id} to={`/user-profile/${friend._id}`}>
                <img
                  src={friend?.photos?.profilePhoto}
                  alt={`Profile of ${friend.firstName}`}
                  className="w-14 h-14 rounded-full object-cover m-1"
                />
              </NavLink>
            ))}
          </div>
        </div>
        {isOwnProfile && (
          <FriendRequests
            friendRequests={user?.friendRequests}
            receiverUserId={user?._id}
          />
        )}
      </div>
    </div>
  );
};

export default UserSideBar;
