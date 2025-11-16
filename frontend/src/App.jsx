import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import { useAuthStore } from "./store/useAuthStore";
import PageLoader from "./components/loader/PageLoader";
import CustomerPage from "./pages/customer/CustomerPage";
import AdminPage from "./pages/admin/AdminPage";
import ProtectRoutes from "./lib/ProtectRoutes";

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
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* <Route path="/customer" element={<CustomerPage />} />
        <Route path="/admin" element={<AdminPage />} /> */}

        <Route
          path="/customer"
          element={
            <ProtectRoutes allowedRoles={["Customer"]}>
              <CustomerPage />
            </ProtectRoutes>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectRoutes allowedRoles={["Admin"]}>
              <AdminPage />
            </ProtectRoutes>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
