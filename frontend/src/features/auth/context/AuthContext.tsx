import { userApi } from "../../../services/userApi";
import { clearAuthStorage } from "../../../services/axiosClient";
import React, {
  createContext,
  useState,
  type ReactNode,
  useCallback,
  useEffect,
} from "react";
import { getPermissionsFromToken } from "../utils/authPermissions";

export interface User {
  userId: number;
  email: string;
  phone: string;
  username: string;
  name: string;
  role: string;
  permissions?: string[];
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

  const withTokenPermissions = useCallback((userData: User): User => {
    const token = userData.token || localStorage.getItem("access_token") || "";

    return {
      ...userData,
      permissions: getPermissionsFromToken(token),
    };
  }, []);

  // ================= UPDATE USER =================
  const updateUser = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updated = withTokenPermissions({ ...prev, ...data });

      localStorage.setItem("user", JSON.stringify(updated));

      return updated;
    });
  }, [withTokenPermissions]);

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
          setUser(withTokenPermissions(JSON.parse(savedUser)));
        }

        const fetchedUser = await userApi.getMe();

        if (fetchedUser) {
          const authUser = withTokenPermissions(fetchedUser as User);

          localStorage.setItem("user", JSON.stringify(authUser));
          setUser(authUser);
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
  }, [withTokenPermissions]);

  // ================= LOGIN =================
  const login = useCallback((userData: User) => {
    if (userData.token) {
      localStorage.setItem("access_token", userData.token);
    }

    const authUser = withTokenPermissions(userData);

    localStorage.setItem("user", JSON.stringify(authUser));
    setUser(authUser);
  }, [withTokenPermissions]);

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
