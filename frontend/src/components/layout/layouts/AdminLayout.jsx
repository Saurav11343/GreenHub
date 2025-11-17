import React from "react";
import { Outlet } from "react-router";
import AdminSidebar from "../sidebar/AdminSidebar";
import AdminNavbar from "../navbar/AdminNavbar";

function AdminLayout() {
  return (
    <div className="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      {/* MAIN CONTENT */}
      <div className="drawer-content">
        <AdminNavbar />
        <div className="p-4">
          <Outlet />
        </div>
      </div>

      {/* SIDEBAR */}
      <AdminSidebar />
    </div>
  );
}

export default AdminLayout;
