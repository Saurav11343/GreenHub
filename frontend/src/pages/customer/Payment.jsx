import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import { useAuthStore } from "../../store/useAuthStore";
import { usePaymentStore } from "../../store/usePaymentStore";
import { useOrderStore } from "../../store/useOrderStore";

/* --------------------------------
   RAZORPAY SCRIPT LOADER
--------------------------------- */
const loadRazorpay = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Razorpay SDK failed to load"));

    document.body.appendChild(script);
  });
};

function Payment({ orderId, onClose }) {
  const navigate = useNavigate();
  const hasOpenedRef = useRef(false);

  const [loading, setLoading] = useState(true);

  const { userId } = useAuthStore();
  const { createRazorpayOrder, verifyPayment, markPaymentFailed } =
    usePaymentStore();
  const { getOrderById, order } = useOrderStore();

  /* -----------------------------
     FETCH ORDER
  ------------------------------ */
  useEffect(() => {
    if (orderId) getOrderById(orderId);
  }, [orderId, getOrderById]);

  /* -----------------------------
     OPEN RAZORPAY (SAFE)
  ------------------------------ */
  useEffect(() => {
    if (!order || hasOpenedRef.current) return;

    const openCheckout = async () => {
      try {
        hasOpenedRef.current = true;

        // 1️⃣ Load Razorpay SDK
        await loadRazorpay();

        // 2️⃣ Create Razorpay order
        const rpRes = await createRazorpayOrder(order.totalAmount);
        if (!rpRes?.success) {
          throw new Error("Failed to create Razorpay order");
        }

        const options = {
          key: "rzp_test_RsMawJjoB61ua2",
          amount: rpRes.order.amount,
          currency: "INR",
          name: "Plant Store",
          description: "Plant Purchase",
          order_id: rpRes.order.id,

          handler: async (response) => {
            const verifyRes = await verifyPayment({
              orderId: order._id,
              userId,
              transactionId: response.razorpay_payment_id,
            });

            if (verifyRes.success) {
              toast.success("Payment successful");
              onClose();
              navigate(`/customer/checkout/${userId}`);
            } else {
              toast.error(verifyRes.message || "Payment verification failed");
            }
          },

          modal: {
            ondismiss: async () => {
              await markPaymentFailed({
                orderId: order._id,
                userId,
              });
              toast("Payment cancelled");
              onClose();
            },
          },

          theme: { color: "#16a34a" },
        };

        const rzp = new window.Razorpay(options);

        // ✅ Hide loader only when checkout is opening
        setLoading(false);
        rzp.open();
      } catch (err) {
        console.error(err);
        toast.error("Unable to open payment gateway");
        onClose();
      }
    };

    openCheckout();
  }, [
    order,
    userId,
    createRazorpayOrder,
    verifyPayment,
    markPaymentFailed,
    navigate,
    onClose,
  ]);

  /* -----------------------------
     UI
  ------------------------------ */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <span className="loading loading-dots loading-md" />
        <span className="text-sm text-gray-600">Opening payment gateway…</span>
      </div>
    );
  }

  return null;
}

export default Payment;
