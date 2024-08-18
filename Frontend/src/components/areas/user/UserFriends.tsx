import { NavLink } from "react-router-dom";
import { User } from "../../../models/User";
import RemoveFriendButton from "./buttons/RemoveFriendButton";

type UserFriendsProps = {
    user: User
    setUser: (user: User) => void
    isOwnProfile: boolean
}


export default function UserFriends({ setUser, user, isOwnProfile }: UserFriendsProps): JSX.Element {
    const { friends, _id } = user
    return (
        <div className="min-h-screen bg-gray-100 py-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6">
                    {friends?.map((friend) => (
                        <div key={friend._id} className="relative flex flex-col items-center rounded-lg w-full bg-white p-4 shadow-lg">
                            <div className="relative h-32 w-full rounded-xl overflow-hidden">
                                <NavLink to={`/user-profile/${friend._id}`}>
                                    <img
                                        src={friend.photos?.coverPhoto}
                                        alt="Cover"
                                        className="absolute inset-0 h-full w-full object-cover rounded-xl"
                                    />
                                    <div className="absolute -bottom-0 left-1/2 transform -translate-x-1/2 flex h-[87px] w-[87px] items-center justify-center rounded-full border-4 border-white bg-pink-400">
                                        <img
                                            src={friend.photos?.profilePhoto}
                                            alt="Profile"
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    </div>
                                </NavLink>
                            </div>
                            <div className="mt-4 flex flex-col items-center">
                                <h6 className="text-xl font-thin text-gray-900">
                                    {friend?.firstName} {friend?.lastName}
                                </h6>
                                {isOwnProfile &&
                                    <RemoveFriendButton receiverUserId={friend?._id} senderUserId={_id} targetName={friend?.firstName} setUser={setUser} />
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
