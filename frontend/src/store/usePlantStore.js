import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const usePlantStore = create((set, get) => ({
  plants: [],
  plant: null,
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

  getPlantById: async (id) => {
    try {
      set({ loading: true, error: null, message: null });

      const res = await axiosInstance.get(`/plant/${id}`);

      if (res.data?.success) {
        set({
          plant: res.data.data,
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

        await get().getAllPlants();
      } else {
        set({
          error: res.data.message,
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
