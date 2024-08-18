import { NavLink } from "react-router-dom";
import logo from "../../../../assets/images/friendify-light.png";

export default function LogoSection(): JSX.Element {
  return (
    <>
      <NavLink to={"/"} className="mr-2 hidden md:inline-block">
        <img src={logo} alt="logo" className="w-28 h-auto" />
      </NavLink>
      <NavLink to={"/"} className="inline-block md:hidden">
        <img src={logo} alt="logo" className="w-28 h-auto" />
      </NavLink>
    </>
  );
}
