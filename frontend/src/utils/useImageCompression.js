import imageCompression from "browser-image-compression";

export const useImageCompression = () => {
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    };

    return await imageCompression(file, options);
  };

  return { compressImage };
};
