import { createContext, ReactNode, useContext } from "react";
import { useSelector } from "react-redux";
import { User } from "../models/User";
import { AppState } from "../redux/AppState";

interface UserContextType {
  user: User | null;
}

interface UserProviderProps {
  children: ReactNode;
}
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const user = useSelector<AppState, User | null>((appState) => appState.user);
  
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useCurrentUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useCurrentUser must be used within a UserProvider.");
  }
  return context;
};
