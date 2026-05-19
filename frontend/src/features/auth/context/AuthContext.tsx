import { userApi } from "../../../services/userApi";
import React, {
  createContext,
  useState,
  type ReactNode,
  useCallback,
  useEffect,
} from "react";

export interface User {
  userId: number;
  email: string;
  phone: string;
  username: string;
  name: string;
  role: string;
  avatarUrl?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        const token = localStorage.getItem("access_token");

        // chưa login
        if (!savedUser && !token) {
          setUser(null);
          return;
        }

        // có cache user
        if (savedUser) {
          const parsedUser: User = JSON.parse(savedUser);
          setUser(parsedUser);
          return;
        }

        // có token nhưng chưa có user
        if (token) {
          const fetchedUser = await userApi.getMe();

          if (fetchedUser) {
            localStorage.setItem("user", JSON.stringify(fetchedUser));
            setUser(fetchedUser);
          } else {
            localStorage.removeItem("user");
            localStorage.removeItem("access_token");
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth init failed:", error);

        localStorage.removeItem("user");
        localStorage.removeItem("access_token");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback((userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));

    if (userData.token) {
      localStorage.setItem("access_token", userData.token);
    }

    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");

    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};