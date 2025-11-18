import React from "react";
import { Pencil, Trash2 } from "lucide-react";

function CategoryTable({ data = [], onEdit, onDelete }) {
  return (
    <div
      className="overflow-x-auto overflow-y-auto hide-scrollbar 
                 bg-base-100 rounded-xl shadow max-h-[400px] md:max-h-[470px]"
    >
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Category</th>
            <th className="hidden md:table-cell">Description</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((cat) => (
              <tr key={cat._id}>
                {/* CATEGORY COLUMN */}
                <td>
                  <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className="avatar">
                      <div className="mask mask-squircle h-10 w-10 md:h-12 md:w-12 bg-base-300">
                        <img
                          src={cat.imageUrl || "/plant.webp"}
                          alt={cat.name}
                          onError={(e) => (e.target.src = "/plant.webp")}
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Name + Short */}
                    <div>
                      <p className="font-bold">{cat.name}</p>
                      {cat.short && (
                        <p className="text-sm opacity-50">{cat.short}</p>
                      )}
                    </div>
                  </div>
                </td>

                {/* DESCRIPTION */}
                <td className="hidden md:table-cell">{cat.description}</td>

                {/* ACTIONS */}
                <td className="text-right">
                  <div className="flex justify-end gap-1 flex-wrap">
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => onEdit(cat)}
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </button>

                    <button
                      className="btn btn-ghost btn-xs text-error"
                      onClick={() => onDelete(cat)}
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-4 opacity-60">
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CategoryTable;
