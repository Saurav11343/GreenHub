import React from "react";
import { useNavigate } from "react-router";
import {
  LayoutDashboard,
  Leaf,
  ListTree,
  ShoppingCart,
  Users,
  Settings,
} from "lucide-react";

function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <div className="drawer-side is-drawer-close:overflow-visible">
      <label
        htmlFor="admin-drawer"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>

      <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-16 is-drawer-open:w-64 transition-all">
        <ul className="menu w-full grow p-2 gap-1">
          {/* Dashboard */}
          <li>
            <button
              onClick={() => navigate("/admin")}
              className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              data-tip="Dashboard"
            >
              <LayoutDashboard className="size-5" />
              <span className="is-drawer-close:hidden">Dashboard</span>
            </button>
          </li>

          {/* Plants */}
          <li>
            <button
              onClick={() => navigate("/admin/plants")}
              className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              data-tip="Plants"
            >
              <Leaf className="size-5" />
              <span className="is-drawer-close:hidden">Plants</span>
            </button>
          </li>

          {/* Categories */}
          <li>
            <button
              onClick={() => navigate("/admin/categories")}
              className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              data-tip="Categories"
            >
              <ListTree className="size-5" />
              <span className="is-drawer-close:hidden">Categories</span>
            </button>
          </li>

          {/* Orders */}
          <li>
            <button
              onClick={() => navigate("/admin/orders")}
              className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              data-tip="Orders"
            >
              <ShoppingCart className="size-5" />
              <span className="is-drawer-close:hidden">Orders</span>
            </button>
          </li>

          {/* Customers */}
          <li>
            <button
              onClick={() => navigate("/admin/customers")}
              className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              data-tip="Customers"
            >
              <Users className="size-5" />
              <span className="is-drawer-close:hidden">Customers</span>
            </button>
          </li>

          {/* Settings */}
          <li>
            <button
              onClick={() => navigate("/admin/settings")}
              className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              data-tip="Settings"
            >
              <Settings className="size-5" />
              <span className="is-drawer-close:hidden">Settings</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AdminSidebar;
