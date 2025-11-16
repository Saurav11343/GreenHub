import React from "react";
import ThemeController from "../ui/ThemeController";
import { Sprout } from "lucide-react";
import { useNavigate } from "react-router";
function DefaultNavbar() {
  const navigate = useNavigate();

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-4">
      {/* LEFT SECTION */}
      <div className="navbar-start">
        {/* Mobile Menu */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>

          {/* MOBILE MENU */}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Home</a>
            </li>
            <li>
              <details>
                <summary>Categories</summary>
                <ul className="p-2">
                  <li>
                    <a>Indoor Plants</a>
                  </li>
                  <li>
                    <a>Outdoor Plants</a>
                  </li>
                  <li>
                    <a>Succulents</a>
                  </li>
                  <li>
                    <a>Flowering Plants</a>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <a>Browse Plants</a>
            </li>
            <li>
              <a>Contact</a>
            </li>

            {/* LOGIN */}
            <li>
              <a onClick={() => navigate("/login")} className="cursor-pointer">
                Login
              </a>
            </li>

            {/* SIGNUP */}
            <li>
              <a
                onClick={() => navigate("/signup")}
                className="text-success font-semibold cursor-pointer"
              >
                Signup
              </a>
            </li>
          </ul>
        </div>

        {/* Brand */}
        <button
          onClick={() => navigate("/")}
          className="btn btn-ghost text-xl flex items-center gap-2"
        >
          <Sprout className="h-6 w-6 text-green-600" />
          GreenHub
        </button>
      </div>

      {/* CENTER MENU (Desktop) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <a
              className="font-medium cursor-pointer"
              onClick={() => navigate("/")}
            >
              Home
            </a>
          </li>

          {/* Categories */}
          <li>
            <details>
              <summary className="font-medium cursor-pointer">
                Categories
              </summary>
              <ul className="p-2 bg-base-100 rounded-box shadow">
                <li>
                  <a>Indoor Plants</a>
                </li>
                <li>
                  <a>Outdoor Plants</a>
                </li>
                <li>
                  <a>Succulents</a>
                </li>
                <li>
                  <a>Flowering Plants</a>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <a
              className="font-medium cursor-pointer"
              onClick={() => navigate("/plants")}
            >
              Browse Plants
            </a>
          </li>

          <li>
            <a
              className="font-medium cursor-pointer"
              onClick={() => navigate("/contact")}
            >
              Contact
            </a>
          </li>
        </ul>
      </div>

      {/* RIGHT SIDE */}
      <div className="navbar-end flex items-center gap-3">
        {/* LOGIN BUTTON */}
        <button
          onClick={() => navigate("/login")}
          className="btn btn-ghost hidden md:inline-flex"
        >
          Login
        </button>

        {/* SIGNUP BUTTON */}
        <button
          onClick={() => navigate("/signup")}
          className="btn btn-success text-white hidden md:inline-flex"
        >
          Signup
        </button>

        {/* Cart, Profile, ThemeController remain unchanged */}
        {/* CART DROPDOWN */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 
          2.293c-.63.63-.184 1.707.707 1.707H17m0 0
          a2 2 0 100 4 2 2 0 000-4zm-8 2
          a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>

              {/* CART COUNT */}
              <span className="badge badge-sm indicator-item">3</span>
            </div>
          </div>

          {/* CART DROPDOWN CONTENT */}
          <div
            tabIndex={0}
            className="card card-compact dropdown-content bg-base-100 z-10 mt-3 w-60 shadow"
          >
            <div className="card-body">
              <span className="text-lg font-bold">3 Items</span>
              <span className="text-info">Subtotal: ₹1500</span>
              <div className="card-actions">
                <button className="btn btn-primary btn-block">View Cart</button>
              </div>
            </div>
          </div>
        </div>
        {/* PROFILE DROPDOWN */}
        <div className="dropdown dropdown-end hidden md:block">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img alt="profile" src="/avatar.png" />
            </div>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a
                onClick={() => navigate("/profile")}
                className="cursor-pointer"
              >
                Profile
              </a>
            </li>

            <li>
              <a onClick={() => navigate("/orders")} className="cursor-pointer">
                Orders
              </a>
            </li>

            <li>
              <a
                onClick={() => navigate("/settings")}
                className="cursor-pointer"
              >
                Settings
              </a>
            </li>
          </ul>
        </div>

        {/* Theme Toggle */}
        <ThemeController />
      </div>
    </div>
  );
}

export default DefaultNavbar;
