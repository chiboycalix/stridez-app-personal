"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import Toastify from "@/components/Toastify";

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: any;
  loading: boolean;
  setAuth: (authState: boolean, user?: any, token?: any) => void;
  getCurrentUser: () => any;
  getAuth: () => boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export type UserProfileType = {
  firstName: string;
  lastName: string;
  avatar: string;
};

export type UserType = {
  profileSetupCompleted: boolean;
  userVerified: boolean;
  profile: UserProfileType | null;
};

const hoursToDays = (hours: number): number => hours / 24;

export const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: hoursToDays(1),
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Lax'
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    const initAuth = () => {
      const authData = Cookies.get("isAuthenticated");
      const accessToken = Cookies.get("accessToken");
      const currentUserData = Cookies.get("currentUser");

      if (authData === "true" && accessToken && currentUserData) {
        try {
          const userData = JSON.parse(currentUserData);
          setCurrentUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing user data:", error);
          Cookies.remove("isAuthenticated", { path: '/' });
          Cookies.remove("accessToken", { path: '/' });
          Cookies.remove("currentUser", { path: '/' });
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } else {
        Cookies.remove("isAuthenticated", { path: '/' });
        Cookies.remove("accessToken", { path: '/' });
        Cookies.remove("currentUser", { path: '/' });
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const HOUR_IN_MS = 3600000;
      const WARNING_TIME = HOUR_IN_MS - (5 * 60000);

      const warningTimeout = setTimeout(() => {
        console.log('Your session will expire in 5 minutes');
        setAlert('Your session will expire in 5 minutes')
      }, WARNING_TIME);

      const logoutTimeout = setTimeout(() => {
        signOut();
      }, HOUR_IN_MS);

      return () => {
        clearTimeout(warningTimeout);
        clearTimeout(logoutTimeout);
      };
    }
  }, [isAuthenticated]);


  const setAuth = (authState: boolean, user: UserType | null, accessToken?: string): void => {
    if (authState && user && accessToken) {
      Cookies.set("accessToken", accessToken, COOKIE_OPTIONS);
      Cookies.set("isAuthenticated", "true", COOKIE_OPTIONS);
      Cookies.set("currentUser", JSON.stringify(user), COOKIE_OPTIONS);
      setIsAuthenticated(true);
      setCurrentUser(user);
    } else {
      Cookies.remove("accessToken", { path: '/' });
      Cookies.remove("isAuthenticated", { path: '/' });
      Cookies.remove("currentUser", { path: '/' });
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  const getCurrentUser = (): any => currentUser;

  const getAuth = (): boolean => isAuthenticated;

  const signOut = () => {
    localStorage.removeItem("currentUser");
    Cookies.remove("accessToken", { path: '/' });
    Cookies.remove("isAuthenticated", { path: '/' });
    setAuth(false, null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        loading,
        setAuth,
        getCurrentUser,
        getAuth,
        signOut,
      }}
    >
      {children}
      <Toastify message={alert} />
    </AuthContext.Provider>
  );
};