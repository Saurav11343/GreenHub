import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import PlantFilter from "../../components/page/plants/PlantFilter";
import PlantCartCard from "../../components/page/plants/PlantCartCard";
import { usePlantStore } from "../../store/usePlantStore";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useAuthStore } from "../../store/useAuthStore";

export default function PlantBrowse() {
  const { authUser } = useAuthStore();

  if (authUser?.roleName === "Admin") {
    return <Navigate to="/admin" replace />;
  }

  const { plants = [], loading: plantLoading, getAllPlants } = usePlantStore();
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
      const maxPrice = Number(filters.maxPrice || 0);

      const result = (plants || []).filter((p) => {
        const name = (p.name || "").toString().toLowerCase();
        const desc = (p.description || "").toString().toLowerCase();
        const matchesQ = q === "" || name.includes(q) || desc.includes(q);

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

  const handleFilter = useCallback(
    (filters) => {
      runClientFilter(filters);
    },
    [runClientFilter]
  );

  const selectedCategoryName = useMemo(() => {
    if (!categoryIdFromState || categories.length === 0) return "";
    const matched = categories.find(
      (c) => c._id === categoryIdFromState || c.id === categoryIdFromState
    );
    return matched?.name || "";
  }, [categoryIdFromState, categories]);

  useEffect(() => {
    if (!categoryIdFromState) return;

    if (!selectedCategoryName && categories.length === 0) return;

    runClientFilter({ q: "", category: selectedCategoryName, maxPrice: 0 });
  }, [categoryIdFromState, selectedCategoryName, categories, runClientFilter]);

  const filterDefaultValues = useMemo(
    () => ({ q: "", category: selectedCategoryName || "", maxPrice: 1000 }),
    [selectedCategoryName]
  );

  const listToRender = Array.isArray(filteredPlants) ? filteredPlants : plants;

  return (
    <div className="p-4 max-w-full mx-auto">
      <PlantFilter
        key={selectedCategoryName || "all"}
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
