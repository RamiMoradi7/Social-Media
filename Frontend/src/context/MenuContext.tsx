import { createContext, ReactNode, useContext, useState } from "react";

interface MenuContextType {
  isOpen: string | null;
  toggleOpen: (section: string) => void;
}

interface MenuContextProps {
  children: ReactNode;
}
const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<MenuContextProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<string | null>(null);
  const toggleOpen = (section: string) => {
    setIsOpen((prevSection) => (prevSection === section ? null : section));
  };

  return (
    <MenuContext.Provider value={{ isOpen, toggleOpen }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenuContext = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenuContext must be used within a ContextProvider.");
  }
  return context;
};
