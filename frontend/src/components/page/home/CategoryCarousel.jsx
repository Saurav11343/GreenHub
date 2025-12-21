// CategoryCarousel.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import CategoryCard from "../../ui/CategoryCard";
import { useCategoryStore } from "../../../store/useCategoryStore";

function CategoryCarousel() {
  const { categories, getAllCategories, loading } = useCategoryStore();
  const navigate = useNavigate();

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  const handleCategoryClick = (catId) => {
    navigate("/plants", { state: { categoryId: catId } });
  };

  return (
    <section className="bg-base-200 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* HEADER */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold">
            Shop by Categories
          </h2>
          <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base opacity-80">
            Explore a wide range of plant categories and find the perfect
            greenery for your home, garden, or workspace.
          </p>
        </div>

        {/* CONTENT */}
        {loading && (
          <p className="text-center opacity-70 text-sm">
            Loading categories...
          </p>
        )}

        {!loading && categories.length === 0 && (
          <p className="text-center opacity-70 text-sm">
            No categories available
          </p>
        )}

        {!loading && categories.length > 0 && (
          <Swiper
            slidesPerView={4}
            spaceBetween={20}
            loop
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            modules={[Autoplay]}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 10 },
              640: { slidesPerView: 3, spaceBetween: 15 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
            }}
            className="pb-4"
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat._id}>
                <button
                  className="w-full cursor-pointer"
                  onClick={() => handleCategoryClick(cat._id)}
                >
                  <CategoryCard
                    name={cat.name}
                    icon={cat.icon}
                    image={cat.imageUrl || "/plant.webp"}
                  />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}

export default CategoryCarousel;
