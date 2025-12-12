import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useCartStore = create((set, get) => ({
  cartItems: [],
  loading: false,
  error: null,
  message: null,

  getUserCartItem: async (userId) => {
    try {
      set({ loading: true, error: null, message: null });

      const res = await axiosInstance.get(`/cartItem/${userId}`);

      if (res.data?.success) {
        set({
          cartItems: res.data.data,
        });
      }

      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Network error";
      set({ error: message });
      return { success: false, message };
    } finally {
      set({ loading: false });
    }
  },

  createCartItem: async (data) => {
    try {
      set({ loading: true, error: null, message: null });

      const res = await axiosInstance.post("/cartItem", data);

      if (res.data?.success) {
        set({
          message: res.data.message,
        });

        await get().getUserCartItem(data.userId);
      } else {
        set({
          error: res.data.message || "Failed to add item to cart",
        });
      }

      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Network error";
      set({ error: message });
      return { success: false, message };
    } finally {
      set({ loading: false });
    }
  },

  deleteCartItem: async (userId, cartId) => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await axiosInstance.delete(`/cartItem/${cartId}`);
      if (res.data?.success) {
        set({
          message: res.data.message,
        });
        await get().getUserCartItem(userId);
      } else {
        set({
          error: res.data.message || "Failed to delete cart item",
        });
      }
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Network error";
      set({ error: message });
      return { success: false, message };
    } finally {
      set({ loading: false });
    }
  },

  clearCartItem: async (userId) => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await axiosInstance.delete(`/cartItem/user/${userId}`);
      if (res.data?.success) {
        set({
          message: res.data.message,
          cartItems: [],
        });
        await get().getUserCartItem(userId);
      } else {
        set({
          error: res.data.message || "Failed to clear cart",
        });
      }
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Network error";
      set({ error: message });
      return { success: false, message };
    } finally {
      set({ loading: false });
    }
  },
}));
