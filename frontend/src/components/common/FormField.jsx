import React, { useState } from "react";
import { Image as ImageIcon, Search } from "lucide-react";

function FormField({
  label,
  type = "text",
  as = "input", // "input" | "textarea" | "search" | "image"
  register,
  registerName,
  placeholder = "",
  error,
  rows = 4,
  icon,
  preview = false, // show preview for image input
  ...props
}) {
  const FieldTag = as === "textarea" ? "textarea" : "input";
  const isSearch = as === "search";
  const isImage = as === "image";

  // Preview state for image uploads
  const [imagePreview, setImagePreview] = useState(null);

  // Handle image input
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
    if (props.onChange) props.onChange(e);
  };

  return (
    <div className="form-control w-full mb-3">
      {/* Label */}
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}

      {/* SEARCH FIELD */}
      {isSearch && (
        <label className="input bg-base-100 flex items-center gap-2">
          {icon && <Search className="h-5 w-5 opacity-50" />}
          <input
            type="search"
            placeholder={placeholder}
            className="grow bg-transparent outline-none"
            {...register(registerName)}
            {...props}
          />
        </label>
      )}

      {/* IMAGE UPLOAD FIELD */}
      {isImage && (
        <div className="flex flex-col items-center">
          {/* Circular preview (clickable) */}
          <label className="relative cursor-pointer group">
            <img
              src={
                imagePreview || "/plant.jpg" // fallback image (change if needed)
              }
              alt="Preview"
              className="
          h-28 w-28 rounded-full object-cover shadow
          ring-2 ring-base-300
          transition group-hover:opacity-70
        "
            />

            {/* Hover overlay with icon */}
            <div
              className="
          absolute inset-0 flex items-center justify-center
          rounded-full bg-black/40 opacity-0
          group-hover:opacity-100 transition
        "
            >
              <ImageIcon className="h-7 w-7 text-white" />
            </div>

            {/* Hidden input */}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              {...register(registerName)}
              onChange={handleImageChange}
            />
          </label>

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>
      )}

      {/* NORMAL INPUT / TEXTAREA */}
      {!isSearch && !isImage && (
        <FieldTag
          type={as === "textarea" ? undefined : type}
          rows={as === "textarea" ? rows : undefined}
          placeholder={placeholder}
          {...register(registerName)}
          {...props}
          className={`${
            as === "textarea"
              ? "textarea textarea-bordered"
              : "input input-bordered"
          } w-full ${error ? "input-error textarea-error" : ""}`}
        />
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

export default FormField;
