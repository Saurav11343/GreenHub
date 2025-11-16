import React from "react";
import HeroSection from "../../components/page/home/HeroSection";
import Footer from "../../components/layout/Footer";
import CategoryCarousel from "../../components/page/home/CategoryCarousel";
import NavbarD from "../../components/layout/NavbarD";

function HomePage() {
  return (
    <div>
      <NavbarD />
      <HeroSection />
      <CategoryCarousel />
      <Footer />
      Homepage
    </div>
  );
}

export default HomePage;
