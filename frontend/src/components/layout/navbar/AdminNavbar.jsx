import React from "react";
import { Sprout, LogOut, User } from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useNavigate } from "react-router";
import ThemeController from "../../ui/ThemeController";

function AdminNavbar() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar w-full bg-base-100 shadow px-4">
      {/* SIDEBAR TOGGLE */}
      <label
        htmlFor="admin-drawer"
        aria-label="toggle sidebar"
        className="btn btn-square btn-ghost"
      >
        <Sprout className="size-5" />
      </label>

      {/* TITLE */}
      <div className="px-4 font-semibold text-lg">Admin Dashboard</div>

      {/* RIGHT SIDE */}
      <div className="ml-auto flex items-center gap-3">
        {/* PROFILE DROPDOWN */}
        <div className="dropdown dropdown-end hidden md:block">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img alt="profile" src="/avatar.webp" />
            </div>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            {/* <li>
              <a onClick={() => navigate("/admin/profile")}>Profile</a>
            </li>

            <li>
              <a onClick={() => navigate("/admin/settings")}>Settings</a>
            </li> */}

            <li>
              <a
                onClick={handleLogout}
                className="text-error flex items-center gap-2"
              >
                <LogOut className="size-4" /> Logout
              </a>
            </li>
          </ul>
        </div>

        {/* THEME TOGGLE */}
        <ThemeController />
      </div>
    </nav>
  );
}

export default AdminNavbar;
