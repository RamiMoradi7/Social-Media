import { useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../../redux/AppState";
import UserMenu from "../../auth/AuthMenu";
import UserChat from "../../chat/Chat";
import ChatList from "../../chat/ChatList";
import NotificationList from "../../home/Notifications/NotificationList";
import RightSideBar from "../../home/RightSideBar";
import Search from "../../home/Search/Search";
import DarkModeToggle from "./DarkModeToggle";
import DesktopUserMenu from "./DesktopUserMenu";
import Drawer from "./Drawer";
import LogoSection from "./LogoSection";
import NavigationMenu from "./NavigationMenu";
import { useCurrentUser } from "../../../../redux/Selectors";

export default function Menu(): JSX.Element {
    const user = useCurrentUser();
    const [isOpen, setIsOpen] = useState<string | null>(null);

    const { chats, isOpen: isChatOpen } = useSelector(
        (appState: AppState) => appState.chatState
    );

    const toggleOpen = (menu: string) => {
        setIsOpen((prev) => (prev === menu ? null : menu));
    };

    const renderSection = () => {
        switch (isOpen) {
            case "menu":
                return <Drawer
                    open={isOpen}
                    toggleMenu={toggleOpen}
                    element={<RightSideBar toggleOpen={toggleOpen} />}
                />
            case "notifications":
                return <NotificationList toggleOpen={toggleOpen} />
            case "chat":
                return <ChatList />
        }
    }
    return (
        <>
            <nav className="bg-white dark:bg-dark-second md:h-14 sm:h-36 w-full shadow-2xl flex flex-col md:flex-row items-center justify-center md:justify-between fixed top-0 z-40 border-b dark:border-dark-third ">
                <div className="flex col-3 items-center justify-between w-full md:w-max px-6 py-4">
                    <LogoSection />
                    <div className="flex items-center justify-between space-x-2">
                        <Search />
                        <DarkModeToggle className="md:hidden" />
                        <div className="lg:hidden md:hidden bg-gray-200 dark:bg-dark-third rounded-full cursor-pointer hover:bg-gray-300 dark:text-dark-txt">
                            <UserMenu />
                        </div>
                    </div>
                </div>
                <NavigationMenu isOpen={isOpen} toggleOpen={toggleOpen} />
                <DesktopUserMenu />
            </nav>
            {isChatOpen &&
                chats?.map((chat) => (<UserChat chat={chat} user={user} key={chat?._id} />))}
            {renderSection()}
        </>
    );
}
