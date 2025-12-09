import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useUploadStore = create((set) => ({
  // imageUrl: "",
  // loading: false,

  // uploadImage: async (file, folderName) => {
  //   try {
  //     set({ loading: true });

  //     const formData = new FormData();
  //     formData.append("file", file);
  //     formData.append("folderName", folderName);

  //     const res = await fetch("http://localhost:3000/api/upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const data = await res.json();

  //     if (data.success) {
  //       set({ imageUrl: data.imageUrl });
  //     }

  //     return data.imageUrl;
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     set({ loading: false });
  //   }
  // },

  imageUrl: "",
  loading: false,

  uploadImage: async (file, folderName) => {
    try {
      set({ loading: true });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folderName", folderName);

      // ✅ Cloudinary upload using axiosInstance
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
