import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useLocation, useNavigate } from "react-router";
import PlantFilter from "../../components/page/plants/PlantFilter";
import PlantCartCard from "../../components/page/plants/PlantCartCard";
import { usePlantStore } from "../../store/usePlantStore";
import { useCategoryStore } from "../../store/useCategoryStore";

export default function PlantBrowse() {
  const { plants = [], loading: plantLoading, getAllPlants } = usePlantStore();
  const { categories = [], getAllCategories } = useCategoryStore();

  const location = useLocation();
  const categoryIdFromState = location.state?.categoryId || null;

  const [filteredPlants, setFilteredPlants] = useState(null);

  const navigate = useNavigate();

  // run initial fetch once
  const didFetchRef = useRef(false);
  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    getAllCategories();
    getAllPlants();
  }, [getAllCategories, getAllPlants]);

  // clear client snapshot when store updates
  useEffect(() => {
    setFilteredPlants(null);
  }, [plants]);

  const runClientFilter = useCallback(
    (filters) => {
      const q = (filters.q || "").trim().toLowerCase();
      const category = filters.category || "";
      const maxPrice = Number(filters.maxPrice || 0);

      const result = (plants || []).filter((p) => {
        const name = (p.name || "").toString().toLowerCase();
        const desc = (p.description || "").toString().toLowerCase();
        const matchesQ = q === "" || name.includes(q) || desc.includes(q);

        // backend returns category as object: { _id, name }
        const pCategory = (
          p.categoryId?.name ||
          p.category ||
          p.categoryName ||
          ""
        ).toString();
        const matchesCategory = !category || pCategory === category;

        const plantPrice = Number(
          p.price ?? p.cost ?? p.priceAmount ?? p.amount ?? 0
        );
        const matchesPrice = !maxPrice || plantPrice <= maxPrice;

        return matchesQ && matchesCategory && matchesPrice;
      });

      setFilteredPlants(result);
    },
    [plants]
  );

  // purely client-side filter handler
  const handleFilter = useCallback(
    (filters) => {
      runClientFilter(filters);
    },
    [runClientFilter]
  );

  // derive the selected category name (if any) from categories
  const selectedCategoryName = useMemo(() => {
    if (!categoryIdFromState || categories.length === 0) return "";
    const matched = categories.find(
      (c) => c._id === categoryIdFromState || c.id === categoryIdFromState
    );
    return matched?.name || "";
  }, [categoryIdFromState, categories]);

  // Apply the category filter automatically when we have a categoryId and category name
  useEffect(() => {
    if (!categoryIdFromState) return;

    // if categories haven't loaded yet, wait (selectedCategoryName will update when categories arrive)
    if (!selectedCategoryName && categories.length === 0) return;

    // apply filter using the category name (client-side objects store category as name)
    runClientFilter({ q: "", category: selectedCategoryName, maxPrice: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryIdFromState, selectedCategoryName, categories, runClientFilter]);

  // default values for PlantFilter — pass category name so UI reflects selection.
  // Use key to force remount of PlantFilter when selected category changes (so defaultValues are applied).
  const filterDefaultValues = useMemo(
    () => ({ q: "", category: selectedCategoryName || "", maxPrice: 1000 }),
    [selectedCategoryName]
  );

  const listToRender = Array.isArray(filteredPlants) ? filteredPlants : plants;

  return (
    <div className="p-4 max-w-full mx-auto">
      <PlantFilter
        key={selectedCategoryName || "all"} // remounts when selection changes, applying defaultValues
        categories={categories}
        onFilter={handleFilter}
        defaultValues={filterDefaultValues}
      />

      <div className="overflow-x-auto overflow-y-auto hide-scrollbar bg-base-100 rounded-xl shadow max-h-[600px] md:max-h-[470px] lg:max-h-[580px]">
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plantLoading ? (
              <p>Loading plants...</p>
            ) : listToRender.length === 0 ? (
              <p>No plants found.</p>
            ) : (
              listToRender.map((p) => {
                const price = Number(
                  p.price ?? p.cost ?? p.priceAmount ?? p.amount ?? 0
                );
                const quantity = Number(
                  p.stockQty ?? p.stock ?? p.qty ?? p.quantity ?? p.inStock ?? 0
                );

                return (
                  // wrapper with fixed height and hidden scrollbar
                  <div
                    key={p._id ?? p.id}
                    className="h-80 overflow-auto hide_scrollbar p-2"
                    onClick={() => navigate(`/plants/details/${p._id}`)}
                  >
                    <PlantCartCard
                      image={p.imageUrl || p.image || p.photo || "/plant.webp"}
                      title={p.name ?? p.title ?? "Untitled"}
                      price={price}
                      quantity={quantity}
                      onAddToCart={() =>
                        console.log("Add to cart:", {
                          id: p._id ?? p.id,
                          name: p.name ?? p.title,
                          price,
                          quantity,
                        })
                      }
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
