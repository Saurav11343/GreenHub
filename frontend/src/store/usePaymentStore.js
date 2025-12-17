import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useCartStore } from "./useCartStore";

export const usePaymentStore = create((set) => ({
  loading: false,
  error: null,
  payments: [],
  totalCount: 0,

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

  getAllPayments: async (filters = {}) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get("/payment", {
        params: filters,
      });

      if (res.data?.success) {
        set({
          payments: res.data.payments,
          totalCount: res.data.totalCount,
        });
      }

      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch payments";

      set({ error: message });
      return { success: false, message };
    } finally {
      set({ loading: false });
    }
  },
}));
