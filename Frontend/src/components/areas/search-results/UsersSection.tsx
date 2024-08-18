import { NavLink } from "react-router-dom";
import defaultProfilePic from "../../../assets/images/default-profile-pic.jpg";
import { User } from "../../../models/User";
import { useCurrentUser } from "../../../context/UserContext";
import { extractMutualFriends } from "../../../utilities/user-utils/userUtils";

type UserListProps = {
  users: User[];
};

export default function UsersSection({ users }: UserListProps): JSX.Element {
  const { user: currentUser } = useCurrentUser();

  return (
    <div className="space-y-6">
      {users?.map((user) => (
        <div
          key={user._id}
          className="relative max-w-md mx-auto md:max-w-2xl bg-white dark:bg-dark-second w-full shadow-lg rounded-xl"
        >
          <div className="flex flex-col md:flex-row p-6">
            <div className="md:w-1/3 flex justify-center md:justify-end mb-6 md:mb-0">
              <div className="relative">
                <NavLink to={`/user-profile/${user._id}`}>
                  <img
                    src={user.photos.profilePhoto || defaultProfilePic}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="shadow-xl rounded-full border-none max-w-[150px] object-cover"
                  />
                </NavLink>
              </div>
            </div>
            <div className="md:w-2/3 flex flex-col justify-center">
              <div className="text-center md:text-left">
                <h3 className="text-2xl dark:text-dark-txt font-bold leading-normal mb-1">
                  {user.firstName} {user.lastName}
                </h3>
                <div className="text-xs dark:text-dark-txt font-bold uppercase mb-4 flex items-center">
                  <i className="fas fa-map-marker-alt mr-2 dark:text-dark-txt opacity-75"></i>
                  {user.address?.state}, {user.address?.country}
                </div>
              </div>
              <div className="flex justify-around mt-6">
                <div className="text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide dark:text-dark-txt">
                    {user.posts?.length}
                  </span>
                  <span className="text-sm text-slate-400">Posts</span>
                </div>
                <div className="text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide dark:text-dark-txt">
                    {
                      extractMutualFriends(currentUser.friends, user.friends)
                        ?.length
                    }
                  </span>
                  <span className="text-sm text-slate-400">Mutual</span>
                </div>
                <div className="text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide dark:text-dark-txt">
                    {user.friends?.length}
                  </span>
                  <span className="text-sm text-slate-400">Friends</span>
                </div>
              </div>
              {user.bio && (
                <div className="mt-6 py-6 border-t border-slate-200 text-center md:text-left">
                  <p className="font-light leading-relaxed dark:text-dark-txt">
                    {user.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
