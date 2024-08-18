import { NavLink } from "react-router-dom";

interface MenuItemProps {
  isOpen: string;
  current: string;
  onClick: () => void;
  icon: string;
  link?: string;
  count?: number;
}

export default function MenuItem({
  isOpen,
  onClick,
  current,
  icon,
  link,
  count,
}: MenuItemProps): JSX.Element {
  const Content = (
    <div
      onClick={onClick}
      className={`w-full text-3xl py-2 px-3 xl:px-12 cursor-pointer text-center inline-block rounded text-gray-600 hover:bg-gray-100 dark:hover:bg-dark-third dark:text-dark-txt relative ${
        isOpen === current ? "border-b-4 border-blue-500" : ""
      }`}
    >
      <i className={icon}></i>
      {count !== undefined && (
        <span className="text-xs absolute top-0 right-1/4 bg-red-500 text-white font-semibold rounded-full px-1 text-center">
          {count}
        </span>
      )}
    </div>
  );

  if (link) {
    return (
      <li className="w-1/5 md:w-max text-center md:inline-block relative">
        <NavLink to={link}>{Content}</NavLink>
      </li>
    );
  }

  return (
    <li className="w-1/5 md:w-max text-center md:inline-block relative">
      {Content}
    </li>
  );
}
