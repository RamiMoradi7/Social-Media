import { useMenuContext } from "../../../context/MenuContext";
import { User } from "../../../models/User";
import Drawer from "../layout/Menu/Drawer";
import UserSideBar from "./UserSideBar";

type SidebarSectionProps = {
  displayCurrentUser: User;
  isOwnProfile: boolean;
};

export default function SidebarSection({
  displayCurrentUser,
  isOwnProfile,
}: SidebarSectionProps): JSX.Element {
  const { isOpen, toggleOpen } = useMenuContext();
  return (
    <>
      <aside className="hidden md:block h-screen sticky top-0 xl:flex bg-gray-100">
        <UserSideBar user={displayCurrentUser} isOwnProfile={isOwnProfile} />
        {isOpen === "menu" && (
          <Drawer
            open={isOpen}
            toggleMenu={toggleOpen}
            element={
              <UserSideBar
                user={displayCurrentUser}
                isOwnProfile={isOwnProfile}
              />
            }
          />
        )}
      </aside>
    </>
  );
}
