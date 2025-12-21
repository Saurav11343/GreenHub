import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const ORDER_COLORS = {
  PaymentPending: "#facc15", // yellow
  Confirmed: "#3b82f6", // blue
  Shipped: "#8b5cf6", // purple
  Delivered: "#22c55e", // green
  Cancelled: "#ef4444", // red
  PaymentFailed: "#f97316", // orange
};

function AdminCharts({ summary }) {
  if (!summary) return null;

  /* ---------------- ORDER STATUS ---------------- */
  const orderData = [
    {
      name: "Payment Pending",
      value: summary.orders.paymentPending,
      key: "PaymentPending",
    },
    {
      name: "Confirmed",
      value: summary.orders.confirmed,
      key: "Confirmed",
    },
    {
      name: "Shipped",
      value: summary.orders.shipped,
      key: "Shipped",
    },
    {
      name: "Delivered",
      value: summary.orders.delivered,
      key: "Delivered",
    },
    {
      name: "Cancelled",
      value: summary.orders.cancelled,
      key: "Cancelled",
    },
    {
      name: "Payment Failed",
      value: summary.orders.paymentFailed,
      key: "PaymentFailed",
    },
  ].filter((item) => item.value > 0);
  /* ---------------- PAYMENTS ---------------- */
  const paymentData = [
    { name: "Success", value: summary.payments.success },
    { name: "Failed", value: summary.payments.failed },
  ];

  /* ---------------- TOP PLANTS ---------------- */
  const topPlantsData = summary.topPlants.map((p) => ({
    name: p.name,
    sold: p.totalSold,
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* ================= ORDER STATUS PIE ================= */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="font-semibold mb-3">Order Status</h2>

          {orderData.length === 0 ? (
            <p className="text-center text-gray-500">No order data</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={orderData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {orderData.map((entry, index) => (
                    <Cell key={index} fill={ORDER_COLORS[entry.key]} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ================= PAYMENTS BAR ================= */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="font-semibold mb-3">Payments</h2>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={paymentData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= TOP PLANTS ================= */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="font-semibold mb-3">Top Selling Plants</h2>

          {topPlantsData.length === 0 ? (
            <p className="text-center text-gray-500">No sales yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topPlantsData} layout="vertical">
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="sold" fill="#22c55e" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCharts;
