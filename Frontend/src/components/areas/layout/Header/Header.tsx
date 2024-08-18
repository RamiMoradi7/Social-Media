import { NavLink } from "react-router-dom";
import logo from "../../../../assets/images/Friendify.png";
import { useState } from "react";
import UserMenu from "../../auth/AuthMenu";
import SearchBar from "../../home/Search/Search";
import { useCurrentUser } from "../../../../context/UserContext";
const navLinks = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/login",
    label: "Login",
  },
  {
    href: "/register",
    label: "Register",
  },
];

export default function Header(): JSX.Element {
  const [selectedNav, setSelectedNav] = useState("");
  const { user } = useCurrentUser();
  return (
    <header className="flex justify-between items-center py-1 px-7 border-b">
      <NavLink to="/">
        <img
          src={logo}
          alt="logo"
          width={180}
          height={70}
          className="max-w-[180px] h-[70px]"
        />
      </NavLink>

      <nav>
        <ul className="flex gap-x-5 text-[14px]">
          <SearchBar />
          {user ? (
            <UserMenu />
          ) : (
            navLinks.map((link) => (
              <li key={link.label}>
                <NavLink
                  onClick={() => setSelectedNav(link.label)}
                  className={` ${
                    selectedNav === link.label
                      ? "text-zinc-900"
                      : "text-zinc-400"
                  }`}
                  to={link.href}
                >
                  {link.label}
                </NavLink>
              </li>
            ))
          )}
        </ul>
      </nav>
    </header>
  );
}
