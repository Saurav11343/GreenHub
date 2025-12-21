import React, { useEffect } from "react";
import { useAnalysisStore } from "../../store/useAnalysisStore";
import { usePlantStockStore } from "../../store/usePlantStockStore";
import PageLoader from "../../components/loader/PageLoader";
import AdminCharts from "../../components/page/admin/AdminCharts";
import DashboardStatCard from "../../components/page/admin/DashboardStatCard";

function AdminDashboard() {
  const { summary, loading, error, getAdminDashboardSummary } =
    useAnalysisStore();

  const { stockSummary, getStockSummary } = usePlantStockStore();

  useEffect(() => {
    getAdminDashboardSummary();
    getStockSummary();
  }, [getAdminDashboardSummary, getStockSummary]);

  if (loading || !stockSummary) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <PageLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 text-center text-red-500 font-medium">
        {error}
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          Admin Dashboard
        </h1>
      </div>

      <div
        className="
          grid
          grid-cols-1
          xs:grid-cols-2
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-6
          gap-3
        "
      >
        <DashboardStatCard
          title="Total Orders"
          value={summary.orders.total}
          desc="All time orders"
          to="/admin/orders"
        />

        <DashboardStatCard
          title="Payments"
          value={summary.payments.total}
          desc="Total transactions"
          to="/admin/payments"
          color="info"
        />

        <DashboardStatCard
          title="Revenue"
          value={`₹${summary.revenue.total}`}
          desc="Successful payments"
          color="success"
        />

        <DashboardStatCard
          title="Inventory"
          value={stockSummary.totalInventory}
          desc="Units in stock"
          to="/admin/stock"
          color="secondary"
        />

        <DashboardStatCard
          title="Users"
          value={summary.users.total}
          desc="Registered users"
          to="/admin/users"
        />

        <DashboardStatCard
          title="Plants"
          value={summary.plants.total}
          desc="Available plants"
          to="/admin/plants"
          color="success"
        />

        <DashboardStatCard
          title="Categories"
          value={summary.categories.total}
          desc="Plant categories"
          to="/admin/categories"
          color="warning"
        />
      </div>

      <div className="w-full overflow-x-hidden">
        <AdminCharts summary={summary} />
      </div>
    </div>
  );
}

export default AdminDashboard;
