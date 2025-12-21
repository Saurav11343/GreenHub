import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";

/**
 * PlantFilter (responsive) — debounce removed
 */
export default function PlantFilter({
  categories = [],
  onFilter = () => {},
  defaultValues = { q: "", category: "", maxPrice: 1000 },
}) {
  const { register, watch, setValue, getValues, reset } = useForm({
    defaultValues: {
      query: defaultValues.q ?? "",
      category: defaultValues.category ?? "",
      maxPrice: defaultValues.maxPrice ?? 1000,
    },
  });

  const watched = watch();

  // Call onFilter immediately whenever any watched field changes
  useEffect(() => {
    const vals = getValues();
    onFilter({
      q: vals.query,
      category: vals.category,
      maxPrice: Number(vals.maxPrice || 0),
    });
    // include getValues and onFilter to satisfy deps
  }, [watched.query, watched.category, watched.maxPrice, getValues, onFilter]);

  function clearSearchField() {
    setValue("query", "");
  }

  function clearAllFilters() {
    reset({
      query: "",
      category: "",
      maxPrice: 1000,
    });

    onFilter({
      q: "",
      category: "",
      maxPrice: 1000,
    });
  }

  return (
    <div className="p-2">
      {/* Outer: column on mobile (search row + controls row), row on md+ */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        {/* SEARCH — full width row on mobile, flex-grow on md+ */}
        <div className="relative w-full md:flex-1">
          <div className="input bg-base-100 flex items-center gap-2 px-3 w-full">
            <input
              type="search"
              placeholder="Search plants, names or tags"
              className="grow bg-transparent outline-none"
              {...register("query")}
            />
          </div>

          {watched.query && (
            <button
              type="button"
              onClick={clearSearchField}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Controls row:
            - On mobile: this appears as second row and spans full width with items side-by-side
            - On md+: it sits to the right of the search as compact items
        */}
        <div className="flex w-full md:w-auto items-center gap-3">
          {/* CATEGORY SELECT */}
          <div className="flex-1 md:flex-none md:w-48">
            <select
              className="select select-bordered w-full"
              {...register("category")}
            >
              <option value="">All Categories</option>

              {Array.isArray(categories) &&
                categories.map((c) => {
                  if (!c) return null;
                  if (typeof c === "string") {
                    return (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    );
                  }
                  const key = c._id ?? c.id ?? c.name;
                  const val = c.name ?? c.label;
                  return (
                    <option key={key} value={val}>
                      {val}
                    </option>
                  );
                })}
            </select>
          </div>

          {/* MAX PRICE INPUT */}
          <div className="flex-1 md:flex-none md:w-40">
            <input
              type="number"
              placeholder="Max Price"
              className="input input-bordered w-full"
              {...register("maxPrice", { valueAsNumber: true })}
            />
          </div>

          {/* CLEAR ALL BUTTON */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={clearAllFilters}
              className="btn btn-outline btn-sm whitespace-nowrap"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
