import React from "react";
import AboutusBgImage from "../../../assets/aboutUS.webp";
import { useNavigate } from "react-router";

function AboutUs() {
  const navigate = useNavigate();
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: `url(${AboutusBgImage})`,
      }}
    >
      <div className="hero-overlay bg-black/50"></div>

      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-2xl">
          <h1 className="mb-5 text-5xl font-bold text-green-400">
            About GreenHub
          </h1>

          <p className="mb-5 text-lg">
            <span className="font-semibold">GreenHub</span> is an online plant
            selling platform dedicated to bringing nature closer to your
            everyday life. We provide a wide variety of indoor and outdoor
            plants, gardening tools, and eco-friendly solutions for a greener
            future.
          </p>

          <p className="mb-8">
            Our goal is to promote sustainable living by making plant shopping
            simple, reliable, and accessible for everyone.
          </p>

          <button
            className="btn btn-success"
            onClick={() => navigate("/plants")}
          >
            Explore Our Plants
          </button>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
