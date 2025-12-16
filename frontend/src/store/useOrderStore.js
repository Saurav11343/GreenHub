import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useOrderStore = create((set) => ({
  orderItems: [],
  loading: false,
  error: null,
  message: null,

  createOrder: async (data) => {
    try {
      set({ loading: true, error: null, message: null });

      const res = await axiosInstance.post("/order", {
        userId: data.userId,
        shippingAddress: data.shippingAddress,
      });

      if (res.data?.success) {
        set({
          message: res.data.message,
        });
      } else {
        set({
          error: res.data.message || "Failed to create order",
        });
      }

      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors ||
        "Network error";

      set({ error: message });
      return { success: false, message };
    } finally {
      set({ loading: false });
    }
  },
}));
