import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useCartStore } from "./useCartStore";

export const usePaymentStore = create(() => ({
  createOrder: async (amount) => {
    const res = await axiosInstance.post("/payment/create-order", { amount });
    return res.data;
  },

  savePayment: async (data) => {
    const res = await axiosInstance.post("/payment/save", data);

    if (res.data?.success) {
      const { clearCartItem } = useCartStore.getState();
      await clearCartItem(data.userId);
    }

    return res.data;
  },
}));
