import React from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../store/useAuthStore";
import { useOrderStore } from "../../../store/useOrderStore";

function OrderCardGrid({ orders, onRefresh }) {
  const { authUser } = useAuthStore();
  const role = authUser?.roleName || "Undefined";

  const { updateOrderStatus, cancelOrder } = useOrderStore();

  /* ---------------- STATUS BADGE ---------------- */
  const getStatusBadge = (status) => {
    switch (status) {
      case "PaymentPending":
        return "badge-warning";
      case "Confirmed":
        return "badge-primary";
      case "Shipped":
        return "badge-info";
      case "Delivered":
        return "badge-success";
      case "Cancelled":
        return "badge-error";
      case "PaymentFailed":
        return "badge badge-error badge-outline";
      default:
        return "badge-neutral";
    }
  };

  /* ---------------- PERMISSION HELPERS ---------------- */
  const canCustomerCancel = (status) =>
    ["PaymentPending", "Confirmed"].includes(status);

  const getAdminActionLabel = (status) => {
    if (status === "Confirmed") return "Ship";
    if (status === "Shipped") return "Deliver";
    return null;
  };

  /* ---------------- HANDLERS ---------------- */
  const handleCancel = async (orderId) => {
    const res = await cancelOrder(orderId);

    if (res?.success) {
      toast.success(res.message || "Order cancelled successfully");
      await onRefresh();
    } else {
      toast.error(res?.message || "Failed to cancel order");
    }
  };

  const handleAdminUpdate = async (orderId) => {
    const res = await updateOrderStatus(orderId);

    if (res?.success) {
      toast.success(res.message || "Order status updated");
      await onRefresh();
    } else {
      toast.error(res?.message || "Failed to update order");
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No orders match the selected filters
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {orders.map((order) => {
        const adminAction = getAdminActionLabel(order.status);

        return (
          <div
            key={order._id}
            className="bg-base-100 border rounded-md shadow-sm hover:shadow-md transition"
          >
            <div className="p-3 flex flex-col gap-2 text-xs">
              {/* ================= HEADER ================= */}
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="font-semibold truncate">
                    {order.userId?.firstName} {order.userId?.lastName}
                  </p>
                  <p className="text-gray-500 truncate">
                    {order.userId?.email}
                  </p>
                </div>

                <span
                  className={`badge badge-xs ${getStatusBadge(
                    order.status || "PaymentPending"
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* ================= META ================= */}
              <div className="flex justify-between text-[11px] text-gray-600">
                <span>
                  <strong>ID:</strong>{" "}
                  <span className=" inline-block max-w-[90px] align-bottom">
                    {order._id}
                  </span>
                </span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>

              {/* ================= TOTAL ================= */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total</span>
                <span className="font-bold text-sm">₹{order.totalAmount}</span>
              </div>

              {/* ================= ITEMS ================= */}
              <ul className="list-disc ml-4 space-y-0.5 text-[11px]">
                {order.items?.map((item) => (
                  <li key={item._id} className="truncate">
                    {item.plantId?.name} × {item.quantity}
                  </li>
                ))}
              </ul>

              {/* ================= ACTIONS ================= */}
              <div className="flex justify-end gap-1 pt-1">
                {/* CUSTOMER CANCEL */}
                {role === "Customer" && canCustomerCancel(order.status) && (
                  <button
                    className="btn btn-xs btn-outline btn-error"
                    onClick={() => handleCancel(order._id)}
                  >
                    Cancel
                  </button>
                )}

                {/* ADMIN ACTION */}
                {role === "Admin" && adminAction && (
                  <button
                    className="btn btn-xs btn-outline btn-primary"
                    onClick={() => handleAdminUpdate(order._id)}
                  >
                    {adminAction}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default OrderCardGrid;
