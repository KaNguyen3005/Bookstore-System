import { userApi } from "../../../services/userApi";
import { clearAuthStorage } from "../../../services/axiosClient";
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
  updateUser: (data: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ================= UPDATE USER =================
  const updateUser = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updated = { ...prev, ...data };

      localStorage.setItem("user", JSON.stringify(updated));

      return updated;
    });
  }, []);

  // ================= INIT AUTH =================
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          clearAuthStorage();
          setUser(null);
          return;
        }

        const savedUser = localStorage.getItem("user");

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        const fetchedUser = await userApi.getMe();

        if (fetchedUser) {
          localStorage.setItem("user", JSON.stringify(fetchedUser));
          setUser(fetchedUser);
        } else {
          clearAuthStorage();
          setUser(null);
        }
      } catch (error) {
        console.error("Auth init failed:", error);

        clearAuthStorage();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // ================= LOGIN =================
  const login = useCallback((userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));

    if (userData.token) {
      localStorage.setItem("access_token", userData.token);
    }

    setUser(userData);
  }, []);

  // ================= LOGOUT =================
  const logout = useCallback(() => {
    localStorage.removeItem("user");
    clearAuthStorage();

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
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
