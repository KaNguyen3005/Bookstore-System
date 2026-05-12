import {userApi} from "../../../services/userApi";
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
  // load từ localStorage trước (tránh loading lâu)
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [hasToken, setHasToken] = useState(
    () => Boolean(localStorage.getItem("access_token")),
  );

  const [loading, setLoading] = useState(true);

    useEffect(() => {
      const initAuth = async () => {
        try {
          const saved = localStorage.getItem("user");
          const token = localStorage.getItem("access_token");

          if (!saved) {
            if (!token) {
              setHasToken(false);
              setLoading(false);
              return;
            }

            setHasToken(true);
            const fetchedUser = await userApi.getMe();

            if (fetchedUser) {
              localStorage.setItem("user", JSON.stringify(fetchedUser));
              setUser(fetchedUser);
            }

            setLoading(false);
            return;
          }

          const parsed = JSON.parse(saved);
          setUser(parsed); // load ngay từ storage
          setHasToken(Boolean(token || parsed?.token));

        } catch (e) {
          setUser(null);
          localStorage.removeItem("user");
        } finally {
          setLoading(false);
        }
      };

      initAuth();
    }, []);

  const isAuthenticated = !!user || hasToken;

  const login = useCallback((userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setHasToken(Boolean(localStorage.getItem("access_token") || userData.token));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    setHasToken(false);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
