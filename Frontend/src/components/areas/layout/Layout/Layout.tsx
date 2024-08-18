import { MenuProvider } from "../../../../context/MenuContext";
import { useCurrentUser } from "../../../../context/UserContext";
import Copyrights from "../Copyrights/Copyrights";
import Menu from "../Menu/Menu";
import GuestRouting from "../Routing/GuestRouting";
import Routing from "../Routing/Routing";

function Layout(): JSX.Element {
  const { user } = useCurrentUser();

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen flex flex-col">
      {user && (
        <MenuProvider>
          <Menu />
          <main className="flex-1 dark:bg-dark-third bg-white md:p-4 lg:p-2 mt-12">
            <Routing />
          </main>
        </MenuProvider>
      )}
      {!user && (
        <main className="flex-1 dark:bg-dark-third bg-white md:p-4 lg:p-2 mt-12">
          <GuestRouting />
        </main>
      )}
      <footer className="py-4 mt-auto bg-gray-50 text-center dark:bg-dark-third">
        <Copyrights />
      </footer>
    </div>
  );
}

export default Layout;
