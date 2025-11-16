import React from "react";
import AdminNavbar from "./AdminNavbar";
import CustomerNavbar from "./CustomerNavbar";
import { useAuthStore } from "../../store/useAuthStore";
import DefaultNavbar from "./DefaultNavbar";
function navbar() {
  const authUser = useAuthStore((state) => state.authUser);
  if (!authUser) return <DefaultNavbar />;

  return <>{authUser.roleName === "Admin" ? <AdminNavbar /> : <CustomerNavbar />}</>;
}

export default navbar;
