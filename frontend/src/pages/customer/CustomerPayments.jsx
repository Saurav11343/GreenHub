import React, { useEffect, useState } from "react";
import PaymentFilter from "../../components/page/payment/PaymentFilter";
import PaymentTable from "../../components/page/payment/PaymentTable";
import PageLoader from "../../components/loader/PageLoader";
import { usePaymentStore } from "../../store/usePaymentStore";
import { useAuthStore } from "../../store/useAuthStore";

function CustomerPayments() {
  const { userId } = useAuthStore();

  const {
    payments = [],
    totalCount = 0,
    loading,
    error,
    getUserPayments,
  } = usePaymentStore();

  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (userId) {
      getUserPayments(userId, filters);
    }
  }, [userId, filters, getUserPayments]);

  if (loading) return <PageLoader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-hidden pb-0">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-3">
          <h1 className="text-2xl md:text-3xl font-bold">My Payments</h1>
          <span className="badge badge-neutral text-sm md:badge-lg">
            {totalCount} Total
          </span>
        </div>
      </div>

      {/* FILTER */}
      <PaymentFilter
        onFilter={(newFilters) => setFilters(newFilters)}
        onReset={() => setFilters({})}
      />

      {/* TABLE */}
      <div className="rounded overflow-hidden">
        <div className="max-h-[70vh] md:max-h-[55vh] overflow-y-auto hide-scrollbar border-2">
          <PaymentTable payments={payments} />
        </div>
      </div>
    </div>
  );
}

export default CustomerPayments;
