import UserMenu from "../../auth/AuthMenu";
import DarkModeToggle from "./DarkModeToggle";

export default function DesktopUserMenu(): JSX.Element {
    return (
        <ul className="hidden md:flex mx-4 items-center justify-center">
            <li>
                <div className=" mr-8 inline-flex items-center justify-center p-1 rounded-full hover:bg-gray-200 dark:hover:bg-dark-third mx-1">
                    <UserMenu />
                </div>
            </li>
            <li>
                <div
                    className="text-2xl grid place-items-center bg-gray-200 dark:bg-dark-third rounded-full w-10 h-10 cursor-pointer hover:bg-gray-300 dark:text-dark-txt"
                >
                    <i className="bx bx-plus"></i>
                </div>
            </li>

            <li>
                <DarkModeToggle />
            </li>
        </ul>
    );
}
