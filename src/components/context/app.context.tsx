
import { createContext, useContext, useState } from "react";

interface IAppContext {
    isAuthenticated: boolean;
    setIsAuthenticated: (v: boolean) => void;
    setUser: (v: IUser) => void;
    user: IUser | null;
    // config time loading api
    isLoadingApp : boolean;
    setIsLoadingApp: (v: boolean) => void;
}

const CurrentAppContext = createContext<IAppContext | null>(null);

interface IProps {
    children: React.ReactNode;
}

export const AppProvider = (props: IProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user,setUser] = useState<IUser| null>(null)
  const [isLoadingApp, setIsLoadingApp] = useState<boolean>(false);

  return (
    <CurrentAppContext.Provider value={{ 
        isAuthenticated,user,setIsAuthenticated,setUser,
        isLoadingApp,setIsLoadingApp
     }}>
      {props.children}
    </CurrentAppContext.Provider>
  );
};



export const useCurrentApp = () => {
  const currentUserContext = useContext(CurrentAppContext);

  if (!currentUserContext) {
    throw new Error(
      "useCurrentUser has to be used within <CurrentUserContext.Provider>"
    );
  }

  return currentUserContext;
};