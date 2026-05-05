
import React, {
  createContext,
  useState,
  type ReactNode,
  useCallback,
  useEffect,
} from "react";
import { userApi } from "../../../services/userApi";

export interface User {
  user_id: number;
  email: string;
  phone: string;
  username: string;
  name: string;
  role: string;
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
  // ✅ load từ localStorage trước (tránh loading lâu)
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // ❗ nếu chưa login thì bỏ qua
        if (!localStorage.getItem("user")) {
          setLoading(false);
          return;
        }

        const me = await userApi.getMe();

        if (me) {
          setUser(me);
          localStorage.setItem("user", JSON.stringify(me)); // sync lại
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.error("fetchUser error:", err);
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const isAuthenticated = !!user;

  const login = useCallback((userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
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