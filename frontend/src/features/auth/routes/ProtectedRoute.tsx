import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  hasAnyPermission,
  isAdminRole,
  normalizeRole,
} from "../utils/authPermissions";
import "./ProtectedRoute.css";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  permissions?: string[];
}

const ProtectedRoute = ({
  children,
  roles,
  permissions,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="page-loading">Loading...</div>;
  }

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

  if (roles && !roles.some((role) => normalizeRole(role) === userRole)) {
    return <ForbiddenAccess />;
  }

  if (
    permissions &&
    !isAdminRole(user.role) &&
    !hasAnyPermission(user.permissions, permissions)
  ) {
    return <ForbiddenAccess />;
  }

  return <>{children}</>;
};

const ForbiddenAccess = () => (
  <div className="forbidden-access" role="alert">
    <h1>Không đủ quyền truy cập</h1>
    <p>Tài khoản của bạn không có quyền sử dụng giao diện này.</p>
  </div>
);

export default ProtectedRoute;
