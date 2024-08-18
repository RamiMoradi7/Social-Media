import { NavLink } from "react-router-dom";
import defaultProfile from "../../../assets/images/default-profile-pic.jpg";
import friends from "../../../assets/images/friends.png";
import { useCurrentUser } from "../../../context/UserContext";
import { useMenuContext } from "../../../context/MenuContext";
import Drawer from "../layout/Menu/Drawer";

export default function LeftSideBar(): JSX.Element {
    const { user } = useCurrentUser();
    const { toggleOpen } = useMenuContext();
    return (
        <>
            <div className="flex justify-center ">
                <div className="w-1/5 pt-16 h-full hidden xl:flex flex-col fixed top-0 left-0">
                    <ul className="p-4">
                        <li>
                            <NavLink
                                to={`/user-profile/${user?._id}`}
                                className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-lg transition-all dark:text-dark-txt dark:hover:bg-dark-third"
                            >
                                <img
                                    src={user?.photos?.profilePhoto || defaultProfile}
                                    alt="Profile picture"
                                    className="w-10 h-10 rounded-full"
                                />
                                <span className="font-semibold">
                                    {user.firstName} {user.lastName}
                                </span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/friends"
                                className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-lg transition-all dark:text-dark-txt dark:hover:bg-dark-third"
                                onClick={() => toggleOpen("friends")}
                            >
                                <img
                                    src={friends}
                                    alt="friends"
                                    className="w-10 h-10 rounded-full"
                                />
                                <span className="font-semibold">Friends</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}
