import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const usePlantStockStore = create((set) => ({
  plantStocks: [],
  stockSummary: null,
  loading: false,
  error: null,
  message: null,

  getStockSummary: async () => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get("/plantStock/summary");

      if (res.data?.success) {
        set({ stockSummary: res.data.data });
      } else {
        set({ error: "Failed to fetch stock summary" });
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Network error",
      });
    } finally {
      set({ loading: false });
    }
  },

  getAllPlantStock: async () => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get("/plantStock/plants");

      if (res.data?.success) {
        set({ plantStocks: res.data.data });
      } else {
        set({ error: "Failed to fetch plant stock" });
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Network error",
      });
    } finally {
      set({ loading: false });
    }
  },

  getLowStockPlants: async (threshold = 5) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get(
        `/plantStock/low?threshold=${threshold}`
      );

      if (res.data?.success) {
        set({ plantStocks: res.data.data });
      } else {
        set({ error: "Failed to fetch low stock plants" });
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Network error",
      });
    } finally {
      set({ loading: false });
    }
  },

  updatePlantStock: async (plantId, stockQty) => {
    try {
      set({ loading: true, error: null, message: null });

      const res = await axiosInstance.patch(`/plantStock/plants/${plantId}`, {
        stockQty,
      });

      if (res.data?.success) {
        // Optimistic update
        set((state) => ({
          plantStocks: state.plantStocks.map((plant) =>
            plant._id === plantId ? { ...plant, stockQty } : plant
          ),
          message: "Stock updated successfully",
        }));

        return { success: true };
      } else {
        set({ error: res.data.message || "Failed to update stock" });
        return { success: false };
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update stock";
      set({ error: message });
      return { success: false, message };
    } finally {
      set({ loading: false });
    }
  },

  clearStockState: () => {
    set({
      plantStocks: [],
      stockSummary: null,
      loading: false,
      error: null,
      message: null,
    });
  },
}));
