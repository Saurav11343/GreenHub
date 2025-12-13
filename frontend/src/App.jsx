import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import { useAuthStore } from "./store/useAuthStore";
import PageLoader from "./components/loader/PageLoader";
import CustomerPage from "./pages/customer/CustomerPage";
import ProtectRoutes from "./lib/ProtectRoutes";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RootLayout from "./components/layout/layouts/RootLayout";
import AdminLayout from "./components/layout/layouts/AdminLayout";
import ManageCategories from "./pages/admin/ManageCategories";
import ManagePlants from "./pages/admin/ManagePlants";
import PlantBrowse from "./pages/customer/PlantBrowse";
import PlantDetail from "./pages/customer/PlantDetail";
import CheckOut from "./pages/customer/CheckOut";
//hello
function App() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("Auth User:", authUser, "Is Checking Auth:", isCheckingAuth);

  if (isCheckingAuth) {
    return <PageLoader />;
  }
  return (
    <div>
      <Routes>
        {/* AUTH PAGES (NO NAVBAR) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* PUBLIC + CUSTOMER ROUTES WITH WEBSITE LAYOUT */}
        <Route element={<RootLayout />}>
          {/* Public pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/plants" element={<PlantBrowse />} />
          <Route path="/plants/details/:id" element={<PlantDetail />} />

          {/* Customer protected pages */}
          <Route element={<ProtectRoutes allowedRoles={["Customer"]} />}>
            <Route path="/customer" element={<CustomerPage />} />
            <Route path="/customer/checkout/:id" element={<CheckOut />} />
          </Route>
        </Route>

        {/* ADMIN ROUTES WITH ADMIN LAYOUT */}
        <Route element={<ProtectRoutes allowedRoles={["Admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/categories" element={<ManageCategories />} />
            <Route path="/admin/plants" element={<ManagePlants />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
