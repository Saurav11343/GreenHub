import React from "react";
import ThemeController from "../../ui/ThemeController";
import { Sprout } from "lucide-react";
import { useNavigate } from "react-router";

function DefaultNavbar() {
  const navigate = useNavigate();

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-4">
      {/* LEFT - BRAND + Mobile Menu */}
      <div className="navbar-start">
        
        {/* MOBILE MENU ICON */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>

          {/* MOBILE MENU DROPDOWN */}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            <li><a onClick={() => navigate("/")}>Home</a></li>

            <li>
              <details>
                <summary>Categories</summary>
                <ul className="p-2">
                  <li><a>Indoor Plants</a></li>
                  <li><a>Outdoor Plants</a></li>
                  <li><a>Succulents</a></li>
                  <li><a>Flowering Plants</a></li>
                </ul>
              </details>
            </li>

            <li><a onClick={() => navigate("/plants")}>Browse Plants</a></li>
            <li><a onClick={() => navigate("/contact")}>Contact</a></li>

            {/* LOGIN */}
            <li>
              <a
                onClick={() => navigate("/login")}
                className="cursor-pointer"
              >
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

        {/* BRAND */}
        <button
          onClick={() => navigate("/")}
          className="btn btn-ghost text-xl flex items-center gap-2"
        >
          <Sprout className="h-6 w-6 text-green-600" />
          GreenHub
        </button>
      </div>

      {/* CENTER MENU (Desktop Only) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <a onClick={() => navigate("/")} className="font-medium cursor-pointer">
              Home
            </a>
          </li>

          <li>
            <details>
              <summary className="font-medium cursor-pointer">Categories</summary>
              <ul className="p-2 bg-base-100 rounded-box shadow">
                <li><a>Indoor Plants</a></li>
                <li><a>Outdoor Plants</a></li>
                <li><a>Succulents</a></li>
                <li><a>Flowering Plants</a></li>
              </ul>
            </details>
          </li>

          <li>
            <a
              onClick={() => navigate("/plants")}
              className="font-medium cursor-pointer"
            >
              Browse Plants
            </a>
          </li>

          <li>
            <a
              onClick={() => navigate("/contact")}
              className="font-medium cursor-pointer"
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

        {/* Theme Toggle */}
        <ThemeController />
      </div>
    </div>
  );
}

export default DefaultNavbar;
