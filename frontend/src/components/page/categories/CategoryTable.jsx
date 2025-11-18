import React from "react";
import { Pencil, Trash2 } from "lucide-react";

function CategoryTable({ data, onEdit, onDelete }) {
  return (
    <div
      className="
        overflow-x-auto bg-base-100 rounded-xl shadow
        max-h-[400px] md:max-h-[470px]
        overflow-y-auto hide-scrollbar
      "
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
            data.map((category) => (
              <tr key={category._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-10 w-10 md:h-12 md:w-12 bg-base-300">
                        <img src="/plant.webp" alt="Category Icon" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{category.name}</div>
                      <div className="text-sm opacity-50">{category.short}</div>
                    </div>
                  </div>
                </td>

                <td className="hidden md:table-cell">{category.description}</td>

                <td className="text-right">
                  <div className="flex justify-end gap-1 flex-wrap">
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => onEdit(category)}
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </button>

                    <button
                      className="btn btn-ghost btn-xs text-error"
                      onClick={() => onDelete(category)}
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
