import React from "react";
import Navbar from "../../components/layout/navbar";
import HeroSection from "../../components/page/home/HeroSection";
import Footer from "../../components/layout/Footer";
import { Sprout } from "lucide-react";
import CategoryCarousel from "../../components/page/home/CategoryCarousel";

function HomePage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <Footer />
      Homepage
    </div>
  );
}

export default HomePage;
