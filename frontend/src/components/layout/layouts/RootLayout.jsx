import React from "react";
import { Outlet } from "react-router";
import { useAuthStore } from "../../../store/useAuthStore";

import CustomerNavbar from "../navbar/CustomerNavbar";
import AdminNavbar from "../navbar/AdminNavbar";
import Footer from "../Footer";
import DefaultNavbar from "../navbar/DefaultNavbar";

function RootLayout() {
  const { authUser, isCheckingAuth } = useAuthStore();

  // 🔥 Prevent wrong navbar during auth flicker
  if (isCheckingAuth) return null;

  const role = authUser?.roleName?.toLowerCase();

  const renderNavbar = () => {
    if (!authUser) return <DefaultNavbar />;

    if (role === "customer") return <CustomerNavbar />;
    if (role === "admin") return <AdminNavbar />;

    return <DefaultNavbar />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {renderNavbar()}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;
