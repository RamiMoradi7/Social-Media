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
            <h1 className="text-black dark:text-dark-txt  mt-2 text-3xl lg:text-5xl md:text-4xl mr-12 leading-tight">
                {profileUser?.firstName} {profileUser?.lastName}
            </h1>
            <div className="flex items-center mt-4 gap-4">
                {!isCurrentUser && mutualFriends?.length > 0 && (
                    <div className="flex items-center space-x-3">
                        <p className="text-black dark:text-dark-txt font-medium text-lg">
                            Mutual Friends:
                        </p>
                        <div className="flex space-x-3">
                            {mutualFriends.map((friend) => (
                                <NavLink key={friend._id} to={`/user-profile/${friend._id}`}>
                                    <img
                                        className="w-12 h-12 object-cover border-2 ml-2 border-white rounded-full shadow-md transition-transform duration-200 ease-in-out transform hover:scale-110"
                                        src={friend?.photos?.profilePhoto}
                                        alt="Mutual Friend"
                                    />
                                </NavLink>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
