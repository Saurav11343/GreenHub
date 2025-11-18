import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  message: null, // ✅ store backend message

  getAllCategories: async () => {
    try {
      set({ loading: true, error: null, message: null });

      const res = await axiosInstance.get("/category");

      if (res.data?.success) {
        set({
          categories: res.data.data,
        });
      }
      return res.data; // you can toast outside
    } catch (err) {
      const message = err.response?.data?.message || "Network error";
      set({ error: message });
      return { success: false, message };
    } finally {
      set({ loading: false });
    }
  },

  createCategory: async (data) => {
    try {
      set({ loading: true, error: null, message: null });

      const res = await axiosInstance.post("/category", data);

      if (res.data?.success) {
        set({
          message: res.data.message,
        });

        // Refresh categories after success
        await get().getAllCategories();
      } else {
        set({
          error: res.data.message || "Failed to create category",
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

  deleteCategory: async (id) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.delete(`/category/${id}`);

      if (res.data?.success) {
        set({
          message: res.data.message,
        });

        // refresh after delete
        await get().getAllCategories();
      } else {
        set({ error: res.data.message });
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
  updateCategory: async (id, data) => {
    try {
      set({ loading: true, error: null, message: null });

      const res = await axiosInstance.put(`/category/${id}`, data);

      if (res.data?.success) {
        set({
          message: res.data.message,
        });

        // Refresh category list after updating
        await get().getAllCategories();
      } else {
        set({
          error: res.data.message,
        });
      }

      return res.data; // return for toast
    } catch (err) {
      const message = err.response?.data?.message || "Network error";
      set({ error: message });
      return { success: false, message };
    } finally {
      set({ loading: false });
    }
  },
}));
