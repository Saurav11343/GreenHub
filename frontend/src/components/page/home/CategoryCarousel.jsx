import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import CategoryCard from "../../ui/CategoryCard";

function CategoryCarousel() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // TEMP HARDCODED DATA (REMOVE WHEN BACKEND READY)
    const tempCategories = [
      { _id: "1", name: "Indoor Plants", icon: "TreePalm" },
      { _id: "2", name: "Outdoor Plants", icon: "Leaf" },
      { _id: "3", name: "Succulents", icon: "Sprout" },
      { _id: "4", name: "Flowering Plants", icon: "Flower" },
      { _id: "5", name: "Cactus", icon: "Cactus" }, // lucide supports cactus icon
      { _id: "6", name: "Herbs", icon: "Basil" }, // optional (fallback to Leaf)
    ];

    setCategories(tempCategories);
  }, []);

  return (
    <section className="py-12 bg-base-100">
      <h2 className="text-3xl font-bold text-center mb-10">
        Shop by Categories
      </h2>

      <div className="container mx-auto px-6">
        <Swiper
          slidesPerView={4}
          spaceBetween={20}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          pagination={false}
          modules={[Autoplay, Pagination, Navigation]}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 10 },
            640: { slidesPerView: 3, spaceBetween: 15 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
          }}
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat._id}>
              <CategoryCard name={cat.name} icon={cat.icon} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default CategoryCarousel;
