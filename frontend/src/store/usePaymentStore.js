import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useCartStore } from "./useCartStore";

export const usePaymentStore = create((set) => ({
  payments: [],
  totalCount: 0,
  loading: false,
  error: null,
  message: null,

  createRazorpayOrder: async (amount) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.post("/payment/create-order", {
        amount,
      });

      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to create payment order";
      set({ error: message });
      return { success: false, message };
    } finally {
      set({ loading: false });
    }
  },

  verifyPayment: async ({ orderId, userId, transactionId }) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.post("/payment/verify", {
        orderId,
        userId,
        transactionId,
      });

      set({ message: res.data?.message || null });
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Payment verification failed";
      set({ error: message });
      return { success: false, message };
    } finally {
      set({ loading: false });
    }
  },

  markPaymentFailed: async ({ orderId, userId }) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.post("/payment/failed", {
        orderId,
        userId,
      });

      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to mark payment as failed";
      set({ error: message });
      return { success: false, message };
    } finally {
      set({ loading: false });
    }
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

  getUserPayments: async (userId, filters = {}) => {
    try {
      set({
        payments: [],
        totalCount: 0,
        loading: true,
        error: null,
        message: null,
      });

      const res = await axiosInstance.get(`/payment/user/${userId}`, {
        params: filters,
      });

      if (res.data?.success) {
        set({
          payments: res.data.payments || [],
          totalCount: res.data.totalCount || 0,
        });
      } else {
        set({ error: res.data?.message || "Failed to fetch payments" });
      }

      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Network error while fetching payments";

      set({ error: message });
      return { success: false, message };
    } finally {
      set({ loading: false });
    }
  },

  clearPayment: () =>
    set({
      payments: [],
      totalCount: 0,
      loading: false,
      error: null,
      message: null,
    }),
}));
