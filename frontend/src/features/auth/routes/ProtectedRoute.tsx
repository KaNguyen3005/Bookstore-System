import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string;
}

const ProtectedRoute = ({
  children,
  role,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();

  const location = useLocation();

  const normalizeRole = (value?: string) =>
    value?.trim().toUpperCase().replace(/^ROLE_/, "");

  // đang restore auth
  if (loading) {
    return <div>Loading...</div>;
  }

  // chưa login
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // sai role
  if (
    role &&
    normalizeRole(user.role) !== normalizeRole(role)
  ) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;