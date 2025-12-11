import React from "react";

export default function PlantCartCard({
  image,
  title,
  price,
  quantity,
  onAddToCart = () => {},
}) {
  return (
    <div
      className="
        relative 
        bg-base-100 
        rounded-xl 
        overflow-hidden 
        shadow-md 
        hover:shadow-xl 
        transition-all 
        duration-300 
        border 
        border-base-200
      "
    >
      {/* IMAGE */}
      <figure className="relative">
        <img
          src={image || "/plant.webp"}
          alt={title}
          className="w-full h-56 object-cover"
        />

        {/* TITLE FLOATING ON IMAGE */}
        <div
          className="
            absolute 
            bottom-3 
            left-3 
            bg-black/60 
            text-white 
            px-2 
            py-1 
            rounded-md 
            text-sm 
            font-semibold
          "
        >
          {title}
        </div>

        {/* ADD TO CART BUTTON */}
        <button
          onClick={onAddToCart}
          className="
            absolute 
            bottom-3 
            right-3 
            btn btn-sm btn-primary 
            shadow-lg
          "
        >
          Add to Cart
        </button>
      </figure>

      {/* PRICE + QUANTITY */}
      <div className="p-4">
        <div className="flex items-center justify-between pt-2 border-t border-base-200">
          <span className="text-lg font-bold text-primary">₹{price}</span>

          <span
            className={`text-sm font-medium ${
              quantity > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {quantity > 0 ? `${quantity} in stock` : "Out of stock"}
          </span>
        </div>
      </div>
    </div>
  );
}
