import React from "react";
import { useAuthStore } from "../../../store/useAuthStore";

function OrderCardGrid({ orders }) {
  const { authUser } = useAuthStore();
  const role = authUser?.roleName || "Undefined";
  const getStatusBadge = (status) => {
    switch (status) {
      case "PaymentPending":
        return "badge-warning"; // waiting for payment

      case "Confirmed":
        return "badge-primary"; // payment confirmed

      case "Shipped":
        return "badge-info"; // dispatched

      case "Delivered":
        return "badge-success"; // delivered

      case "Cancelled":
        return "badge-error"; // cancelled

      case "PaymentFailed":
        return "badge-outline badge-error"; // payment failed

      default:
        return "badge-neutral";
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No orders match the selected filters
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-base-100 border rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="p-4 space-y-3">
            {/* TOP */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-sm">
                  {order.userId?.firstName} {order.userId?.lastName}
                </h2>
                <p className="text-xs text-gray-500 truncate max-w-[180px]">
                  {order.userId?.email}
                </p>
              </div>

              <span
                className={`badge badge-sm ${getStatusBadge(
                  order.status || "Pending"
                )}`}
              >
                {order.status || "Pending"}
              </span>
            </div>

            {/* INFO */}
            <div className="text-xs space-y-1">
              <p className="truncate">
                <strong>ID:</strong> {order._id}
              </p>
              <p>
                <strong>Total:</strong>{" "}
                <span className="font-semibold">₹{order.totalAmount}</span>
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* ITEMS */}
            <div>
              <p className="text-xs font-semibold mb-1">Items</p>
              <ul className="list-disc ml-4 text-xs space-y-0.5">
                {order.items?.slice(0, 3).map((item) => (
                  <li key={item._id} className="truncate">
                    {item.plantId?.name} × {item.quantity}
                  </li>
                ))}
                {order.items?.length > 3 && (
                  <li className="text-gray-400 italic">
                    +{order.items.length - 3} more
                  </li>
                )}
              </ul>
            </div>

            {/* ACTION (Admin only) */}
            {role === "Admin" && (
              <div className="flex justify-end pt-1">
                <button
                  className="btn btn-xs btn-outline btn-primary"
                  onClick={() => console.log("Update order:", order._id)}
                >
                  Update
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderCardGrid;
