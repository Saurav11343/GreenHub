import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormField from "../../common/FormField";
import { createCategorySchema } from "../../../../../shared/validations/category.validation.js";

function CategoryFormModal({ isOpen, onClose, onSubmit, initialData, type }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createCategorySchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      image: null,
    },
  });

  // For showing preview
  const [previewImg, setPreviewImg] = useState(null);

  // Watch image input
  const watchImage = watch("image");

  // Create preview when image is selected
  useEffect(() => {
    if (watchImage && watchImage[0]) {
      const file = watchImage[0];
      setPreviewImg(URL.createObjectURL(file));
    }
  }, [watchImage]);

  // Prefill form when editing
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description,
        image: null, // user will upload new image if needed
      });

      // load existing image (from DB)
      setPreviewImg(initialData.imageUrl || null);
    } else {
      reset({
        name: "",
        description: "",
        image: null,
      });
      setPreviewImg(null);
    }
  }, [initialData, reset]);

  if (!isOpen) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box w-11/12 max-w-lg">
        <h3 className="font-bold text-lg">
          {type === "edit" ? "Edit Category" : "Add New Category"}
        </h3>

        <form className="py-4 space-y-3" onSubmit={handleSubmit(onSubmit)}>
          {/* IMAGE UPLOAD */}
          <FormField
            label="Category Image"
            as="image"
            register={register}
            registerName="image"
            preview={true}
          />

          {/* Show preview (if exists) */}
          {previewImg && (
            <div className="mt-3">
              <p className="text-sm opacity-70 mb-1">Preview:</p>
              <img
                src={previewImg}
                alt="Preview"
                className="h-24 w-24 rounded-lg object-cover shadow"
              />
            </div>
          )}
          {/* CATEGORY NAME */}
          <FormField
            label="Category Name"
            type="text"
            as="input"
            register={register}
            registerName="name"
            placeholder="Enter category name"
            error={errors.name}
          />

          {/* CATEGORY DESCRIPTION */}
          <FormField
            label="Category Description"
            as="textarea"
            register={register}
            registerName="description"
            placeholder="Enter description"
            rows={4}
            error={errors.description}
          />

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="btn btn-primary">
              {type === "edit" ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default CategoryFormModal;
