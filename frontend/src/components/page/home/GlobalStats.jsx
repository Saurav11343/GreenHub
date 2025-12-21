import React, { useEffect } from "react";
import { Leaf, Layers, Package } from "lucide-react";
import { useAnalysisStore } from "../../../store/useAnalysisStore";
import { usePlantStockStore } from "../../../store/usePlantStockStore";
import PageLoader from "../../loader/PageLoader";

function GlobalStats() {
  const { summary, loading, getAdminDashboardSummary } = useAnalysisStore();
  const { stockSummary, getStockSummary } = usePlantStockStore();

  useEffect(() => {
    getAdminDashboardSummary();
    getStockSummary();
  }, [getAdminDashboardSummary, getStockSummary]);

  if (loading || !summary || !stockSummary) {
    return (
      <div className="flex justify-center py-12">
        <PageLoader />
      </div>
    );
  }

  return (
    <section className="w-full p-4 md:p-6">
      <div
        className="
          stats
          stats-vertical
          sm:stats-horizontal
          shadow
          w-full
          text-center
          sm:text-left
        "
      >
        {/* PLANTS */}
        <div className="stat items-center sm:items-start">
          <div className="stat-figure text-success mb-2 sm:mb-0">
            <Leaf className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="stat-title">Plants Available</div>
          <div className="stat-value text-3xl sm:text-4xl">
            {summary.plants.total}+
          </div>
          <div className="stat-desc">Indoor & outdoor plants</div>
        </div>

        {/* CATEGORIES */}
        <div className="stat items-center sm:items-start">
          <div className="stat-figure text-warning mb-2 sm:mb-0">
            <Layers className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="stat-title">Categories</div>
          <div className="stat-value text-3xl sm:text-4xl">
            {summary.categories.total}
          </div>
          <div className="stat-desc">Plant varieties</div>
        </div>

        {/* INVENTORY */}
        <div className="stat items-center sm:items-start">
          <div className="stat-figure text-secondary mb-2 sm:mb-0">
            <Package className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="stat-title">Stock Available</div>
          <div className="stat-value text-3xl sm:text-4xl">
            {Math.floor(stockSummary.totalInventory / 10) * 10}+
          </div>
          <div className="stat-desc">Units ready to ship</div>
        </div>
      </div>
    </section>
  );
}

export default GlobalStats;
