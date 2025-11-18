import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import CategoryCard from "../../ui/CategoryCard";
import { useCategoryStore } from "../../../store/useCategoryStore";

function CategoryCarousel() {
  const { categories, getAllCategories, loading } = useCategoryStore();

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  return (
    <section className="py-12 bg-base-100">
      <h2 className="text-3xl font-bold text-center mb-10">
        Shop by Categories
      </h2>

      <div className="container mx-auto px-6">
        {/* Loading placeholder */}
        {loading && (
          <p className="text-center opacity-70 text-sm">
            Loading categories...
          </p>
        )}

        {/* Empty state */}
        {!loading && categories.length === 0 && (
          <p className="text-center opacity-70 text-sm">
            No categories available
          </p>
        )}

        {/* Category Carousel */}
        {!loading && categories.length > 0 && (
          <Swiper
            slidesPerView={4}
            spaceBetween={20}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 10 },
              640: { slidesPerView: 3, spaceBetween: 15 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
            }}
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat._id}>
                <CategoryCard
                  name={cat.name}
                  icon={cat.icon}
                  image={cat.imageUrl || "/plant.webp"} // fallback image
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}

export default CategoryCarousel;
