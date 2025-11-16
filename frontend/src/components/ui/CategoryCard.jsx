import React from "react";
import * as Icons from "lucide-react";

function CategoryCard({ name, icon, image }) {
  const IconComponent = Icons[icon] || Icons.Leaf;

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
        flex 
        items-center 
        justify-center
      "
    >
      {/* IMAGE (only if provided) */}
      {image && (
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* DARK OVERLAY for readability on image */}
      {image && <div className="absolute inset-0 bg-black bg-opacity-40"></div>}

      {/* CONTENT (icon or text stays centered) */}
      <div className="relative z-10 flex flex-col items-center gap-2 text-white">
        {/* Fallback icon if no image */}
        {!image && <IconComponent className="h-12 w-12 text-green-600" />}

        <p
          className={`text-lg font-semibold ${
            image ? "text-white" : "text-base-content"
          }`}
        >
          {name}
        </p>
      </div>
    </div>
  );
}

export default CategoryCard;
