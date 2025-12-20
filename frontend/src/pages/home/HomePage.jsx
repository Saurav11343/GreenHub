import React from "react";
import HeroSection from "../../components/page/home/HeroSection";
import CategoryCarousel from "../../components/page/home/CategoryCarousel";
import { useAuthStore } from "../../store/useAuthStore";
import { Navigate } from "react-router";

function HomePage() {
  const {authUser} = useAuthStore();

  if(authUser?.roleName === "Admin"){
    return <Navigate to="/admin" replace />;
  }

  return (
    <div>
      <HeroSection />
      <CategoryCarousel />
      Homepage
    </div>
  );
}

export default HomePage;
