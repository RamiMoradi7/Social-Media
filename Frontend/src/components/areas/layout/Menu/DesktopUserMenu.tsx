import UserMenu from "../../auth/AuthMenu";
import DarkModeToggle from "./DarkModeToggle";

export default function DesktopUserMenu(): JSX.Element {
  return (
    <ul className="hidden md:flex p-16 items-center justify-center">
      <li>
        <div className=" mr-8 inline-flex items-center justify-center p-1 rounded-full hover:bg-gray-200 dark:hover:bg-dark-third mx-1">
          <UserMenu />
        </div>
      </li>
      <li>
        <DarkModeToggle />
      </li>
    </ul>
  );
}
