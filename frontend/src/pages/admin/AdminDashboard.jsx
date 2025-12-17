import React, { useEffect } from "react";
import { useAnalysisStore } from "../../store/useAnalysisStore";
import PageLoader from "../../components/loader/PageLoader";
import AdminCharts from "../../components/page/admin/AdminCharts";
import DashboardStatCard from "../../components/page/admin/DashboardStatCard";

function AdminDashboard() {
  const { summary, loading, error, getAdminDashboardSummary } =
    useAnalysisStore();

  useEffect(() => {
    getAdminDashboardSummary();
  }, [getAdminDashboardSummary]);

  /* ---------------- LOADING STATE ---------------- */
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  /* ---------------- ERROR STATE ---------------- */
  if (error) {
    return (
      <div className="p-6 text-center text-red-500 font-medium">{error}</div>
    );
  }

  /* ---------------- NO DATA ---------------- */
  if (!summary) return null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* HEADER */}
      <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* CHARTS */}
      <AdminCharts summary={summary} />
    </div>
  );
}

export default AdminDashboard;
