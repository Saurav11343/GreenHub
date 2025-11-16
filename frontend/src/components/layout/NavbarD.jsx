import React from "react";
import { useAuthStore } from "../../store/useAuthStore";
import DefaultNavbar from "../layout/DefaultNavbar";
import AdminNavbar from "../layout/AdminNavbar";
import CustomerNavbar from "../layout/CustomerNavbar";

function NavbarD() {
  const authUser = useAuthStore((state) => state.authUser);
  if (!authUser) return <DefaultNavbar />;

  return (
    <>{authUser.roleName === "Admin" ? <AdminNavbar /> : <CustomerNavbar />}</>
  );
}

export default NavbarD;
