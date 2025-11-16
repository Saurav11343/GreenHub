import React from "react";

function NavbarD() {
  const authUser = useAuthStore((state) => state.authUser);
  if (!authUser) return <DefaultNavbar />;

  return (
    <>{authUser.roleName === "Admin" ? <AdminNavbar /> : <CustomerNavbar />}</>
  );
}

export default NavbarD;
