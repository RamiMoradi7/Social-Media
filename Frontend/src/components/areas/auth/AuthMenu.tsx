import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import defaultProfile from "../../../assets/images/default-profile-pic.jpg";
import { authService } from "../../../services/AuthService";
import { notify } from "../../../utilities/Notify";
import { useCurrentUser } from "../../../context/UserContext";
import { useMenuContext } from "../../../context/MenuContext";

const UserMenu: React.FC = () => {
    const [open, setOpen] = useState(false);
    const { user } = useCurrentUser();
    const { toggleOpen } = useMenuContext();

    const logOut = async () => {
        try {
            notify.success(`Hope to see you back, ${user.firstName}`);
            await authService.logOut();
            setOpen(false);

        } catch (err: any) {
            notify.error(err)

        }
    };

    const closeMenu = () => {
        setOpen(false);
    };

    return (
        <div className="relative flex-shrink-0">
            <div
                tabIndex={-1}
                onClick={() => {
                    setOpen((prevOpen) => !prevOpen);
                    toggleOpen(null);
                }}
            >
                <button
                    type="button"
                    className="flex rounded-full text-sm text-white focus:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-900"
                    id="user-menu-button"
                    aria-expanded={open}
                    aria-haspopup="true"
                >
                    <span className="sr-only">Open user menu</span>
                    <img
                        className="h-10 w-10 rounded-full"
                        src={
                            user?.photos?.profilePhoto
                                ? user.photos?.profilePhoto
                                : defaultProfile
                        }
                        alt="User profile picture"
                    />
                </button>
            </div>

            {open && (
                <div
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    aria-labelledby="user-menu-button"
                    role="menu"
                    onClick={() => setOpen(false)}
                >
                    <NavLink
                        to={`/user-profile/${user._id}`}
                        className="block py-2 px-4 text-sm text-gray-700"
                        role="menuitem"
                        tabIndex={-1}
                        onClick={closeMenu}
                    >
                        Your Profile
                    </NavLink>
                    <NavLink
                        to={`/user/settings`}
                        className="block py-2 px-4 text-sm text-gray-700"
                        role="menuitem"
                        tabIndex={-1}
                        onClick={closeMenu}
                    >
                        Settings
                    </NavLink>
                    <NavLink
                        to={"/login"}
                        className="block py-2 px-4 text-sm text-gray-700"
                        role="menuitem"
                        tabIndex={-1}
                        onClick={() => logOut()}
                    >
                        Sign out
                    </NavLink>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
