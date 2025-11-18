import { create } from "zustand";

export const useUploadStore = create((set) => ({
  imageUrl: "",
  loading: false,

  uploadImage: async (file, folderName) => {
    try {
      set({ loading: true });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folderName", folderName);

      const res = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        set({ imageUrl: data.imageUrl });
      }

      return data.imageUrl;
    } catch (err) {
      console.log(err);
    } finally {
      set({ loading: false });
    }
  },
}));
