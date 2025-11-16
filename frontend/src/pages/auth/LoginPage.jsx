import React from "react";
import Navbar from "../../components/layout/navbar";
import LoginComponent from "../../components/page/Login/LoginComponent";
import Footer from "../../components/layout/Footer";

function LoginPage() {
  return (
    <div>
      <Navbar />
      <LoginComponent />
    </div>
  );
}

export default LoginPage;
