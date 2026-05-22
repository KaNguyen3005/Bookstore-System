import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[]; // cho phép nhiều role
}

const ProtectedRoute = ({
  children,
  roles,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();

  const location = useLocation();

  const normalizeRole = (value?: string) =>
    value?.trim().toUpperCase().replace(/^ROLE_/, "");

  // đang load auth (restore user từ token)
  if (loading) {
    return <div className="page-loading">Loading...</div>;
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

  const userRole = normalizeRole(user.role);

  // check role nếu có yêu cầu roles
  if (
    roles &&
    !roles.some((r) => normalizeRole(r) === userRole)
  ) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
