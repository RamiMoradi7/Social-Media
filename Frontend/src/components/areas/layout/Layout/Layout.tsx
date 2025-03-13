import "boxicons/css/boxicons.min.css";
import { useScrollTop } from "../../../../hooks/useScrollTop";
import Copyrights from "../Copyrights/Copyrights";
import Menu from "../Menu/Menu";
import GuestRouting from "../Routing/GuestRouting";
import Routing from "../Routing/Routing";
import { Toaster } from "react-hot-toast";
import { useCurrentUser } from "../../../../redux/Selectors";

function Layout(): JSX.Element {
  const user = useCurrentUser();
  useScrollTop();

  if (!user) return <GuestRouting />;
  
  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen flex flex-col">
      <Menu />
      <Routing />
      <Toaster position="top-right" />
      <Copyrights />
    </div>
  );
}

export default Layout;
