import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  loading: false,
  error: null,
  logoutLoading: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({
        authUser: res.data.user,
      });
    } catch (error) {
      console.log("Error in authCheck:", error);
      set({ authUser: null });
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
      set({ authUser: response.data });
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
      set({
        authUser: null,
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
