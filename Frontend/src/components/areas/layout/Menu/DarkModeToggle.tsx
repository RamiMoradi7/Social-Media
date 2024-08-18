import { useEffect } from "react";
import { useCurrentUser } from "../../../../context/UserContext";
import { useLocalStorage } from "../../../../hooks/useLocalStorage";
import { usersService } from "../../../../services/UsersService";
import { notify } from "../../../../utilities/Notify";

interface DarkModeToggleProps {
  className?: string;
}

export default function DarkModeToggle({
  className,
}: DarkModeToggleProps): JSX.Element {
  const {
    user: { theme: userDefaultTheme, _id: userId },
  } = useCurrentUser();

  const [theme, setTheme] = useLocalStorage<string>("theme", userDefaultTheme);

  const handleToggle = async () => {
    try {
      const newTheme = theme === "dark" ? "light" : "dark";
      setTheme(newTheme);
      await usersService.updateUser({
        userId,
        userFields: { theme: newTheme },
      });
    } catch (err: any) {
      notify.error(err);
    }
  };
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div
      className={`text-2xl grid place-items-center ${className} bg-gray-200 dark:bg-dark-third rounded-full w-10 h-10 cursor-pointer hover:bg-gray-300 dark:text-dark-txt`}
      id="dark-mode-toggle-mb"
      onClick={handleToggle}
    >
      <i className="bx bxs-moon"></i>
    </div>
  );
}
