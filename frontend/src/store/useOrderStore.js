import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useOrderStore = create((set) => ({
  orders: [],
  totalCount: 0,

  order: null,

  loading: false,
  error: null,
  message: null,

  // =========================
  // CREATE ORDER
  // =========================
  createOrder: async (data) => {
    try {
      set({ loading: true, error: null, message: null });

      const res = await axiosInstance.post("/order", {
        userId: data.userId,
        shippingAddress: data.shippingAddress,
      });

      if (res.data?.success) {
        set({ message: res.data.message });
      } else {
        set({ error: res.data.message || "Failed to create order" });
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

  // =========================
  // GET ORDER BY ID
  // =========================
  getOrderById: async (orderId) => {
    try {
      set({ loading: true, error: null, message: null, order: null });

      const res = await axiosInstance.get(`/order/${orderId}`);

      if (res.data?.success) {
        set({
          order: res.data.order,
          message: res.data.message,
        });
      } else {
        set({ error: res.data.message || "Failed to fetch order" });
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

  // =========================
  // ADMIN: GET ALL ORDERS
  // =========================
  getAllOrders: async () => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get("/order");

      if (res.data?.success) {
        set({
          orders: res.data.orders || [],
          totalCount: res.data.total || 0,
        });
      } else {
        set({
          orders: [],
          totalCount: 0,
        });
      }

      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch orders";

      set({
        error: message,
        orders: [],
        totalCount: 0,
      });

      return { success: false, message };
    } finally {
      set({ loading: false });
    }
  },

  // =========================
  // USER: GET OWN ORDERS
  // =========================
  getUserOrders: async (userId) => {
    try {
      set({
        orders: [],
        totalCount: 0,
        loading: true,
        error: null,
        message: null,
      });

      const res = await axiosInstance.get(`/order/user/${userId}`);

      if (res.data?.success) {
        set({
          orders: res.data.orders || [],
          totalCount: res.data.total || 0,
          message: res.data.message || null,
        });
      } else {
        set({
          error: res.data?.message || "Failed to fetch orders",
        });
      }

      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Network error while fetching orders";

      set({ error: message });
      return { success: false, message };
    } finally {
      set({ loading: false });
    }
  },
  // =========================
  // OPTIONAL: CLEAR STORE
  // =========================
  clearOrders: () =>
    set({
      orders: [],
      totalCount: 0,
      order: null,
      error: null,
      message: null,
    }),
}));
