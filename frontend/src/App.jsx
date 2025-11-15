import React from "react";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import { useAuthStore } from "./store/useAuthStore";

function App() {

  const {authUser, isLoading,login,isLoggedIn} = useAuthStore();

  console.log("Auth User:", authUser, "Is Loading:", isLoading, "Is Logged In:", isLoggedIn);
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>

      <button className="btn btn-primary" type="button " onClick={login}>Login</button>
    </div>
  );
}

export default App;
