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
    <section className="py-12 bg-base-100">
      <h2 className="text-3xl font-bold text-center mb-10">
        Shop by Categories
      </h2>

      <div className="container mx-auto px-6">
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
            loop={true}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            modules={[Autoplay]}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 10 },
              640: { slidesPerView: 3, spaceBetween: 15 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
            }}
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat._id}>
                <div
                  className="cursor-pointer"
                  onClick={() => handleCategoryClick(cat._id)}
                >
                  <CategoryCard
                    name={cat.name}
                    icon={cat.icon}
                    image={cat.imageUrl || "/plant.webp"}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}

export default CategoryCarousel;
