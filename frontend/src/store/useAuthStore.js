import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { usePaymentStore } from "./usePaymentStore";
import { useOrderStore } from "./useOrderStore";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  loading: false,
  error: null,
  logoutLoading: false,
  userId: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({
        authUser: res.data.user,
        userId: res.data.user?.userId || null,
      });
    } catch (error) {
      console.log("Error in authCheck:", error);
      set({ authUser: null, userId: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    try {
      set({ loading: true });
      const response = await axiosInstance.post("/auth/signup", data);
      return response.data;
    } catch (err) {
      if (err.response) return err.response.data;
      return { success: false, message: "Network error" };
    } finally {
      set({ loading: false });
    }
  },

  login: async (data) => {
    try {
      set({ loading: true });
      const response = await axiosInstance.post("/auth/login", data);
      const user = response.data.user;
      set({
        authUser: response.data.user,
        userId: user?.userId || null,
        isCheckingAuth: false,
      });
      return response.data;
    } catch (err) {
      if (err.response) return err.response.data;
      return { success: false, message: "Network error" };
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      set({ logoutLoading: true });
      const response = await axiosInstance.post("/auth/logout");
      usePaymentStore.getState().clearPayment();
      useOrderStore.getState().clearOrders();
      set({
        authUser: null,
        userId: null,
        isCheckingAuth: false,
      });

      return response.data;
    } catch (err) {
      if (err.response) return err.response.data;
      return { success: false, message: "Network error" };
    } finally {
      set({ logoutLoading: false });
    }
  },
}));
