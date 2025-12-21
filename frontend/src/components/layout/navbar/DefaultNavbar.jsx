import React, { useEffect } from "react";
import ThemeController from "../../ui/ThemeController";
import { Sprout } from "lucide-react";
import { useNavigate } from "react-router"; // <- use react-router-dom
import { useCategoryStore } from "../../../store/useCategoryStore";

function DefaultNavbar() {
  const navigate = useNavigate();

  const { categories = [], getAllCategories, loading } = useCategoryStore();

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  // navigate to /plants and pass categoryId in router state
  const goToPlantsWithCategory = (catId) => {
    if (!catId) {
      navigate("/plants");
      return;
    }
    navigate("/plants", { state: { categoryId: catId } });
  };

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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>

          {/* MOBILE MENU DROPDOWN */}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            <li>
              <button
                className="w-full text-left"
                onClick={() => navigate("/")}
              >
                Home
              </button>
            </li>

            {/* DYNAMIC CATEGORIES - MOBILE */}
            <li>
              <details>
                <summary>Categories</summary>
                <ul className="p-2 max-h-60 overflow-y-auto">
                  {loading && <li className="opacity-70">Loading...</li>}

                  {!loading && categories.length === 0 && (
                    <li className="opacity-70">No categories</li>
                  )}

                  {!loading &&
                    categories.map((cat) => (
                      <li key={cat._id}>
                        <button
                          className="w-full text-left"
                          onClick={() => goToPlantsWithCategory(cat._id)}
                        >
                          {cat.name}
                        </button>
                      </li>
                    ))}
                </ul>
              </details>
            </li>

            <li>
              <button
                className="w-full text-left"
                onClick={() => navigate("/plants")}
              >
                Browse Plants
              </button>
            </li>
            <li>
              <button
                className="w-full text-left"
                onClick={() => navigate("/contactUs")}
              >
                Contact
              </button>
            </li>

            <li>
              <button
                className="w-full text-left"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </li>

            <li>
              <button
                className="w-full text-left text-success font-semibold"
                onClick={() => navigate("/signup")}
              >
                Signup
              </button>
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
            <button
              onClick={() => navigate("/")}
              className="font-medium cursor-pointer"
            >
              Home
            </button>
          </li>

          {/* DYNAMIC CATEGORIES - DESKTOP */}
          <li>
            <details>
              <summary className="font-medium cursor-pointer">
                Categories
              </summary>
              <ul className="p-2 bg-base-100 rounded-box shadow max-h-64 overflow-y-auto hide-scrollbar">
                {loading && <li className="opacity-70 px-2">Loading...</li>}

                {!loading && categories.length === 0 && (
                  <li className="opacity-70 px-2">No categories</li>
                )}

                {!loading &&
                  categories.map((cat) => (
                    <li key={cat._id}>
                      <button
                        className="w-full text-left cursor-pointer px-2 py-1"
                        onClick={() => goToPlantsWithCategory(cat._id)}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
              </ul>
            </details>
          </li>

          <li>
            <button
              onClick={() => navigate("/plants")}
              className="font-medium cursor-pointer"
            >
              Browse Plants
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate("/contactUs")}
              className="font-medium cursor-pointer"
            >
              Contact
            </button>
          </li>
        </ul>
      </div>

      {/* RIGHT SIDE */}
      <div className="navbar-end flex items-center gap-3">
        <button
          onClick={() => navigate("/login")}
          className="btn btn-ghost hidden md:inline-flex"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/signup")}
          className="btn btn-success text-white hidden md:inline-flex"
        >
          Signup
        </button>

        <ThemeController />
      </div>
    </div>
  );
}

export default DefaultNavbar;
