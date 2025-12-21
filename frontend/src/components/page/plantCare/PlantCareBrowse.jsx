import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useLocation, useNavigate } from "react-router";
import PlantFilter from "../plants/PlantFilter";
import { usePlantStore } from "../../../store/usePlantStore";
import { useCategoryStore } from "../../../store/useCategoryStore";

export default function PlantCareBrowse({
  redirectBasePath = "/admin/plantcare/update",
}) {
  const { plants = [], loading, getAllPlants } = usePlantStore();
  const { categories = [], getAllCategories } = useCategoryStore();

  const location = useLocation();
  const categoryIdFromState = location.state?.categoryId || null;

  const [filteredPlants, setFilteredPlants] = useState(null);
  const navigate = useNavigate();

  const didFetchRef = useRef(false);
  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    getAllCategories();
    getAllPlants();
  }, [getAllCategories, getAllPlants]);

  useEffect(() => {
    setFilteredPlants(null);
  }, [plants]);

  const runClientFilter = useCallback(
    (filters) => {
      const q = (filters.q || "").trim().toLowerCase();
      const category = filters.category || "";

      const result = (plants || []).filter((p) => {
        const name = (p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        const matchesQ = !q || name.includes(q) || desc.includes(q);

        const pCategory =
          p.categoryId?.name || p.category || p.categoryName || "";

        const matchesCategory = !category || pCategory === category;

        return matchesQ && matchesCategory;
      });

      setFilteredPlants(result);
    },
    [plants]
  );

  const handleFilter = useCallback(
    (filters) => runClientFilter(filters),
    [runClientFilter]
  );

  const selectedCategoryName = useMemo(() => {
    if (!categoryIdFromState || categories.length === 0) return "";
    return (
      categories.find(
        (c) => c._id === categoryIdFromState || c.id === categoryIdFromState
      )?.name || ""
    );
  }, [categoryIdFromState, categories]);

  useEffect(() => {
    if (!selectedCategoryName) return;
    runClientFilter({ q: "", category: selectedCategoryName });
  }, [selectedCategoryName, runClientFilter]);

  const filterDefaultValues = useMemo(
    () => ({ q: "", category: selectedCategoryName || "" }),
    [selectedCategoryName]
  );

  const listToRender = Array.isArray(filteredPlants) ? filteredPlants : plants;

  return (
    <div className="p-4 max-w-full mx-auto">
      {/* Filter (search + category only) */}
      <PlantFilter
        key={selectedCategoryName || "all"}
        categories={categories}
        onFilter={handleFilter}
        defaultValues={filterDefaultValues}
        hidePriceFilter
      />

      {/* Grid */}
      <div className="bg-base-100 rounded-xl shadow max-h-[600px] overflow-y-auto hide-scrollbar">
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <p>Loading plants...</p>
            ) : listToRender.length === 0 ? (
              <p>No plants found.</p>
            ) : (
              listToRender.map((p) => (
                <div
                  key={p._id}
                  onClick={() => navigate(`${redirectBasePath}/${p._id}`)}
                  className="cursor-pointer rounded-lg border p-4 hover:shadow transition"
                >
                  <img
                    src={p.imageUrl || "/plant.webp"}
                    alt={p.name}
                    className="h-40 w-full object-cover rounded"
                  />

                  <div className="mt-3 space-y-2">
                    {/* NAME + CATEGORY ROW */}
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium text-lg truncate">{p.name}</h3>

                      <span className="shrink-0 text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">
                        {p.categoryId?.name || "Uncategorized"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500">Manage plant care →</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
