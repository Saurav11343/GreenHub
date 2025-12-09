import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const usePlantStore = create((set, get) => ({
  plants: [],
  loading: false,
  error: null,
  message: null,

  getAllPlants: async () => {
    try {
      set({ loading: true, error: null, message: null });

      const res = await axiosInstance.get("/plant");

      if (res.data?.success) {
        set({
          plants: res.data.data,
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

  createPlant: async (data) => {
    try {
      set({ loading: true, error: null, message: null });

      const res = await axiosInstance.post("/plant", data);

      if (res.data?.success) {
        set({
          message: res.data.message,
        });

        // Refresh plant after success
        await get().getAllPlants();
      } else {
        set({
          error: res.data.message || "Failed to create plant",
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
  deletePlant: async (id) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.delete(`/plant/${id}`);

      if (res.data?.success) {
        set({
          message: res.data.message,
        });

        // refresh after delete
        await get().getAllPlants();
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
  updatePlant: async (id, data) => {
    try {
      set({ loading: true, error: null, message: null });

      const res = await axiosInstance.put(`/plant/${id}`, data);

      if (res.data?.success) {
        set({
          message: res.data.message,
        });

        // Refresh plant list after updating
        await get().getAllPlants();
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
