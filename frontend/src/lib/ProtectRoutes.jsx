import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Navigate } from "react-router";

function ProtectRoutes({ children, allowedRoles }) {
  const authUser = useAuthStore((state) => state.authUser);
  console.log("Auth user in Protect route: ", authUser);

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  const role = authUser.user?.roleName;

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectRoutes;
