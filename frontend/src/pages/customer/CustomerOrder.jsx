import React, { useState, useEffect } from "react";
import { useOrderStore } from "../../store/useOrderStore";
import { useAuthStore } from "../../store/useAuthStore";
import OrderFilter from "../../components/page/order/OrderFilter";
import OrderCardGrid from "../../components/page/order/OrderCardGrid";
import PageLoader from "../../components/loader/PageLoader";

function CustomerOrder() {
  const { authUser } = useAuthStore();
  const userId = authUser?.userId;

  const {
    orders = [],
    loading,
    error,
    getUserOrders,
    clearOrders,
  } = useOrderStore();

  const [filters, setFilters] = useState({
    status: "",
    dateRange: "",
  });

  useEffect(() => {
    if (!userId) return;

    clearOrders();
    getUserOrders(userId);

    return () => {
      clearOrders();
    };
  }, [userId, getUserOrders, clearOrders]);

  if (loading) return <PageLoader />;
  if (error) return <p className="text-red-500">{error}</p>;

  const filteredOrders = orders.filter((order) => {
    if (filters.status && order.status !== filters.status) return false;

    if (filters.dateRange) {
      const orderDate = new Date(order.createdAt);
      const now = new Date();

      if (filters.dateRange === "today") {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        return orderDate >= start && orderDate <= end;
      }

      if (filters.dateRange === "7days") {
        const past = new Date();
        past.setDate(now.getDate() - 7);
        past.setHours(0, 0, 0, 0);
        return orderDate >= past;
      }

      if (filters.dateRange === "month") {
        const past = new Date();
        past.setMonth(now.getMonth() - 1);
        past.setHours(0, 0, 0, 0);
        return orderDate >= past;
      }
    }

    return true;
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">My Orders</h1>
        <span className="badge badge-neutral">
          {filteredOrders.length} Total
        </span>
      </div>

      <OrderFilter
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters({ status: "", dateRange: "" })}
      />

      <div className="rounded overflow-hidden">
        <div className="max-h-[70vh] md:max-h-[58vh] overflow-y-auto hide-scrollbar">
          <OrderCardGrid
            orders={filteredOrders}
            onRefresh={() => getUserOrders(userId)}
          />
        </div>
      </div>
    </div>
  );
}

export default CustomerOrder;
