import React from "react";
import * as Icons from "lucide-react";

function CategoryCard({ name, icon, image }) {
  const IconComponent = Icons[icon] || Icons.Leaf;
  const fallback = "/plant.webp";

  return (
    <div
      className="
        relative 
        w-full 
        h-40 
        rounded-xl 
        overflow-hidden 
        shadow-md 
        hover:shadow-xl 
        transition 
        cursor-pointer
        bg-base-200
      "
    >
      {/* IMAGE */}
      {image && (
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => (e.target.src = fallback)}
        />
      )}

      {/* CONTENT */}
      <div
        className="
          absolute 
          bottom-3 
          left-1/2 
          -translate-x-1/2
          z-10 
          flex 
          flex-col 
          items-center 
          text-center
        "
      >
        {!image && <IconComponent className="h-12 w-12 text-green-600 mb-1" />}

        {/* Category name with its own dark overlay */}
        <div
          className="
            bg-black/60 
            backdrop-blur-sm
            px-3 
            py-1 
            rounded-full 
            flex 
            items-center 
            justify-center
          "
        >
          <p
            className={`text-lg font-semibold ${
              image ? "text-white" : "text-base-content"
            }`}
          >
            {name}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CategoryCard;
