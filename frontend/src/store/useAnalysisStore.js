import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAnalysisStore = create((set) => ({
  summary: null,
  loading: false,
  error: null,

  getAdminDashboardSummary: async (filters = {}) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get("/analysis/", {
        params: filters,
      });

      if (res.data?.success) {
        set({
          summary: res.data.summary,
        });
      } else {
        set({
          summary: null,
          error: res.data?.message || "Failed to load dashboard summary",
        });
      }

      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load dashboard summary";

      set({
        error: message,
        summary: null,
      });

      return { success: false, message };
    } finally {
      set({ loading: false });
    }
  },

  clearSummary: () => {
    set({ summary: null, error: null });
  },
}));
