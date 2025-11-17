import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useUploadStore = create((set) => ({
  imageUrl: "",
  loading: false,
  error: null,

  uploadImage: async (file, folder) => {
    try {
      set({ loading: true, error: null });

      if (!file) {
        return { success: false, message: "File is required" };
      }

      if (!folder) {
        return { success: false, message: "Folder is required" };
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      // IMPORTANT: use axiosInstance
      const response = await axiosInstance.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({ imageUrl: response.data.imageUrl });

      return {
        success: true,
        imageUrl: response.data.imageUrl,
      };
    } catch (err) {
      const message = err.response?.data?.message || "Upload failed";

      set({ error: message });

      return {
        success: false,
        message,
      };
    } finally {
      set({ loading: false });
    }
  },

  resetImage: () => set({ imageUrl: "" }),
}));
