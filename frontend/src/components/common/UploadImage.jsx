import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";

function ImageUpload({ initialImage, onFileSelect }) {
  const fallbackImage = "/plant.webp";

  const [preview, setPreview] = useState(fallbackImage);

  // Load initial image (edit mode)
  useEffect(() => {
    setPreview(initialImage || fallbackImage);
  }, [initialImage]);

  // When user picks a file
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  return (
    <div className="flex justify-center py-2">
      <div className="relative">
        {/* Preview image */}
        <img
          src={preview}
          alt="Category"
          className="h-32 w-32 rounded-full object-cover shadow-md border-2 border-base-300"
          onError={(e) => {
            e.target.src = fallbackImage; // fallback if broken URL
          }}
        />

        {/* Camera button */}
        <label
          htmlFor="imageInput"
          className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow cursor-pointer hover:bg-primary-focus transition"
        >
          <Camera className="h-4 w-4" />
        </label>

        {/* File input */}
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

export default ImageUpload;
