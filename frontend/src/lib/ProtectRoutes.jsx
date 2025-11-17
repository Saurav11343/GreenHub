import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Navigate, Outlet } from "react-router";

function ProtectRoutes({ allowedRoles }) {
  const { authUser } = useAuthStore();

  if (!authUser) return <Navigate to="/login" />;

  if (!allowedRoles.includes(authUser.roleName)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectRoutes;
