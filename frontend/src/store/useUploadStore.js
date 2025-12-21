import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useUploadStore = create((set) => ({
  imageUrl: "",
  loading: false,

  uploadImage: async (file, folderName) => {
    try {
      set({ loading: true });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folderName", folderName);

      const res = await axiosInstance.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        set({ imageUrl: res.data.imageUrl });
      }

      return res.data.imageUrl;
    } catch (err) {
      console.error("Upload failed:", err);
      return null;
    } finally {
      set({ loading: false });
    }
  },
}));
