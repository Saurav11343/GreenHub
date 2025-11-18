import React from "react";
import HeroBgImage from "../../../assets/heroBackgroundImage.webp";

function HeroSection() {
  return (
    <div
      className="hero min-h-[calc(100vh-64px)] relative"
      style={{
        backgroundImage: `url(${HeroBgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent"></div>

      {/* Text Content */}
      <div className="hero-content text-neutral-content text-center relative z-10 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="mb-6 text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
            Bring Nature Into <br /> Your Home
          </h1>

          <p className="mb-8 text-lg md:text-xl text-gray-200 leading-relaxed drop-shadow">
            Discover a fresh collection of indoor, outdoor, and low-maintenance
            plants delivered directly to your doorstep. Start building your
            green space today!
          </p>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-4">
            <button className="btn btn-success btn-wide text-white font-semibold shadow-lg">
              Shop Now
            </button>

            <button className="btn btn-outline btn-success btn-wide font-semibold border-2">
              Browse Plants
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
