import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken } from "@/app/slices/authSlice";
import { rolePermissions } from "@/config/permissions";

const isAllowed = (pathname, role) => {
  if (!role) return false;

  if (rolePermissions[role] === "all") {
    return true;
  }

  const userRole = role.toLowerCase();

  if (userRole === "admin") {
    const { exclude = [] } = rolePermissions.admin;
    return !exclude.includes(pathname);
  }

  if (userRole === "user") {
    const { allow = [] } = rolePermissions.user;
    return allow.includes(pathname);
  }

  return false;
};

export const ProtectedRoutes = ({ children }) => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user?.role;
  const currentPath = location.pathname;

  if (!isAllowed(currentPath, userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};