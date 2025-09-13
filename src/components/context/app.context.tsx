
import { fetchAccountAPI } from "@/services/api";
import { createContext, useContext, useEffect, useState } from "react";
import AppHeader from "../layout/app.header";
import { Outlet } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

interface IAppContext {
    isAuthenticated: boolean;
    setIsAuthenticated: (v: boolean) => void;
    setUser: (v: IUser | null) => void;
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
  const [isLoadingApp, setIsLoadingApp] = useState<boolean>(true);

  useEffect(() => {
    const fetchAccount = async () => {
      const response = await fetchAccountAPI();
      if (response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
      // set time to loading icon
      setTimeout(() => {
      setIsLoadingApp(false);
    }, 1500);
    }
    fetchAccount();
  }, []);


  return (
    <>
      {isLoadingApp === false ?   // if isLoadingApp == false ==> show information header
        <CurrentAppContext.Provider value={{
          isAuthenticated, user, setIsAuthenticated, setUser,
          isLoadingApp, setIsLoadingApp
        }}>
          {props.children}
        </CurrentAppContext.Provider>
        :
        <div className='scale-loading' style={{
          position: "fixed", left: "50%", top: "50%"
        }}>
          <ScaleLoader
            height={35}
            aria-label="Loading Spinner"
            data-testid="loader"
            color='#7d7dfaff'
          />
        </div>
      }
    </>
  )
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