import { useEffect } from "react";
import toast from "react-hot-toast";
import { useLocalStorage } from "../../../../hooks/useLocalStorage";
import { useCurrentUser } from "../../../../redux/Selectors";
import { usersService } from "../../../../services/UsersService";

interface DarkModeToggleProps {
  className?: string;
}

export default function DarkModeToggle({
  className,
}: DarkModeToggleProps): JSX.Element {
  const { theme: userDefaultTheme, _id: userId } = useCurrentUser();

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
      toast.error(err);
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
      <i
        className={`bx ${
          theme === "dark" ? "bxs-sun" : "bxs-moon"
        } transition-transform duration-300`}
      ></i>
    </div>
  );
}
