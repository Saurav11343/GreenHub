import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const usePlantCareStore = create((set) => ({
  plantCareList: [],
  plantCare: null,
  loading: false,
  error: null,
  message: null,

  getAllPlantCareTips: async () => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get("/plant/careInstructions");

      if (res.data?.success) {
        set({
          plantCareList: res.data.data,
        });
      } else {
        set({
          error: res.data.message || "Failed to fetch plant care tips",
        });
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Network error",
      });
    } finally {
      set({ loading: false });
    }
  },

  getPlantCareById: async (plantId) => {
    try {
      set({
        loading: true,
        error: null,
        plantCare: null,
        message: null,
      });

      const res = await axiosInstance.get(`/plant/careInstructions/${plantId}`);

      if (res.data?.success) {
        set({
          plantCare: res.data.data,
        });
      } else {
        set({
          error: res.data.message || "Failed to fetch plant care tips",
        });
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Network error",
      });
    } finally {
      set({ loading: false });
    }
  },

  updateCareInstructions: async (plantId, payload) => {
    try {
      set({ loading: true, error: null, message: null });

      const res = await axiosInstance.patch(
        `/plant/careInstructions/${plantId}`,
        payload
      );

      if (res.data?.success) {
        set({
          message: res.data.message,
          plantCare: {
            ...res.data.data,
          },
        });
        return res.data;
      } else {
        set({
          error: res.data.message || "Failed to update care instructions",
        });
        return res.data;
      }
    } catch (err) {
      const message = err.response?.data?.message || "Network error";
      set({ error: message });
      return { success: false, message };
    } finally {
      set({ loading: false });
    }
  },

  clearPlantCare: () =>
    set({
      plantCare: null,
      plantCareList: [],
      error: null,
      message: null,
    }),
}));
