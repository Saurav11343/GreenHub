import React, { useEffect } from "react";
import ThemeController from "../../ui/ThemeController";
import { Sprout } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../../store/useAuthStore";
import PageLoader from "../../loader/PageLoader";

// CATEGORY STORE
import { useCategoryStore } from "../../../store/useCategoryStore";

// CART STORE
import { useCartStore } from "../../../store/useCartStore";

function CustomerNavbar() {
  const navigate = useNavigate();

  // ⭐ USE userId DIRECTLY FROM STORE
  const { userId, logout, logoutLoading } = useAuthStore();

  const {
    categories = [],
    getAllCategories,
    loading: catLoading,
  } = useCategoryStore();

  const {
    cartItems = [],
    getUserCartItem,
    loading: cartLoading,
  } = useCartStore();

  // Load categories
  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  // Fetch cart when userId becomes available
  useEffect(() => {
    if (userId) {
      getUserCartItem(userId);
    }
  }, [userId, getUserCartItem]);

  const handleLogout = async () => {
    const res = await logout();
    if (res?.success) navigate("/");
  };

  // navigate to /plants with category
  const goToPlantsWithCategory = (catId) => {
    navigate("/plants", { state: { categoryId: catId } });
  };

  const cartCount = cartItems?.length || 0;

  const subtotal = (cartItems || []).reduce((sum, item) => {
    const price = item?.plantId?.price ?? 0;
    const qty = item?.quantity ?? 0;
    return sum + price * qty;
  }, 0);

  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

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

            {/* MOBILE DROPDOWN */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              <li>
                <button onClick={() => navigate("/")}>Home</button>
              </li>

              {/* MOBILE CATEGORY LIST */}
              <li>
                <details>
                  <summary>Categories</summary>
                  <ul className="p-2 max-h-60 overflow-y-auto hide-scrollbar">
                    {catLoading && <li>Loading...</li>}
                    {!catLoading && categories.length === 0 && (
                      <li>No categories</li>
                    )}

                    {!catLoading &&
                      categories.map((cat) => (
                        <li key={cat._id}>
                          <button
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
                <button onClick={() => navigate("/plants")}>
                  Browse Plants
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/contact")}>Contact</button>
              </li>
              <li>
                <button onClick={() => navigate("/profile")}>Profile</button>
              </li>
              <li>
                <button onClick={() => navigate("/customer/orders")}>
                  Orders
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/customer/payments")}>
                  Payments
                </button>
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

          {/* LOGO */}
          <button
            onClick={() => navigate("/")}
            className="btn btn-ghost text-xl flex items-center gap-2"
          >
            <Sprout className="h-6 w-6 text-green-600" />
            GreenHub
          </button>
        </div>

        {/* CENTER MENU (DESKTOP) */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-3">
            <li>
              <button onClick={() => navigate("/")}>Home</button>
            </li>

            <li>
              <details>
                <summary>Categories</summary>
                <ul className="p-2 bg-base-100 rounded-box shadow max-h-64 overflow-y-auto hide-scrollbar">
                  {catLoading && <li>Loading...</li>}
                  {!catLoading && categories.length === 0 && (
                    <li>No categories</li>
                  )}

                  {!catLoading &&
                    categories.map((cat) => (
                      <li key={cat._id}>
                        <button onClick={() => goToPlantsWithCategory(cat._id)}>
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
          {/* CART MENU */}
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
                <span className="badge badge-sm indicator-item">
                  {cartCount}
                </span>
              </div>
            </div>

            {/* CART DROPDOWN */}
            <div
              tabIndex={0}
              className="card card-compact dropdown-content bg-base-100 z-10 mt-3 w-80 shadow"
            >
              <div className="card-body">
                <span className="text-lg font-bold">{cartCount} Items</span>

                <div className="max-h-48 overflow-y-auto hide-scrollbar">
                  {cartItems.length > 0 ? (
                    cartItems.map((it) => (
                      <div
                        key={it._id}
                        className="flex items-center gap-2 py-2 border-b"
                      >
                        <img
                          src={it?.plantId?.imageUrl || "/plant.webp"}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {it?.plantId?.name}
                          </div>
                          <div className="text-xs opacity-70">
                            Qty: {it.quantity} •{" "}
                            {formatINR(it.quantity * it.plantId.price)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="opacity-70 py-3">Cart is empty</div>
                  )}
                </div>

                <span className="text-info">
                  Subtotal: {formatINR(subtotal)}
                </span>

                <button
                  className="btn btn-primary btn-block"
                  onClick={() => navigate(`/customer/checkout/${userId}`)}
                  disabled={!userId}
                >
                  View Cart
                </button>
              </div>
            </div>
          </div>

          {/* PROFILE DROPDOWN */}
          <div className="dropdown dropdown-end hidden md:block">
            <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src="/avatar.webp" alt="profile" />
              </div>
            </div>

            <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
              <li>
                <button onClick={() => navigate("/profile")}>Profile</button>
              </li>
              <li>
                <button onClick={() => navigate("/customer/orders")}>
                  Orders
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/customer/payments")}>
                  Payments
                </button>
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
