import React from "react";
import { Pencil, Trash2 } from "lucide-react";

function PlantCard({ plant, onEdit, onDelete }) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-base-100 shadow-md border rounded-xl overflow-hidden hover:shadow-lg transition duration-200 p-4 gap-4">
      {/* Section 1 – Image */}
      <div className="w-full sm:w-28 h-44 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
        <img
          src={plant.imageUrl || "/plant.webp"}
          alt={plant.name || "plant image"}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Section 2 – Basic Info */}
      <div className="flex-1 space-y-1 text-center sm:text-left">
        <h2 className="text-lg font-semibold leading-tight truncate">
          {plant.name}
        </h2>

        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-600">Category:</span>{" "}
          <span className="inline-block truncate max-w-xs">
            {plant.categoryId?.name || "N/A"}
          </span>
        </p>

        <p className="text-sm text-gray-700 font-medium">
          Price: ₹{plant.price}
        </p>

        <p className="text-xs text-gray-500">Stock: {plant.stockQty}</p>
      </div>

      {/* Section 3 – Buttons */}
      <div className="w-full sm:w-auto flex gap-2 sm:flex-col sm:justify-center sm:items-end">
        {/* On mobile: buttons are full-width. On sm+: compact column. */}
        <button
          className="btn btn-sm btn-primary flex-1 sm:flex-none flex items-center justify-center gap-2"
          onClick={() => onEdit?.(plant)}
          aria-label={`Edit ${plant.name}`}
        >
          <Pencil className="h-4 w-4" />
          <span className="hidden sm:inline">Edit</span>
        </button>

        <button
          className="btn btn-sm btn-error flex-1 sm:flex-none flex items-center justify-center gap-2"
          onClick={() => onDelete?.(plant)}
          aria-label={`Delete ${plant.name}`}
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </div>
  );
}

export default PlantCard;
