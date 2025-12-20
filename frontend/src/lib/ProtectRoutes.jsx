import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

function ProtectRoutes({ allowedRoles }) {
  const { authUser } = useAuthStore();

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(authUser.roleName)) {
    if (authUser.roleName === "Admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectRoutes;
