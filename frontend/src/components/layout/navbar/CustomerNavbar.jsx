import React, { useEffect } from "react";
import ThemeController from "../../ui/ThemeController";
import { Sprout } from "lucide-react";
import { useNavigate } from "react-router"; // <-- react-router-dom
import { useAuthStore } from "../../../store/useAuthStore";
import PageLoader from "../../loader/PageLoader";

// IMPORT CATEGORY STORE
import { useCategoryStore } from "../../../store/useCategoryStore";

function CustomerNavbar() {
  const navigate = useNavigate();
  const { logout, logoutLoading } = useAuthStore();

  const { categories = [], getAllCategories, loading } = useCategoryStore();

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  const handleLogout = async () => {
    const res = await logout();
    if (res?.success) navigate("/");
  };

  // navigate to /plants and pass categoryId in router state
  const goToPlantsWithCategory = (catId) => {
    // ensure catId exists
    if (!catId) {
      navigate("/plants");
      return;
    }
    navigate("/plants", { state: { categoryId: catId } });
  };

  return (
    <>
      {logoutLoading && <PageLoader />}

      <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-4">
        {/* LEFT SECTION */}
        <div className="navbar-start">
          {/* MOBILE MENU */}
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost">
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

            {/* MOBILE DROPDOWN MENU */}
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

              {/* DYNAMIC CATEGORY LIST - MOBILE */}
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
                  onClick={() => navigate("/contact")}
                >
                  Contact
                </button>
              </li>

              <li>
                <button
                  className="w-full text-left"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left"
                  onClick={() => navigate("/orders")}
                >
                  Orders
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left"
                  onClick={() => navigate("/settings")}
                >
                  Settings
                </button>
              </li>

              <li>
                <button
                  className="w-full text-left text-error"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>

          {/* BRAND LOGO */}
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
          <ul className="menu menu-horizontal px-1 gap-3">
            <li>
              <button onClick={() => navigate("/")}>Home</button>
            </li>

            {/* DYNAMIC CATEGORIES - DESKTOP */}
            <li>
              <details>
                <summary>Categories</summary>
                <ul className="p-2 bg-base-100 rounded-box shadow max-h-64 overflow-y-auto">
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
              <button onClick={() => navigate("/plants")}>Browse Plants</button>
            </li>
            <li>
              <button onClick={() => navigate("/contact")}>Contact</button>
            </li>
          </ul>
        </div>

        {/* RIGHT SECTION */}
        <div className="navbar-end flex items-center gap-3">
          {/* CART DROPDOWN */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 
                    2.293c-.63.63-.184 1.707.707 1.707H17m0 0
                    a2 2 0 100 4 2 2 0 000-4zm-8 2
                    a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="badge badge-sm indicator-item">3</span>
              </div>
            </div>

            <div
              tabIndex={0}
              className="card card-compact dropdown-content bg-base-100 z-10 mt-3 w-60 shadow"
            >
              <div className="card-body">
                <span className="text-lg font-bold">3 Items</span>
                <span className="text-info">Subtotal: ₹1500</span>
                <div className="card-actions">
                  <button className="btn btn-primary btn-block">
                    View Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* PROFILE DROPDOWN - DESKTOP */}
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
              <li>
                <button onClick={() => navigate("/profile")}>Profile</button>
              </li>
              <li>
                <button onClick={() => navigate("/orders")}>Orders</button>
              </li>
              <li>
                <button onClick={() => navigate("/settings")}>Settings</button>
              </li>
              <li>
                <button onClick={handleLogout} className="text-error">
                  Logout
                </button>
              </li>
            </ul>
          </div>

          <ThemeController />
        </div>
      </div>
    </>
  );
}

export default CustomerNavbar;
