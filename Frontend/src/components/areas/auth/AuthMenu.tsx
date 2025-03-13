import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import defaultProfile from "../../../assets/images/default-profile-pic.jpg";
import { authService } from "../../../services/AuthService";
import { useCurrentUser } from "../../../redux/Selectors";

const UserMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const user = useCurrentUser();
  const menuRef = useRef<HTMLDivElement>(null);

  const logOut = async () => {
    try {
      toast.success(`Hope to see you back, ${user.firstName}`);
      await authService.logOut();
      closeMenu();
    } catch (err: any) {
      toast.error(err);
    }
  };

  const closeMenu = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex-shrink-0">
      <div
        tabIndex={-1}
        onClick={() => {
          setOpen((prevOpen) => !prevOpen);
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
            className="h-12 w-12 rounded-full"
            src={user.photos?.profilePhoto || defaultProfile}
            alt="User"
          />
        </button>
      </div>

      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          aria-labelledby="user-menu-button"
          role="menu"
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
