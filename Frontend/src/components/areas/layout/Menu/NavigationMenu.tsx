import { useSelector } from "react-redux";
import { AppState } from "../../../../redux/AppState";
import MenuItem from "./MenuItem";

interface NavigationMenuProps {
  isOpen: string | null;
  toggleOpen: (section: string) => void;
}

type MenuItem = {
  icon: string;
  current: string;
  count?: number;
  link?: string;
};

export default function NavigationMenu({
  isOpen,
  toggleOpen,
}: NavigationMenuProps): JSX.Element {
  const { notifications, unreadCount } = useSelector(
    (appState: AppState) => appState.notificationsState
  );
  const messages = notifications?.filter(
    (notification) => notification.type === "message" && !notification.isRead
  );

  const menuItems: MenuItem[] = [
    {
      icon: "bx bxs-home",
      current: "home",
      link: "/",
    },
    {
      icon: "bx bxl-messenger",
      current: "chat",
      count: messages?.length || null,
    },
    {
      icon: "bx bx-group",
      current: "friends",
      link: "/friends",
    },
    {
      icon: "bx bxs-bell",
      current: "notifications",
      count: unreadCount || null,
    },
  ];

  return (
    <ul className="flex w-full lg:w-max bg-white dark:bg-dark-second md:h-10  items-center justify-center">
      {menuItems?.map((item) => (
        <MenuItem
          key={item.current}
          icon={item.icon}
          current={item.current}
          count={item.count}
          isOpen={isOpen}
          onClick={() => toggleOpen(item.current)}
          link={item.link}
        />
      ))}
      <div className="lg:hidden block p-4">
        <button className="text-3xl" onClick={() => toggleOpen("menu")}>
          <i className="bx bx-menu"></i>
        </button>
      </div>
    </ul>
  );
}
