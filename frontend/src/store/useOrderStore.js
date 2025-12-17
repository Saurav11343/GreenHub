import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useOrderStore = create((set) => ({
  
  orders: [],
  totalCount: 0,

  order: null,
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
}));
