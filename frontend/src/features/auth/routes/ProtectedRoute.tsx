import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: string;
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  const getComparableRole = (value?: string) =>
    value?.trim().toUpperCase().replace(/^ROLE_/, "");

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role && getComparableRole(user?.role) !== getComparableRole(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
