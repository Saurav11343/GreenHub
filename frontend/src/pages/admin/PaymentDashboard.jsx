import React, { useEffect } from "react";
import { usePaymentStore } from "../../store/usePaymentStore";
import PageLoader from "../../components/loader/PageLoader";
import PaymentFilter from "../../components/page/payment/PaymentFilter";
import PaymentTable from "../../components/page/payment/PaymentTable";

function PaymentDashboard() {
  const {
    payments = [],
    totalCount = 0,
    loading,
    error,
    getAllPayments,
  } = usePaymentStore();

  useEffect(() => {
    getAllPayments();
  }, []);

  if (loading) return <PageLoader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-hidden pb-0">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-3">
          <h1 className="text-2xl md:text-3xl font-bold">Payment Dashboard</h1>
          <span className="badge badge-neutral text-sm md:badge-lg">
            {totalCount} Total
          </span>
        </div>
      </div>

      {/* FILTER */}
      <PaymentFilter onFilter={getAllPayments} />

      {/* TABLE */}
      <div className="rounded overflow-hidden ">
        <div className="max-h-[70vh] md:max-h-[55vh] overflow-y-auto hide-scrollbar border-2">
          <PaymentTable payments={payments} />
        </div>
      </div>
    </div>
  );
}

export default PaymentDashboard;
