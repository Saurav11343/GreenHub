import React from "react";
import HeroSection from "../../components/page/home/HeroSection";
import CategoryCarousel from "../../components/page/home/CategoryCarousel";
import { useAuthStore } from "../../store/useAuthStore";
import { Navigate } from "react-router";
import AboutUs from "../../components/page/home/AboutUs";
import ContactUs from "../../components/page/home/ContactUs";
import GlobalStats from "../../components/page/home/GlobalStats";

function HomePage() {
  const { authUser } = useAuthStore();

  if (authUser?.roleName === "Admin") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div>
      <HeroSection />
      <CategoryCarousel />
      <AboutUs />
      <ContactUs />
      <GlobalStats />
    </div>
  );
}

export default HomePage;
