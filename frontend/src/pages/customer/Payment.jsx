import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import { useAuthStore } from "../../store/useAuthStore";
import { usePaymentStore } from "../../store/usePaymentStore";
import { useOrderStore } from "../../store/useOrderStore";
import ButtonLoader from "../../components/common/ButtonLoader";

function Payment({ orderId, onClose }) {
  const navigate = useNavigate();

  const { userId } = useAuthStore();
  const { createOrder, savePayment } = usePaymentStore();
  const { getOrderById, order } = useOrderStore();

  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (window.Razorpay) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId);
    }
  }, [orderId, getOrderById]);

  console.log("Order in Payment component:", orderId);
  useEffect(() => {
    if (!order || hasOpenedRef.current || !window.Razorpay) return;

    hasOpenedRef.current = true;

    const openCheckout = async () => {
      try {
        const razorpayOrder = await createOrder(order.totalAmount);

        const options = {
          key: "rzp_test_RsMawJjoB61ua2",
          amount: razorpayOrder.order.amount,
          currency: "INR",
          name: "Plant Store",
          description: "Plant Purchase",
          order_id: razorpayOrder.order.id,

          handler: async (response) => {
            await savePayment({
              orderId: order._id,
              userId,
              amount: order.totalAmount,
              status: "Success",
              transactionId: response.razorpay_payment_id,
            });

            toast.success("Payment successful");
            onClose();
            navigate("/plants");
          },

          modal: {
            ondismiss: () => {
              toast("Payment cancelled");
              onClose();
            },
          },

          theme: {
            color: "#16a34a",
          },
        };

        new window.Razorpay(options).open();
      } catch (error) {
        toast.error("Payment failed");
        onClose();
      }
    };

    openCheckout();
  }, [order, createOrder, savePayment, userId, navigate, onClose]);

  return <div></div>;
}

export default Payment;
