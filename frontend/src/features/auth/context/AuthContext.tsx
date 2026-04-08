import { useCart } from '../../cart/hooks/useCart';
import React, {
  createContext,
  useState,
  type ReactNode,
  useCallback,
  useContext,
} from "react";

export interface User {
  user_id: number;
  email: string;
  phone: string;
  username: string;
  fullname: string;
  role_id: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("user");
      if (!saved) return null;

      const parsed = JSON.parse(saved);

      // validate tránh data sai (A -> B bug)
      if (!parsed?.user_id || !parsed?.email) {
        localStorage.removeItem("user");
        return null;
      }

      return parsed;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

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
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};